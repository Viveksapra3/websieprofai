import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, decimal, integer } from "drizzle-orm/pg-core";
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

// Course pricing table
export const coursePricing = pgTable("course_pricing", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: text("course_id").notNull().unique(), // External API course ID
  courseName: text("course_name"), // Course name/title
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0.00"),
  currency: text("currency").notNull().default("INR"),
  isFree: boolean("is_free").notNull().default(false),
  displayOrder: integer("display_order"), // For determining first 3 free courses
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User course purchases
export const userPurchases = pgTable("user_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: text("course_id").notNull(),
  paymentId: varchar("payment_id"), // CCAvenue transaction ID
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("pending"), // pending, completed, failed, refunded
  paymentMethod: text("payment_method").default("ccavenue"),
  purchasedAt: timestamp("purchased_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // For time-limited access if needed
});

// Payment transactions (for CCAvenue integration)
export const paymentTransactions = pgTable("payment_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: text("course_id").notNull(),
  orderId: text("order_id").notNull().unique(), // Our internal order ID
  ccavenueOrderId: text("ccavenue_order_id"), // CCAvenue's order ID
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("initiated"), // initiated, success, failure, cancelled
  paymentResponse: text("payment_response"), // Store CCAvenue response
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course images table
export const courseImages = pgTable("course_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: text("course_id").notNull().unique(), // External API course ID
  courseName: text("course_name"), // Course name/title
  imageUrl: text("image_url").notNull(), // Custom image URL for the course
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course ID mapping table - maps new course IDs to previous/old course IDs
export const courseIdMapping = pgTable("course_id_mapping", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  newCourseId: text("new_course_id").notNull().unique(), // Current/new course ID
  oldCourseId: text("old_course_id").notNull(), // Previous/old course ID
  description: text("description"), // Optional description of the mapping
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCoursePricingSchema = createInsertSchema(coursePricing);
export const insertUserPurchaseSchema = createInsertSchema(userPurchases);
export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions);
export const insertCourseImageSchema = createInsertSchema(courseImages);
export const insertCourseIdMappingSchema = createInsertSchema(courseIdMapping);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SignInData = z.infer<typeof signInSchema>;
export type CoursePricing = typeof coursePricing.$inferSelect;
export type UserPurchase = typeof userPurchases.$inferSelect;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type CourseImage = typeof courseImages.$inferSelect;
export type CourseIdMapping = typeof courseIdMapping.$inferSelect;
