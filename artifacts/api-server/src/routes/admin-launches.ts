import { Router, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import { db, launchesTable, launchItemsTable, recipesTable } from "@workspace/db";
import { eq, desc, asc } from "drizzle-orm";
import { uploadBufferToStorage } from "./storage";

function pid(param: string | string[]): number {
  return parseInt(Array.isArray(param) ? param[0] : param);
}

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) { res.status(503).json({ error: "Admin not configured" }); return; }
  const token = req.headers["x-admin-token"] as string | undefined;
  if (!token || token !== secret) { res.status(401).json({ error: "Unauthorized" }); return; }
  next();
}

// ── Image upload helper ────────────────────────────────────────────────────────

async function handleImageUpload(req: Request): Promise<{ buffer: Buffer; contentType: string }> {
  if (req.file) {
    return { buffer: req.file.buffer, contentType: req.file.mimetype };
  }
  const { base64, contentType } = req.body as { base64?: string; contentType?: string };
  if (!base64 || !contentType) {
    throw Object.assign(new Error("Provide an image file (multipart) or base64+contentType (JSON)"), { status: 400 });
  }
  return { buffer: Buffer.from(base64, "base64"), contentType };
}

// ── Launches (Archive) ────────────────────────────────────────────────────────

router.get("/admin/launches", adminAuth, async (_req, res) => {
  try {
    const launches = await db.select().from(launchesTable).orderBy(desc(launchesTable.bakeDate));
    const items = await db.select().from(launchItemsTable).orderBy(asc(launchItemsTable.launchId), asc(launchItemsTable.position));
    const result = launches.map(l => ({ ...l, items: items.filter(i => i.launchId === l.id) }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch launches" });
  }
});

router.post("/admin/launches", adminAuth, async (req, res) => {
  try {
    const { slug, title, bakeDate, notes } = req.body as { slug: string; title: string; bakeDate: string; notes?: string };
    if (!slug || !title || !bakeDate) { res.status(400).json({ error: "slug, title, and bakeDate are required" }); return; }
    const [row] = await db.insert(launchesTable)
      .values({ slug, title, bakeDate, notes: notes ?? null })
      .returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create launch" });
  }
});

router.patch("/admin/launches/:id", adminAuth, async (req, res) => {
  try {
    const id = pid(req.params.id);
    const { slug, title, bakeDate, notes } = req.body as Partial<{ slug: string; title: string; bakeDate: string; notes: string }>;
    const [row] = await db.update(launchesTable)
      .set({
        ...(slug !== undefined && { slug }),
        ...(title !== undefined && { title }),
        ...(bakeDate !== undefined && { bakeDate }),
        ...(notes !== undefined && { notes }),
      })
      .where(eq(launchesTable.id, id))
      .returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update launch" });
  }
});

router.delete("/admin/launches/:id", adminAuth, async (req, res) => {
  try {
    const id = pid(req.params.id);
    await db.delete(launchItemsTable).where(eq(launchItemsTable.launchId, id));
    await db.delete(launchesTable).where(eq(launchesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete launch" });
  }
});

// ── Launch Items ──────────────────────────────────────────────────────────────

// Admin.tsx posts to /admin/launches/:launchId/items
router.post("/admin/launches/:launchId/items", adminAuth, async (req, res) => {
  try {
    const launchId = pid(req.params.launchId);
    const { name, description, position } = req.body as { name: string; description?: string | null; position?: number };
    if (!name) { res.status(400).json({ error: "name is required" }); return; }
    const [row] = await db.insert(launchItemsTable)
      .values({ launchId, name, description: description ?? null, position: position ?? 0 })
      .returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create item" });
  }
});

router.patch("/admin/launch-items/:id", adminAuth, async (req, res) => {
  try {
    const itemId = pid(req.params.id);
    const { name, description, position } = req.body as Partial<{ name: string; description: string | null; position: number }>;
    const [row] = await db.update(launchItemsTable)
      .set({ ...(name !== undefined && { name }), ...(description !== undefined && { description }), ...(position !== undefined && { position }) })
      .where(eq(launchItemsTable.id, itemId))
      .returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

router.delete("/admin/launch-items/:id", adminAuth, async (req, res) => {
  try {
    const itemId = pid(req.params.id);
    await db.delete(launchItemsTable).where(eq(launchItemsTable.id, itemId));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// ── Launch Item Image Upload ───────────────────────────────────────────────────

router.patch("/admin/launch-items/:id/image", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const itemId = pid(req.params.id);
    if (!itemId) { res.status(400).json({ error: "Invalid item id" }); return; }

    const { buffer, contentType } = await handleImageUpload(req);
    const objectPath = await uploadBufferToStorage(buffer, contentType);

    const [row] = await db.update(launchItemsTable)
      .set({ imageFilename: objectPath })
      .where(eq(launchItemsTable.id, itemId))
      .returning();

    if (!row) { res.status(404).json({ error: "Item not found" }); return; }
    res.json({ objectPath, item: row });
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    console.error(err);
    res.status(status).json({ error: status === 400 ? String((err as Error).message) : "Failed to upload image" });
  }
});

// ── Recipes (Admin) ───────────────────────────────────────────────────────────

router.get("/admin/recipes", adminAuth, async (_req, res) => {
  try {
    const rows = await db.select().from(recipesTable).orderBy(asc(recipesTable.position), asc(recipesTable.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

router.post("/admin/recipes", adminAuth, async (req, res) => {
  try {
    const { title, subtitle, tags, body, serves, time, youtubeUrl, position } = req.body as {
      title: string; subtitle?: string; tags?: string; body?: string;
      serves?: string; time?: string; youtubeUrl?: string; position?: number;
    };
    if (!title) { res.status(400).json({ error: "title is required" }); return; }
    const [row] = await db.insert(recipesTable)
      .values({ title, subtitle: subtitle ?? null, tags: tags ?? null, body: body ?? "", serves: serves ?? null, time: time ?? null, youtubeUrl: youtubeUrl ?? null, position: position ?? 0 })
      .returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

router.patch("/admin/recipes/:id", adminAuth, async (req, res) => {
  try {
    const id = pid(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
    const { title, subtitle, tags, body, serves, time, youtubeUrl, position } = req.body as Partial<{
      title: string; subtitle: string; tags: string; body: string;
      serves: string; time: string; youtubeUrl: string; position: number;
    }>;
    const [row] = await db.update(recipesTable)
      .set({
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(tags !== undefined && { tags }),
        ...(body !== undefined && { body }),
        ...(serves !== undefined && { serves }),
        ...(time !== undefined && { time }),
        ...(youtubeUrl !== undefined && { youtubeUrl }),
        ...(position !== undefined && { position }),
      })
      .where(eq(recipesTable.id, id))
      .returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

router.delete("/admin/recipes/:id", adminAuth, async (req, res) => {
  try {
    const id = pid(req.params.id);
    await db.delete(recipesTable).where(eq(recipesTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

router.patch("/admin/recipes/:id/image", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const id = pid(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }

    const { buffer, contentType } = await handleImageUpload(req);
    const objectPath = await uploadBufferToStorage(buffer, contentType);

    const [row] = await db.update(recipesTable)
      .set({ imageFilename: objectPath })
      .where(eq(recipesTable.id, id))
      .returning();

    if (!row) { res.status(404).json({ error: "Recipe not found" }); return; }
    res.json({ objectPath, recipe: row });
  } catch (err: unknown) {
    const status = (err as { status?: number }).status ?? 500;
    console.error(err);
    res.status(status).json({ error: status === 400 ? String((err as Error).message) : "Failed to upload image" });
  }
});

export default router;
