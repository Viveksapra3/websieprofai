import "dotenv/config";
import { pool } from "../server/db";

/**
 * Script to fetch all current course IDs and generate sequential mappings
 * This will map current course IDs to sequential IDs: 1, 2, 3, etc.
 */

async function fetchAndGenerateMappings() {
  try {
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

    console.log("Current Course IDs:");
    console.log("=".repeat(80));
    courses.forEach((course, index) => {
      const courseId = String(course.course_id || course.id);
      const title = course.course_title || course.title || "Untitled";
      console.log(`${index + 1}. ${courseId.padEnd(15)} → ${title}`);
    });
    console.log("=".repeat(80));

    // Generate mappings
    console.log("\n\nGenerated Mappings for migrate-course-ids.ts:");
    console.log("=".repeat(80));
    console.log("const COURSE_ID_MAPPINGS: CourseIdMappingInput[] = [");
    
    courses.forEach((course, index) => {
      const oldCourseId = String(course.course_id || course.id);
      const newCourseId = `${index + 1}`;
      const title = course.course_title || course.title || "Untitled";
      
      console.log(`  { newCourseId: "${newCourseId}", oldCourseId: "${oldCourseId}", description: "${title}" },`);
    });
    
    console.log("];");
    console.log("=".repeat(80));

    console.log("\n\n📋 Copy the above mappings to scripts/migrate-course-ids.ts");
    console.log("Then run: npm run migrate-course-ids\n");

  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the script
fetchAndGenerateMappings()
  .then(() => {
    console.log("✓ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("✗ Script failed:", error);
    process.exit(1);
  });
