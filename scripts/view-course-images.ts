import "dotenv/config";
import { db, pool } from "../server/db";
import { courseImages } from "../shared/schema";

/**
 * Script to view all course images in the database
 */

async function viewCourseImages() {
  try {
    console.log("Fetching course images from database...\n");

    const images = await db.select().from(courseImages);

    if (images.length === 0) {
      console.log("No course images found in database.");
    } else {
      console.log(`Found ${images.length} course image(s):\n`);
      console.table(images.map(img => ({
        "Course ID": img.courseId,
        "Course Name": img.courseName || "(not set)",
        "Image URL": img.imageUrl.substring(0, 50) + "...",
        "Created": img.createdAt?.toISOString().split('T')[0] || "-",
      })));

      console.log("\nDetailed view:");
      images.forEach((img, index) => {
        console.log(`\n${index + 1}. Course ID: ${img.courseId}`);
        console.log(`   Course Name: ${img.courseName || "(not set)"}`);
        console.log(`   Image URL: ${img.imageUrl}`);
      });
    }

  } catch (error) {
    console.error("Failed to fetch course images:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the script
viewCourseImages()
  .then(() => {
    console.log("\n✓ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n✗ Script failed:", error);
    process.exit(1);
  });
