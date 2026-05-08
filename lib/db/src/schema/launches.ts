import { pgTable, serial, text, date, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const launchesTable = pgTable("launches", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  bakeDate: date("bake_date").notNull(),
  notes: text("notes"),
});

export const launchItemsTable = pgTable("launch_items", {
  id: serial("id").primaryKey(),
  launchId: integer("launch_id").notNull().references(() => launchesTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  imageFilename: text("image_filename"),
  position: integer("position").notNull().default(0),
});

export const ratingsTable = pgTable("ratings", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull().references(() => launchItemsTable.id, { onDelete: "cascade" }),
  stars: integer("stars").notNull(),
  voterId: text("voter_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  unique("unique_item_voter").on(t.itemId, t.voterId),
]);

export const insertLaunchSchema = createInsertSchema(launchesTable).omit({ id: true });
export const insertLaunchItemSchema = createInsertSchema(launchItemsTable).omit({ id: true });
export const insertRatingSchema = createInsertSchema(ratingsTable).omit({ id: true, createdAt: true });

export type Launch = typeof launchesTable.$inferSelect;
export type LaunchItem = typeof launchItemsTable.$inferSelect;
export type Rating = typeof ratingsTable.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
