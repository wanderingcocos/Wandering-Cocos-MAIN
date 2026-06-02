import { Router, type Request, type Response, type NextFunction } from "express";
import { db, journalEventsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

function pid(param: string | string[]): number { return parseInt(Array.isArray(param) ? param[0] : param); }

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) { res.status(503).json({ error: "Admin not configured" }); return; }
  const token = req.headers["x-admin-token"] as string | undefined;
  if (!token || token !== secret) { res.status(401).json({ error: "Unauthorized" }); return; }
  next();
}

// Public — published events only
router.get("/journal", async (_req, res) => {
  try {
    const rows = await db.select().from(journalEventsTable)
      .where(eq(journalEventsTable.published, true))
      .orderBy(desc(journalEventsTable.eventDate), desc(journalEventsTable.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch journal events" });
  }
});

// Admin — all events
router.get("/admin/journal", adminAuth, async (_req, res) => {
  try {
    const rows = await db.select().from(journalEventsTable).orderBy(desc(journalEventsTable.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch journal events" });
  }
});

router.post("/admin/journal", adminAuth, async (req, res) => {
  try {
    const { title, body, mediaUrls, embedUrl, eventDate, published } = req.body as {
      title: string; body?: string; mediaUrls?: string[];
      embedUrl?: string; eventDate?: string; published?: boolean;
    };
    if (!title) { res.status(400).json({ error: "title is required" }); return; }
    const [row] = await db.insert(journalEventsTable).values({
      title, body: body ?? null,
      mediaUrls: mediaUrls && mediaUrls.length > 0 ? mediaUrls : null,
      embedUrl: embedUrl ?? null, eventDate: eventDate ?? null,
      published: published ?? false,
    }).returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create journal event" });
  }
});

router.patch("/admin/journal/:id", adminAuth, async (req, res) => {
  try {
    const id = pid(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
    const { title, body, mediaUrls, embedUrl, eventDate, published } = req.body as Partial<{
      title: string; body: string | null; mediaUrls: string[] | null;
      embedUrl: string | null; eventDate: string | null; published: boolean;
    }>;
    const [row] = await db.update(journalEventsTable).set({
      ...(title !== undefined && { title }),
      ...(body !== undefined && { body }),
      ...(mediaUrls !== undefined && { mediaUrls }),
      ...(embedUrl !== undefined && { embedUrl }),
      ...(eventDate !== undefined && { eventDate }),
      ...(published !== undefined && { published }),
    }).where(eq(journalEventsTable.id, id)).returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update journal event" });
  }
});

router.delete("/admin/journal/:id", adminAuth, async (req, res) => {
  try {
    const id = pid(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
    await db.delete(journalEventsTable).where(eq(journalEventsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete journal event" });
  }
});

export default router;
