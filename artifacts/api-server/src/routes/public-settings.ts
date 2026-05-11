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

      if (window) {
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

        if (total >= window.maxBoxes) {
          res.json({ mode: "sold_out" });
          return;
        }
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
