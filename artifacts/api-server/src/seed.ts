/**
 * Idempotent seeder — runs at API server startup.
 * Each block checks for existence before inserting, so it is safe to run on every boot.
 */
import { db, bakeryAddonsTable } from "@workspace/db";
import { count } from "drizzle-orm";

export async function seedIfEmpty() {
  try {
    const [{ value: addonCount }] = await db.select({ value: count() }).from(bakeryAddonsTable);

    if (addonCount === 0) {
      await db.insert(bakeryAddonsTable).values([
        {
          title: "Artisanal Sourdough Boule",
          description:
            "Our signature long-fermented sourdough. Crisp crust, open crumb, clean ingredients. Baked to order — minimum 72-hour ferment.",
          pricePaise: 26000,
          imageUrl: "/images/addon-sourdough-boule.png",
          available: true,
          preorderCloseDate: null,
        },
        {
          title: "Small Wandering Box",
          description:
            "A curated selection of our smallest bakes — cookies, a mini loaf, and a seasonal treat. Packaged for gifting or a quiet indulgence.",
          pricePaise: 59900,
          imageUrl: "/images/addon-wandering-box.png",
          available: true,
          preorderCloseDate: null,
        },
      ]);
      console.log("[seed] Inserted 2 bakery add-on products.");
    }
  } catch (err) {
    console.warn("[seed] Seeder skipped (table may not exist yet):", (err as Error).message);
  }
}
