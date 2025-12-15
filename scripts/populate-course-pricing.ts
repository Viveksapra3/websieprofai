import "dotenv/config";
import { db, pool } from "../server/db";
import { coursePricing, courseIdMapping } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Script to populate course_pricing table with entries for each course
 * including course names from the course_id_mapping table
 * 
 * This script:
 * 1. Fetches all courses from course_id_mapping
 * 2. Fetches course details from external API
 * 3. Creates/updates course_pricing entries with course names
 * 4. Sets first 3 courses as free (price = 0)
 * 
 * Usage:
 *   npm run tsx scripts/populate-course-pricing.ts
 */

async function populateCoursePricing() {
  try {
    console.log("=".repeat(80));
    console.log("POPULATING COURSE PRICING TABLE");
    console.log("=".repeat(80));
    console.log();

    // Step 1: Get all course mappings
    console.log("📋 Step 1: Fetching course mappings...");
    const mappings = await db.select().from(courseIdMapping);
    console.log(`✅ Found ${mappings.length} course mappings\n`);

    if (mappings.length === 0) {
      console.log("⚠️  No course mappings found!");
      console.log("Please run the course ID mapping script first.");
      return;
    }

    // Step 2: Fetch courses from external API
    console.log("📋 Step 2: Fetching courses from external API...");
    const apiBase = process.env.VITE_API_BASE;
    let courses: any[] = [];

    if (apiBase) {
      try {
        const apiUrl = apiBase.startsWith('http') 
          ? `${apiBase}/api/courses`
          : `http://localhost:5000${apiBase}/api/courses`;
        
        console.log(`   Fetching from: ${apiUrl}`);
        const response = await fetch(apiUrl);
        const data = await response.json();
        courses = Array.isArray(data.courses) ? data.courses : Array.isArray(data) ? data : [];
        console.log(`✅ Fetched ${courses.length} courses from API\n`);
      } catch (error) {
        console.warn("⚠️  Failed to fetch from API, will use mapping descriptions");
        console.error(error);
      }
    }

    // Step 3: Get existing pricing
    console.log("📋 Step 3: Checking existing pricing entries...");
    const existingPricing = await db.select().from(coursePricing);
    const existingCourseIds = new Set(existingPricing.map(p => p.courseId));
    console.log(`   Found ${existingPricing.length} existing pricing entries\n`);

    // Step 4: Create/update pricing for each course
    console.log("📋 Step 4: Creating/updating course pricing entries...");
    console.log("=".repeat(80));

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < mappings.length; i++) {
      const mapping = mappings[i];
      const oldCourseId = mapping.oldCourseId;
      const newCourseId = mapping.newCourseId;
      
      // Find course details from API
      const course = courses.find(c => {
        const cId = String(c.course_id || c.id);
        return cId === oldCourseId;
      });

      // Determine course name
      const courseName = course?.course_title || course?.title || mapping.description || `Course ${newCourseId}`;
      
      // First 3 courses are free
      const isFree = i < 3;
      const price = isFree ? 0 : 99;

      console.log(`\n${i + 1}. Processing: ${newCourseId} → ${oldCourseId}`);
      console.log(`   Name: ${courseName}`);
      console.log(`   Price: ${price} INR (${isFree ? 'FREE' : 'PAID'})`);

      try {
        if (existingCourseIds.has(oldCourseId)) {
          // Update existing entry
          await db
            .update(coursePricing)
            .set({
              courseName: courseName,
              price: price.toFixed(2),
              isFree: isFree,
              displayOrder: i + 1,
              updatedAt: new Date(),
            })
            .where(eq(coursePricing.courseId, oldCourseId));
          
          console.log(`   ✅ Updated existing pricing entry`);
          updatedCount++;
        } else {
          // Create new entry
          await db.insert(coursePricing).values({
            courseId: oldCourseId,
            courseName: courseName,
            price: price.toFixed(2),
            currency: "INR",
            isFree: isFree,
            displayOrder: i + 1,
          });
          
          console.log(`   ✅ Created new pricing entry`);
          createdCount++;
        }
      } catch (error: any) {
        console.log(`   ❌ Error: ${error.message}`);
        skippedCount++;
      }
    }

    // Step 5: Display summary
    console.log("\n" + "=".repeat(80));
    console.log("SUMMARY");
    console.log("=".repeat(80));
    console.log(`✅ Created: ${createdCount} new entries`);
    console.log(`🔄 Updated: ${updatedCount} existing entries`);
    console.log(`⚠️  Skipped: ${skippedCount} entries (errors)`);
    console.log(`📊 Total Processed: ${mappings.length} courses`);

    // Step 6: Display current pricing table
    console.log("\n" + "=".repeat(80));
    console.log("CURRENT COURSE PRICING");
    console.log("=".repeat(80));
    
    const allPricing = await db
      .select()
      .from(coursePricing)
      .orderBy(coursePricing.displayOrder);

    console.log("\n");
    console.table(allPricing.map(p => ({
      "Order": p.displayOrder,
      "Course ID": p.courseId.substring(0, 20) + "...",
      "Course Name": p.courseName || "N/A",
      "Price": `${p.price} ${p.currency}`,
      "Free": p.isFree ? "✅" : "❌",
    })));

    console.log("\n" + "=".repeat(80));
    console.log("✅ COURSE PRICING POPULATION COMPLETED");
    console.log("=".repeat(80));

  } catch (error) {
    console.error("\n❌ POPULATION FAILED");
    console.error("Error:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

populateCoursePricing().catch(console.error);
