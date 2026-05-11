import { Router } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";

const router = Router();

router.get("/testimonials", async (_req, res) => {
  try {
    const rows = await db.select().from(testimonialsTable)
      .where(eq(testimonialsTable.visible, true))
      .orderBy(asc(testimonialsTable.position), asc(testimonialsTable.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

export default router;
