import "dotenv/config";
import { db, pool } from "../server/db";
import { courseIdMapping } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Helper script to view and manage course ID mappings
 * 
 * Usage:
 *   npm run tsx scripts/view-course-mappings.ts
 */

async function viewCourseMappings() {
  try {
    console.log("Fetching course ID mappings...\n");

    const mappings = await db.select().from(courseIdMapping);

    if (mappings.length === 0) {
      console.log("No course ID mappings found.");
      console.log("\nTo add mappings, edit scripts/migrate-course-ids.ts and run:");
      console.log("  npm run tsx scripts/migrate-course-ids.ts");
    } else {
      console.log(`Found ${mappings.length} course ID mapping(s):\n`);
      console.table(mappings.map(m => ({
        "New Course ID": m.newCourseId,
        "Old Course ID": m.oldCourseId,
        "Description": m.description || "-",
        "Created": m.createdAt?.toISOString().split('T')[0] || "-",
      })));

      console.log("\nMapping details:");
      mappings.forEach((m, index) => {
        console.log(`\n${index + 1}. ${m.newCourseId} → ${m.oldCourseId}`);
        if (m.description) {
          console.log(`   Description: ${m.description}`);
        }
      });
    }

  } catch (error) {
    console.error("Failed to fetch mappings:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the script
viewCourseMappings()
  .then(() => {
    console.log("\n✓ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n✗ Script failed:", error);
    process.exit(1);
  });
