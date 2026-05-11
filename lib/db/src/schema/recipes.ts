import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const recipesTable = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  tags: text("tags"),
  body: text("body").notNull().default(""),
  serves: text("serves"),
  time: text("time"),
  youtubeUrl: text("youtube_url"),
  imageFilename: text("image_filename"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRecipeSchema = createInsertSchema(recipesTable).omit({ id: true, createdAt: true });

export type Recipe = typeof recipesTable.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
