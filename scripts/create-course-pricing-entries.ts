import "dotenv/config";
import { db, pool } from "../server/db";
import { coursePricing, courseIdMapping } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Simple script to create course_pricing entries for all courses
 * Uses course names from the course_id_mapping descriptions
 * 
 * Usage:
 *   npm run tsx scripts/create-course-pricing-entries.ts
 */

async function createCoursePricingEntries() {
  try {
    console.log("=".repeat(80));
    console.log("CREATING COURSE PRICING ENTRIES");
    console.log("=".repeat(80));
    console.log();

    // Get all course mappings
    console.log("📋 Fetching course mappings...");
    const mappings = await db
      .select()
      .from(courseIdMapping)
      .orderBy(courseIdMapping.newCourseId);
    
    console.log(`✅ Found ${mappings.length} courses\n`);

    if (mappings.length === 0) {
      console.log("⚠️  No course mappings found!");
      console.log("Please run: npm run tsx scripts/migrate-course-ids.ts");
      return;
    }

    // Get existing pricing
    const existingPricing = await db.select().from(coursePricing);
    const existingCourseIds = new Set(existingPricing.map(p => p.courseId));

    console.log("Creating/updating pricing entries...\n");
    console.log("=".repeat(80));

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (let i = 0; i < mappings.length; i++) {
      const mapping = mappings[i];
      const { newCourseId, oldCourseId, description } = mapping;
      
      // Use description as course name, or fallback to a default
      const courseName = description || `Course ${newCourseId}`;
      
      // First 3 courses are free (based on order in mapping table)
      const isFree = i < 3;
      const price = isFree ? "0.00" : "99.00";

      console.log(`\n${i + 1}. Course ${newCourseId}: ${courseName}`);
      console.log(`   Old ID: ${oldCourseId}`);
      console.log(`   Price: ${price} INR ${isFree ? '(FREE)' : '(PAID)'}`);

      try {
        if (existingCourseIds.has(oldCourseId)) {
          // Update existing
          await db
            .update(coursePricing)
            .set({
              courseName: courseName,
              price: price,
              isFree: isFree,
              displayOrder: i + 1,
              updatedAt: new Date(),
            })
            .where(eq(coursePricing.courseId, oldCourseId));
          
          console.log(`   ✅ Updated`);
          updated++;
        } else {
          // Create new
          await db.insert(coursePricing).values({
            courseId: oldCourseId,
            courseName: courseName,
            price: price,
            currency: "INR",
            isFree: isFree,
            displayOrder: i + 1,
          });
          
          console.log(`   ✅ Created`);
          created++;
        }
      } catch (error: any) {
        console.log(`   ❌ Error: ${error.message}`);
        errors++;
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("SUMMARY");
    console.log("=".repeat(80));
    console.log(`✅ Created: ${created}`);
    console.log(`🔄 Updated: ${updated}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total: ${mappings.length}`);

    // Show final pricing table
    console.log("\n" + "=".repeat(80));
    console.log("FINAL COURSE PRICING TABLE");
    console.log("=".repeat(80));
    
    const finalPricing = await db
      .select()
      .from(coursePricing)
      .orderBy(coursePricing.displayOrder);

    console.log();
    finalPricing.forEach((p, idx) => {
      const status = p.isFree ? '🆓 FREE' : `💰 ${p.price} ${p.currency}`;
      console.log(`${idx + 1}. ${p.courseName || 'Unnamed Course'}`);
      console.log(`   Course ID: ${p.courseId}`);
      console.log(`   Status: ${status}`);
      console.log(`   Display Order: ${p.displayOrder}`);
      console.log();
    });

    console.log("=".repeat(80));
    console.log("✅ COMPLETED SUCCESSFULLY");
    console.log("=".repeat(80));

  } catch (error) {
    console.error("\n❌ FAILED");
    console.error(error);
    throw error;
  } finally {
    await pool.end();
  }
}

createCoursePricingEntries().catch(console.error);
