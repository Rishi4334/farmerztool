import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  location: text("location"),
  language: text("language").default("english"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crops = pgTable("crops", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameHindi: text("name_hindi"),
  nameTelugu: text("name_telugu"),
  category: text("category").notNull(),
  currentPrice: numeric("current_price", { precision: 10, scale: 2 }),
  unit: text("unit").default("quintal"),
});

export const diseaseDetections = pgTable("disease_detections", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  cropId: varchar("crop_id", { length: 36 }).references(() => crops.id),
  imageUrl: text("image_url").notNull(),
  detectedDisease: text("detected_disease"),
  confidence: numeric("confidence", { precision: 5, scale: 2 }),
  treatment: text("treatment"),
  detectedAt: timestamp("detected_at").defaultNow(),
});

export const listings = pgTable("listings", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  cropId: varchar("crop_id", { length: 36 }).references(() => crops.id),
  quantity: integer("quantity").notNull(),
  pricePerUnit: numeric("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  location: text("location").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketPrices = pgTable("market_prices", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  cropId: varchar("crop_id", { length: 36 }).references(() => crops.id),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  priceChange: numeric("price_change", { precision: 10, scale: 2 }),
  market: text("market").notNull(),
  date: timestamp("date").defaultNow(),
});

export const weatherAlerts = pgTable("weather_alerts", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  alertType: text("alert_type").notNull(),
  severity: text("severity").notNull(),
  message: text("message").notNull(),
  messageHindi: text("message_hindi"),
  messageTelugu: text("message_telugu"),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  phone: true,
  location: true,
  language: true,
});

export const insertCropSchema = createInsertSchema(crops).pick({
  name: true,
  nameHindi: true,
  nameTelugu: true,
  category: true,
  currentPrice: true,
  unit: true,
});

export const insertDiseaseDetectionSchema = createInsertSchema(diseaseDetections).pick({
  userId: true,
  cropId: true,
  imageUrl: true,
  detectedDisease: true,
  confidence: true,
  treatment: true,
});

export const insertListingSchema = createInsertSchema(listings).pick({
  userId: true,
  cropId: true,
  quantity: true,
  pricePerUnit: true,
  location: true,
  description: true,
});

export const insertMarketPriceSchema = createInsertSchema(marketPrices).pick({
  cropId: true,
  price: true,
  priceChange: true,
  market: true,
});

export const insertWeatherAlertSchema = createInsertSchema(weatherAlerts).pick({
  location: true,
  alertType: true,
  severity: true,
  message: true,
  messageHindi: true,
  messageTelugu: true,
  validUntil: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCrop = z.infer<typeof insertCropSchema>;
export type Crop = typeof crops.$inferSelect;
export type InsertDiseaseDetection = z.infer<typeof insertDiseaseDetectionSchema>;
export type DiseaseDetection = typeof diseaseDetections.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listings.$inferSelect;
export type InsertMarketPrice = z.infer<typeof insertMarketPriceSchema>;
export type MarketPrice = typeof marketPrices.$inferSelect;
export type InsertWeatherAlert = z.infer<typeof insertWeatherAlertSchema>;
export type WeatherAlert = typeof weatherAlerts.$inferSelect;
