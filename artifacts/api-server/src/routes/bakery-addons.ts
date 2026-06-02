import { Router, type Request, type Response, type NextFunction } from "express";
import { db, bakeryAddonsTable } from "@workspace/db";
import { eq, asc, desc } from "drizzle-orm";

const router = Router();

function pid(param: string | string[]): number { return parseInt(Array.isArray(param) ? param[0] : param); }

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) { res.status(503).json({ error: "Admin not configured" }); return; }
  const token = req.headers["x-admin-token"] as string | undefined;
  if (!token || token !== secret) { res.status(401).json({ error: "Unauthorized" }); return; }
  next();
}

// Public — available add-ons only
router.get("/bakery-addons", async (_req, res) => {
  try {
    const rows = await db.select().from(bakeryAddonsTable)
      .where(eq(bakeryAddonsTable.available, true))
      .orderBy(asc(bakeryAddonsTable.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch add-ons" });
  }
});

// Admin — all add-ons
router.get("/admin/bakery-addons", adminAuth, async (_req, res) => {
  try {
    const rows = await db.select().from(bakeryAddonsTable).orderBy(desc(bakeryAddonsTable.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch add-ons" });
  }
});

router.post("/admin/bakery-addons", adminAuth, async (req, res) => {
  try {
    const { title, description, pricePaise, imageUrl, available, preorderCloseDate } = req.body as {
      title: string; description?: string; pricePaise: number;
      imageUrl?: string; available?: boolean; preorderCloseDate?: string;
    };
    if (!title || pricePaise === undefined) { res.status(400).json({ error: "title and pricePaise are required" }); return; }
    const [row] = await db.insert(bakeryAddonsTable).values({
      title, description: description ?? null, pricePaise,
      imageUrl: imageUrl ?? null, available: available ?? true,
      preorderCloseDate: preorderCloseDate ?? null,
    }).returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create add-on" });
  }
});

router.patch("/admin/bakery-addons/:id", adminAuth, async (req, res) => {
  try {
    const id = pid(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
    const { title, description, pricePaise, imageUrl, available, preorderCloseDate } = req.body as Partial<{
      title: string; description: string | null; pricePaise: number;
      imageUrl: string | null; available: boolean; preorderCloseDate: string | null;
    }>;
    const [row] = await db.update(bakeryAddonsTable).set({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(pricePaise !== undefined && { pricePaise }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(available !== undefined && { available }),
      ...(preorderCloseDate !== undefined && { preorderCloseDate }),
    }).where(eq(bakeryAddonsTable.id, id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update add-on" });
  }
});

router.delete("/admin/bakery-addons/:id", adminAuth, async (req, res) => {
  try {
    const id = pid(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
    await db.delete(bakeryAddonsTable).where(eq(bakeryAddonsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete add-on" });
  }
});

export default router;
