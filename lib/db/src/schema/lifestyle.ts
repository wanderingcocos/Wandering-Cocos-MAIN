import { pgTable, serial, text, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";

export const bakeryAddonsTable = pgTable("bakery_addons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  pricePaise: integer("price_paise").notNull(),
  imageUrl: text("image_url"),
  available: boolean("available").notNull().default(true),
  preorderCloseDate: date("preorder_close_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const journalEventsTable = pgTable("journal_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body"),
  mediaUrls: text("media_urls").array(),
  embedUrl: text("embed_url"),
  eventDate: date("event_date"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BakeryAddon = typeof bakeryAddonsTable.$inferSelect;
export type JournalEvent = typeof journalEventsTable.$inferSelect;
