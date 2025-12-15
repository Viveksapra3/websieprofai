import "dotenv/config";
import { pool } from "../server/db";

/**
 * Migration script to add course_name column to course_pricing and course_images tables
 * 
 * This script adds the course_name column if it doesn't already exist.
 * Safe to run multiple times (idempotent).
 * 
 * Usage:
 *   npm run tsx scripts/add-course-name-column.ts
 */

async function addCourseNameColumn() {
  try {
    console.log("=".repeat(80));
    console.log("ADDING COURSE_NAME COLUMN TO TABLES");
    console.log("=".repeat(80));
    console.log();

    // Add course_name to course_pricing table
    console.log("📋 Step 1: Adding course_name column to course_pricing table...");
    await pool.query(`
      ALTER TABLE course_pricing 
      ADD COLUMN IF NOT EXISTS course_name text;
    `);
    console.log("✅ course_pricing.course_name column added/verified");

    // Add course_name to course_images table (should already exist, but verify)
    console.log("\n📋 Step 2: Verifying course_name column in course_images table...");
    await pool.query(`
      ALTER TABLE course_images 
      ADD COLUMN IF NOT EXISTS course_name text;
    `);
    console.log("✅ course_images.course_name column added/verified");

    // Check current state
    console.log("\n📊 Step 3: Checking current state...");
    
    const pricingResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'course_pricing'
      ORDER BY ordinal_position;
    `);
    
    console.log("\nCourse Pricing Table Columns:");
    console.table(pricingResult.rows);

    const imagesResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'course_images'
      ORDER BY ordinal_position;
    `);
    
    console.log("\nCourse Images Table Columns:");
    console.table(imagesResult.rows);

    console.log("\n" + "=".repeat(80));
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY");
    console.log("=".repeat(80));
    console.log("\nThe course_name column has been added to both tables.");
    console.log("You can now store course names alongside pricing and image data.");

  } catch (error) {
    console.error("\n❌ MIGRATION FAILED");
    console.error("Error:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

addCourseNameColumn().catch(console.error);
