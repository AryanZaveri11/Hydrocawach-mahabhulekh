import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const states = pgTable("states", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameHi: text("name_hi").notNull(),
  nameLocal: text("name_local"),
});

export const districts = pgTable("districts", {
  id: serial("id").primaryKey(),
  stateId: integer("state_id").notNull(),
  code: text("code").notNull(),
  nameEn: text("name_en").notNull(),
  nameHi: text("name_hi").notNull(),
  nameLocal: text("name_local"),
});

export const talukas = pgTable("talukas", {
  id: serial("id").primaryKey(),
  districtId: integer("district_id").notNull(),
  code: text("code").notNull(),
  nameEn: text("name_en").notNull(),
  nameHi: text("name_hi").notNull(),
  nameLocal: text("name_local"),
});

export const villages = pgTable("villages", {
  id: serial("id").primaryKey(),
  talukaId: integer("taluka_id").notNull(),
  code: text("code").notNull(),
  nameEn: text("name_en").notNull(),
  nameHi: text("name_hi").notNull(),
  nameLocal: text("name_local"),
});

export const landRecords = pgTable("land_records", {
  id: serial("id").primaryKey(),
  propertyUid: text("property_uid").unique(),
  villageId: integer("village_id").notNull(),
  surveyNumber: text("survey_number").notNull(),
  subdivisionNumber: text("subdivision_number"),
  ownerName: text("owner_name").notNull(),
  fatherName: text("father_name"),
  area: text("area"),
  classification: text("classification"),
  type: text("type").notNull(), // 7/12, 8A, property-card, k-prat
  recordData: json("record_data"), // Store detailed record information
  createdAt: timestamp("created_at").defaultNow(),
});

export const searchRequests = pgTable("search_requests", {
  id: serial("id").primaryKey(),
  mobileNumber: text("mobile_number").notNull(),
  stateId: integer("state_id"),
  districtId: integer("district_id"),
  talukaId: integer("taluka_id"),
  villageId: integer("village_id"),
  surveyNumber: text("survey_number"),
  subdivisionNumber: text("subdivision_number"),
  ownerName: text("owner_name"),
  recordType: text("record_type").notNull(),
  propertyUid: text("property_uid"),
  language: text("language").notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertStateSchema = createInsertSchema(states).omit({ id: true });
export const insertDistrictSchema = createInsertSchema(districts).omit({ id: true });
export const insertTalukaSchema = createInsertSchema(talukas).omit({ id: true });
export const insertVillageSchema = createInsertSchema(villages).omit({ id: true });
export const insertLandRecordSchema = createInsertSchema(landRecords).omit({ id: true, createdAt: true });
export const insertSearchRequestSchema = createInsertSchema(searchRequests).omit({ 
  id: true, 
  createdAt: true, 
  status: true 
});

// Types
export type State = typeof states.$inferSelect;
export type District = typeof districts.$inferSelect;
export type Taluka = typeof talukas.$inferSelect;
export type Village = typeof villages.$inferSelect;
export type LandRecord = typeof landRecords.$inferSelect;
export type SearchRequest = typeof searchRequests.$inferSelect;

export type InsertState = z.infer<typeof insertStateSchema>;
export type InsertDistrict = z.infer<typeof insertDistrictSchema>;
export type InsertTaluka = z.infer<typeof insertTalukaSchema>;
export type InsertVillage = z.infer<typeof insertVillageSchema>;
export type InsertLandRecord = z.infer<typeof insertLandRecordSchema>;
export type InsertSearchRequest = z.infer<typeof insertSearchRequestSchema>;

// Form validation schemas
export const landRecordSearchSchema = z.object({
  recordType: z.enum(["7-12", "8a", "property-card", "k-prat"]),
  searchMode: z.enum(["manual", "uid"]),
  propertyUid: z.string().optional(),
  stateId: z.number().optional(),
  districtId: z.number().optional(),
  talukaId: z.number().optional(),
  villageId: z.number().optional(),
  surveyNumber: z.string().optional(),
  subdivisionNumber: z.string().optional(),
  ownerName: z.string().optional(),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  language: z.string(),
  captcha: z.string().min(1, "Captcha is required"),
});

export type LandRecordSearchForm = z.infer<typeof landRecordSearchSchema>;
