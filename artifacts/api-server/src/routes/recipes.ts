import { Router } from "express";
import { db, recipesTable } from "@workspace/db";
import { asc } from "drizzle-orm";

const router = Router();

router.get("/recipes", async (_req, res) => {
  try {
    const rows = await db.select().from(recipesTable).orderBy(asc(recipesTable.position), asc(recipesTable.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

export default router;
