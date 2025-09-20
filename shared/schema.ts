import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"), // "teacher" or "student"
  // Student-specific optional fields
  studentType: text("student_type"), // "college" | "school" | null
  collegeName: text("college_name"),
  degree: text("degree"),
  schoolClass: text("school_class"),
  schoolAffiliation: text("school_affiliation"),
  // Terms acceptance flag
  termsAccepted: boolean("terms_accepted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
  studentType: true,
  collegeName: true,
  degree: true,
  schoolClass: true,
  schoolAffiliation: true,
  termsAccepted: true,
});

export const signInSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SignInData = z.infer<typeof signInSchema>;
