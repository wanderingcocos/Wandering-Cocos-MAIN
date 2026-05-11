import { Router } from "express";
import { db, recipesTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";

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

router.get("/recipes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
    const [row] = await db.select().from(recipesTable).where(eq(recipesTable.id, id));
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

export default router;
