import { Router, type Request, type Response, type NextFunction } from "express";
import { db, bakeWindowsTable, bakeWindowItemsTable, ordersTable, siteSettingsTable, launchesTable, launchItemsTable } from "@workspace/db";
import { eq, desc, asc } from "drizzle-orm";

function pid(param: string | string[]): number { return parseInt(Array.isArray(param) ? param[0] : param); }

const router = Router();

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) { res.status(503).json({ error: "Admin not configured" }); return; }
  const token = req.headers["x-admin-token"] as string | undefined;
  if (!token || token !== secret) { res.status(401).json({ error: "Unauthorized" }); return; }
  next();
}

router.post("/admin/auth", (req: Request, res: Response) => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) { res.status(503).json({ error: "Admin not configured" }); return; }
  const { token } = req.body as { token?: string };
  if (!token || token !== secret) { res.status(401).json({ error: "Invalid token" }); return; }
  res.json({ ok: true });
});

// ── Bake Windows ──────────────────────────────────────────────────────────────

router.get("/admin/bake-windows", adminAuth, async (_req, res) => {
  try {
    const windows = await db.select().from(bakeWindowsTable).orderBy(desc(bakeWindowsTable.createdAt));
    const items = await db.select().from(bakeWindowItemsTable).orderBy(asc(bakeWindowItemsTable.bakeWindowId), asc(bakeWindowItemsTable.position));
    const result = windows.map(w => ({ ...w, items: items.filter(i => i.bakeWindowId === w.id) }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bake windows" });
  }
});

router.post("/admin/bake-windows", adminAuth, async (req, res) => {
  try {
    const { label, bakeDate, status, boxPrice, originalPrice, maxBoxes, notes } = req.body as {
      label: string; bakeDate: string; status?: string;
      boxPrice?: number; originalPrice?: number; maxBoxes?: number; notes?: string;
    };
    if (!label || !bakeDate) { res.status(400).json({ error: "label and bakeDate are required" }); return; }
    const [row] = await db.insert(bakeWindowsTable)
      .values({ label, bakeDate, status: status ?? "draft", boxPrice: boxPrice ?? 1299, originalPrice: originalPrice ?? 1999, maxBoxes: maxBoxes ?? 15, notes })
      .returning();
    res.json({ ...row, items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create bake window" });
  }
});

router.patch("/admin/bake-windows/:id", adminAuth, async (req, res) => {
  try {
    const id = pid(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
    const { label, bakeDate, status, boxPrice, originalPrice, maxBoxes, notes } = req.body as Partial<{
      label: string; bakeDate: string; status: string;
      boxPrice: number; originalPrice: number; maxBoxes: number; notes: string;
    }>;
    const [row] = await db.update(bakeWindowsTable)
      .set({ ...(label !== undefined && { label }), ...(bakeDate !== undefined && { bakeDate }), ...(status !== undefined && { status }), ...(boxPrice !== undefined && { boxPrice }), ...(originalPrice !== undefined && { originalPrice }), ...(maxBoxes !== undefined && { maxBoxes }), ...(notes !== undefined && { notes }) })
      .where(eq(bakeWindowsTable.id, id))
      .returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update bake window" });
  }
});

router.delete("/admin/bake-windows/:id", adminAuth, async (req, res) => {
  try {
    const id = pid(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
    await db.delete(bakeWindowsTable).where(eq(bakeWindowsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete bake window" });
  }
});

// ── Bake Window Items ─────────────────────────────────────────────────────────

router.get("/admin/bake-windows/:id/items", adminAuth, async (req, res) => {
  try {
    const id = pid(req.params.id);
    const items = await db.select().from(bakeWindowItemsTable)
      .where(eq(bakeWindowItemsTable.bakeWindowId, id))
      .orderBy(asc(bakeWindowItemsTable.position));
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

router.post("/admin/bake-windows/:id/items", adminAuth, async (req, res) => {
  try {
    const bakeWindowId = pid(req.params.id);
    const { name, description, position } = req.body as { name: string; description?: string; position?: number };
    if (!name) { res.status(400).json({ error: "name is required" }); return; }
    const [row] = await db.insert(bakeWindowItemsTable)
      .values({ bakeWindowId, name, description: description ?? null, position: position ?? 0 })
      .returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create item" });
  }
});

router.patch("/admin/bake-window-items/:itemId", adminAuth, async (req, res) => {
  try {
    const itemId = pid(req.params.itemId);
    const { name, description, position } = req.body as Partial<{ name: string; description: string; position: number }>;
    const [row] = await db.update(bakeWindowItemsTable)
      .set({ ...(name !== undefined && { name }), ...(description !== undefined && { description }), ...(position !== undefined && { position }) })
      .where(eq(bakeWindowItemsTable.id, itemId))
      .returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

router.delete("/admin/bake-window-items/:itemId", adminAuth, async (req, res) => {
  try {
    const itemId = pid(req.params.itemId);
    await db.delete(bakeWindowItemsTable).where(eq(bakeWindowItemsTable.id, itemId));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// ── Orders ────────────────────────────────────────────────────────────────────

router.get("/admin/orders", adminAuth, async (_req, res) => {
  try {
    const rows = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.patch("/admin/orders/:id", adminAuth, async (req, res) => {
  try {
    const id = pid(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
    const { status } = req.body as { status?: string };
    const [row] = await db.update(ordersTable)
      .set({ ...(status !== undefined && { status }) })
      .where(eq(ordersTable.id, id))
      .returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

router.post("/admin/orders", adminAuth, async (req, res) => {
  try {
    const { bakeWindowId, name, phone, address, qty, occasion, giftMessage, totalAmount } = req.body as {
      bakeWindowId?: number; name: string; phone: string; address: string;
      qty?: number; occasion?: string; giftMessage?: string; totalAmount: number;
    };
    if (!name || !phone || !address || !totalAmount) {
      res.status(400).json({ error: "name, phone, address, and totalAmount are required" }); return;
    }
    const [row] = await db.insert(ordersTable)
      .values({ bakeWindowId: bakeWindowId ?? null, name, phone, address, qty: qty ?? 1, occasion: occasion ?? "myself", giftMessage: giftMessage ?? null, status: "pending", totalAmount })
      .returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ── Settings ──────────────────────────────────────────────────────────────────

router.get("/admin/settings", adminAuth, async (_req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.post("/admin/settings", adminAuth, async (req, res) => {
  try {
    const { key, value } = req.body as { key?: string; value?: string };
    if (!key || value === undefined) { res.status(400).json({ error: "key and value are required" }); return; }
    const [row] = await db.insert(siteSettingsTable)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value, updatedAt: new Date() } })
      .returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save setting" });
  }
});

// ── Push Bake Window to Archive ───────────────────────────────────────────────

router.post("/admin/bake-windows/:id/archive", adminAuth, async (req, res) => {
  try {
    const id = pid(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }

    const [window] = await db.select().from(bakeWindowsTable).where(eq(bakeWindowsTable.id, id));
    if (!window) { res.status(404).json({ error: "Bake window not found" }); return; }

    const windowItems = await db.select().from(bakeWindowItemsTable)
      .where(eq(bakeWindowItemsTable.bakeWindowId, id))
      .orderBy(asc(bakeWindowItemsTable.position));

    const slug = window.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const [existing] = await db.select().from(launchesTable).where(eq(launchesTable.slug, slug));
    if (existing) {
      res.json({ created: false, launch: existing });
      return;
    }

    const [launch] = await db.insert(launchesTable)
      .values({ slug, title: window.label, bakeDate: window.bakeDate, notes: window.notes ?? null })
      .returning();

    if (windowItems.length > 0) {
      await db.insert(launchItemsTable).values(
        windowItems.map((item, i) => ({
          launchId: launch.id,
          name: item.name,
          description: item.description ?? null,
          position: i,
        }))
      );
    }

    res.json({ created: true, launch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to archive bake window" });
  }
});

export default router;
