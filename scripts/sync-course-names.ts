import "dotenv/config";
import { db, pool, ensureSchema } from "../server/db";
import { courseImages, courseIdMapping } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Script to sync course names from the external API to the course_images table
 * This will fetch all courses and update the course_name field for existing entries
 */

async function syncCourseNames() {
  try {
    console.log("Ensuring database schema exists...");
    await ensureSchema();
    console.log("✓ Schema ready\n");

    console.log("Fetching courses from external API...\n");

    const apiBase = process.env.VITE_API_BASE;
    let courses: any[] = [];

    // Try to fetch from external API
    if (apiBase) {
      try {
        const apiUrl = apiBase.startsWith('http') 
          ? `${apiBase}/api/courses`
          : `http://localhost:5000${apiBase}/api/courses`;
        
        console.log(`Fetching from: ${apiUrl}`);
        const response = await fetch(apiUrl);
        const data = await response.json();
        courses = Array.isArray(data.courses) ? data.courses : Array.isArray(data) ? data : [];
        console.log(`✓ Fetched ${courses.length} courses from API\n`);
      } catch (error) {
        console.warn("Failed to fetch from API, using fallback data");
      }
    }

    // Use fallback data if API fetch failed
    if (courses.length === 0) {
      console.log("Using fallback course data...\n");
      courses = [
        { id: "s-101", title: "Study Skills Fundamentals", level: "Beginner", modules: 5 },
        { id: "s-201", title: "Math with AI Tutors", level: "Intermediate", modules: 8 },
        { id: "s-310", title: "Creative Coding with Three.js", level: "Intermediate", modules: 12 },
        { id: "s-320", title: "Intro to Data Science", level: "Beginner", modules: 10 },
        { id: "course_1", title: "Advanced Programming", level: "Advanced", modules: 15 },
        { id: "course_2", title: "Machine Learning Basics", level: "Intermediate", modules: 20 }
      ];
    }

    // Get all existing course images
    const existingImages = await db.select().from(courseImages);
    console.log(`Found ${existingImages.length} existing course image entries\n`);

    if (existingImages.length === 0) {
      console.log("⚠️  No course images found in database. Nothing to sync.");
      console.log("Add course images first, then run this script to sync names.");
      return;
    }

    // Get course ID mappings
    const mappings = await db.select().from(courseIdMapping);
    console.log(`Found ${mappings.length} course ID mappings\n`);

    let updatedCount = 0;
    let notFoundCount = 0;

    console.log("Syncing course names...\n");
    console.log("=".repeat(80));

    for (const imageEntry of existingImages) {
      let courseId = imageEntry.courseId;
      
      // Check if this is a sequential ID (1, 2, 3, etc.) that needs to be mapped to UUID
      const mapping = mappings.find(m => m.newCourseId === courseId);
      const actualCourseId = mapping ? mapping.oldCourseId : courseId;
      
      // Find the course in the fetched data using the actual UUID
      const course = courses.find(c => {
        const cId = String(c.course_id || c.id);
        return cId === actualCourseId;
      });

      if (course) {
        const courseName = course.course_title || course.title || "Untitled Course";
        
        // Update the course name
        await db
          .update(courseImages)
          .set({ 
            courseName: courseName,
            updatedAt: new Date()
          })
          .where(eq(courseImages.courseId, courseId));

        const displayId = courseId.length > 20 ? courseId.substring(0, 20) + "..." : courseId;
        console.log(`✓ Updated: ${displayId} → "${courseName}"`);
        updatedCount++;
      } else {
        console.log(`✗ Not found: ${courseId} (course not in API response)`);
        console.log(`   Mapped to: ${actualCourseId}`);
        notFoundCount++;
      }
    }

    console.log("=".repeat(80));
    console.log("\n" + "=".repeat(50));
    console.log(`Sync completed!`);
    console.log(`  Updated: ${updatedCount}`);
    console.log(`  Not Found: ${notFoundCount}`);
    console.log(`  Total: ${existingImages.length}`);
    console.log("=".repeat(50));

    // Display updated entries
    if (updatedCount > 0) {
      console.log("\nUpdated course images:");
      const updated = await db.select().from(courseImages);
      console.table(updated.map(img => ({
        "Course ID": img.courseId.substring(0, 30) + "...",
        "Course Name": img.courseName || "-",
        "Has Image": img.imageUrl ? "✓" : "✗",
      })));
    }

  } catch (error) {
    console.error("Sync failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the sync
syncCourseNames()
  .then(() => {
    console.log("\n✓ Sync script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n✗ Sync script failed:", error);
    process.exit(1);
  });
