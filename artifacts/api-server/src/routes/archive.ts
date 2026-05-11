import { Router } from "express";
import { db, launchesTable, launchItemsTable, ratingsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/archive", async (_req, res) => {
  try {
    const launches = await db
      .select()
      .from(launchesTable)
      .orderBy(launchesTable.bakeDate);

    const items = await db
      .select({
        id: launchItemsTable.id,
        launchId: launchItemsTable.launchId,
        name: launchItemsTable.name,
        description: launchItemsTable.description,
        imageFilename: launchItemsTable.imageFilename,
        position: launchItemsTable.position,
        avgStars: sql<string>`COALESCE(AVG(${ratingsTable.stars}), 0)`,
        voteCount: sql<string>`COUNT(${ratingsTable.id})`,
      })
      .from(launchItemsTable)
      .leftJoin(ratingsTable, eq(ratingsTable.itemId, launchItemsTable.id))
      .groupBy(launchItemsTable.id)
      .orderBy(launchItemsTable.launchId, launchItemsTable.position);

    const result = launches.map((launch) => ({
      ...launch,
      items: items
        .filter((item) => item.launchId === launch.id)
        .map((item) => ({
          ...item,
          avgStars: parseFloat(item.avgStars) || 0,
          voteCount: parseInt(item.voteCount) || 0,
        })),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch archive" });
  }
});

router.get("/archive/:slug", async (req, res) => {
  try {
    const [launch] = await db.select().from(launchesTable).where(eq(launchesTable.slug, req.params.slug));
    if (!launch) { res.status(404).json({ error: "Not found" }); return; }

    const items = await db
      .select({
        id: launchItemsTable.id,
        launchId: launchItemsTable.launchId,
        name: launchItemsTable.name,
        description: launchItemsTable.description,
        imageFilename: launchItemsTable.imageFilename,
        position: launchItemsTable.position,
        avgStars: sql<string>`COALESCE(AVG(${ratingsTable.stars}), 0)`,
        voteCount: sql<string>`COUNT(${ratingsTable.id})`,
      })
      .from(launchItemsTable)
      .leftJoin(ratingsTable, eq(ratingsTable.itemId, launchItemsTable.id))
      .where(eq(launchItemsTable.launchId, launch.id))
      .groupBy(launchItemsTable.id)
      .orderBy(launchItemsTable.position);

    res.json({
      ...launch,
      items: items.map(item => ({
        ...item,
        avgStars: parseFloat(item.avgStars) || 0,
        voteCount: parseInt(item.voteCount) || 0,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch archive entry" });
  }
});

router.post("/archive/items/:itemId/rate", async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const { stars, voterId } = req.body as { stars: number; voterId: string };

  if (!itemId || !stars || stars < 1 || stars > 5 || !voterId) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    await db
      .insert(ratingsTable)
      .values({ itemId, stars, voterId })
      .onConflictDoUpdate({
        target: [ratingsTable.itemId, ratingsTable.voterId],
        set: { stars },
      });

    const [agg] = await db
      .select({
        avgStars: sql<string>`COALESCE(AVG(${ratingsTable.stars}), 0)`,
        voteCount: sql<string>`COUNT(${ratingsTable.id})`,
      })
      .from(ratingsTable)
      .where(eq(ratingsTable.itemId, itemId));

    return res.json({
      avgStars: parseFloat(agg.avgStars) || 0,
      voteCount: parseInt(agg.voteCount) || 0,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to save rating" });
  }
});

export default router;
