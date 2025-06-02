import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Credentialing schemas
export const credentialingRequestSchema = z.object({
  resume: z.string().min(1, "Resume is required"),
  medical_license: z.string().min(1, "Medical license is required"),
  dea_id: z.string().min(1, "DEA ID is required"),
  malpractice_insurance: z.string().min(1, "Malpractice insurance is required"),
  board_certification: z.string().min(1, "Board certification is required"),
  caqh_attestation: z.string().min(1, "CAQH attestation is required"),
  w9: z.string().min(1, "W-9 form is required"),
});

export const evaluationResultSchema = z.object({
  doctor_name: z.string(),
  result: z.enum(["Pass", "Fail"]),
  issues: z.array(z.string()),
  next_steps: z.array(z.string()),
});

export type CredentialingRequest = z.infer<typeof credentialingRequestSchema>;
export type EvaluationResult = z.infer<typeof evaluationResultSchema>;
