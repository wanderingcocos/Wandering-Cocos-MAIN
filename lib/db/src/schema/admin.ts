import { pgTable, serial, text, date, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bakeWindowsTable = pgTable("bake_windows", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  bakeDate: date("bake_date").notNull(),
  status: text("status").notNull().default("draft"),
  boxPrice: integer("box_price").notNull().default(1299),
  originalPrice: integer("original_price").notNull().default(1999),
  maxBoxes: integer("max_boxes").notNull().default(15),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bakeWindowItemsTable = pgTable("bake_window_items", {
  id: serial("id").primaryKey(),
  bakeWindowId: integer("bake_window_id").notNull().references(() => bakeWindowsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  position: integer("position").notNull().default(0),
});

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  bakeWindowId: integer("bake_window_id").references(() => bakeWindowsTable.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  qty: integer("qty").notNull().default(1),
  occasion: text("occasion").notNull().default("myself"),
  giftMessage: text("gift_message"),
  status: text("status").notNull().default("pending"),
  totalAmount: integer("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettingsTable = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const testimonialsTable = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  location: text("location"),
  body: text("body").notNull(),
  visible: boolean("visible").notNull().default(true),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Testimonial = typeof testimonialsTable.$inferSelect;

export const insertBakeWindowSchema = createInsertSchema(bakeWindowsTable).omit({ id: true, createdAt: true });
export const insertBakeWindowItemSchema = createInsertSchema(bakeWindowItemsTable).omit({ id: true });
export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });

export type BakeWindow = typeof bakeWindowsTable.$inferSelect;
export type BakeWindowItem = typeof bakeWindowItemsTable.$inferSelect;
export type Order = typeof ordersTable.$inferSelect;
export type SiteSetting = typeof siteSettingsTable.$inferSelect;
export type InsertBakeWindow = z.infer<typeof insertBakeWindowSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
