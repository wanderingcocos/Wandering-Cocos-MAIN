import { Router } from "express";
import { db, siteSettingsTable, bakeWindowsTable, bakeWindowItemsTable, ordersTable } from "@workspace/db";
import { eq, asc, and, or, count } from "drizzle-orm";

const router = Router();

router.get("/settings", async (_req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable);
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.get("/site-status", async (_req, res) => {
  try {
    const [modeSetting] = await db
      .select()
      .from(siteSettingsTable)
      .where(eq(siteSettingsTable.key, "site_mode"));

    const mode = modeSetting?.value ?? "bake_day";

    if (mode === "bake_day") {
      const [window] = await db
        .select()
        .from(bakeWindowsTable)
        .where(eq(bakeWindowsTable.status, "announced"))
        .orderBy(asc(bakeWindowsTable.bakeDate))
        .limit(1);

      if (!window) {
        res.json({ mode: "sold_out" });
        return;
      }

      const [{ total }] = await db
        .select({ total: count() })
        .from(ordersTable)
        .where(
          and(
            eq(ordersTable.bakeWindowId, window.id),
            or(
              eq(ordersTable.status, "pending"),
              eq(ordersTable.status, "confirmed"),
            ),
          ),
        );

      const limitRows = await db
        .select()
        .from(siteSettingsTable)
        .where(
          or(
            eq(siteSettingsTable.key, "max_wandering_boxes"),
            eq(siteSettingsTable.key, "max_small_boxes"),
            eq(siteSettingsTable.key, "max_sourdough_boules"),
          ),
        );
      const limitsMap: Record<string, string> = {};
      for (const row of limitRows) limitsMap[row.key] = row.value;

      const maxWandering = parseInt(limitsMap.max_wandering_boxes ?? "");
      const maxSmall = parseInt(limitsMap.max_small_boxes ?? "");
      const maxBoule = parseInt(limitsMap.max_sourdough_boules ?? "");

      const wanderingBoxSoldOut = !Number.isNaN(maxWandering) && (maxWandering === 0 || total >= maxWandering);
      const smallBoxSoldOut = !Number.isNaN(maxSmall) && maxSmall === 0;
      const bouleSoldOut = !Number.isNaN(maxBoule) && maxBoule === 0;

      if (wanderingBoxSoldOut && smallBoxSoldOut && bouleSoldOut) {
        res.json({ mode: "sold_out" });
        return;
      }
    }

    res.json({ mode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch site status" });
  }
});

router.get("/bake-window/current", async (_req, res) => {
  try {
    const [window] = await db
      .select()
      .from(bakeWindowsTable)
      .where(eq(bakeWindowsTable.status, "announced"))
      .orderBy(asc(bakeWindowsTable.bakeDate))
      .limit(1);

    if (!window) {
      res.json(null);
      return;
    }

    const items = await db
      .select()
      .from(bakeWindowItemsTable)
      .where(eq(bakeWindowItemsTable.bakeWindowId, window.id))
      .orderBy(asc(bakeWindowItemsTable.position));

    res.json({ ...window, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch current bake window" });
  }
});

export default router;
