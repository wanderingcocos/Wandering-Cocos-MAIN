import { Router, type Request, type Response, type NextFunction } from "express";
import { db, bakeWindowsTable, ordersTable, siteSettingsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    res.status(503).json({ error: "Admin not configured" });
    return;
  }
  const token = req.headers["x-admin-token"] as string | undefined;
  if (!token || token !== secret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/admin/auth", (req: Request, res: Response) => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    res.status(503).json({ error: "Admin not configured" });
    return;
  }
  const { token } = req.body as { token?: string };
  if (!token || token !== secret) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  res.json({ ok: true });
});

router.get("/admin/bake-windows", adminAuth, async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(bakeWindowsTable)
      .orderBy(desc(bakeWindowsTable.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bake windows" });
  }
});

router.post("/admin/bake-windows", adminAuth, async (req, res) => {
  try {
    const { label, bakeDate, status, boxPrice, originalPrice, maxBoxes, notes } = req.body as {
      label: string;
      bakeDate: string;
      status?: string;
      boxPrice?: number;
      originalPrice?: number;
      maxBoxes?: number;
      notes?: string;
    };
    if (!label || !bakeDate) {
      res.status(400).json({ error: "label and bakeDate are required" });
      return;
    }
    const [row] = await db
      .insert(bakeWindowsTable)
      .values({ label, bakeDate, status: status ?? "draft", boxPrice: boxPrice ?? 1299, originalPrice: originalPrice ?? 1999, maxBoxes: maxBoxes ?? 15, notes })
      .returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create bake window" });
  }
});

router.patch("/admin/bake-windows/:id", adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
    const { label, bakeDate, status, boxPrice, originalPrice, maxBoxes, notes } = req.body as Partial<{
      label: string;
      bakeDate: string;
      status: string;
      boxPrice: number;
      originalPrice: number;
      maxBoxes: number;
      notes: string;
    }>;
    const [row] = await db
      .update(bakeWindowsTable)
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
    const id = parseInt(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
    await db.delete(bakeWindowsTable).where(eq(bakeWindowsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete bake window" });
  }
});

router.get("/admin/orders", adminAuth, async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.patch("/admin/orders/:id", adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
    const { status } = req.body as { status?: string };
    const [row] = await db
      .update(ordersTable)
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
    if (!key || value === undefined) {
      res.status(400).json({ error: "key and value are required" });
      return;
    }
    const [row] = await db
      .insert(siteSettingsTable)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value, updatedAt: new Date() } })
      .returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save setting" });
  }
});

router.post("/admin/orders", adminAuth, async (req, res) => {
  try {
    const { bakeWindowId, name, phone, address, qty, occasion, giftMessage, totalAmount } = req.body as {
      bakeWindowId?: number;
      name: string;
      phone: string;
      address: string;
      qty?: number;
      occasion?: string;
      giftMessage?: string;
      totalAmount: number;
    };
    if (!name || !phone || !address || !totalAmount) {
      res.status(400).json({ error: "name, phone, address, and totalAmount are required" });
      return;
    }
    const [row] = await db
      .insert(ordersTable)
      .values({ bakeWindowId: bakeWindowId ?? null, name, phone, address, qty: qty ?? 1, occasion: occasion ?? "myself", giftMessage: giftMessage ?? null, status: "pending", totalAmount })
      .returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;
