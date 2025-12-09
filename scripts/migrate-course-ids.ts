import "dotenv/config";
import { db, pool, ensureSchema } from "../server/db";
import { courseIdMapping } from "../shared/schema";

/**
 * Migration script to map new course IDs to old course IDs
 * 
 * This script helps restore previous course IDs by creating a mapping table.
 * Update the COURSE_ID_MAPPINGS array below with your actual mappings.
 */

interface CourseIdMappingInput {
  newCourseId: string;
  oldCourseId: string;
  description?: string;
}

// Define your course ID mappings here
// Format: { newCourseId: "current_id", oldCourseId: "previous_id", description: "optional description" }
const COURSE_ID_MAPPINGS: CourseIdMappingInput[] = [
  { newCourseId: "1", oldCourseId: "9d5e836e-e0f9-4b85-ac93-8f075871738d", description: "Generative AI Handson" },
  { newCourseId: "2", oldCourseId: "767fae5c-a317-4313-a64c-22ff19644fdd", description: "Basic English Speaking Techniques" },
  { newCourseId: "3", oldCourseId: "3c5829c7-0d89-4766-96a1-144b3b66f403", description: "Hindi to English Speaking course" },
  { newCourseId: "4", oldCourseId: "384b22a4-b8b5-4eb8-bbf0-329780dc3b9f", description: "Cyber Security" },
  { newCourseId: "5", oldCourseId: "30e88984-e4b5-4dda-9421-bb6df424afe7", description: "Artificial Intelligence and Machine Learning (AI/Ml)" },
  { newCourseId: "6", oldCourseId: "3e06c6aa-3f26-4622-aef3-161165dd47d0", description: "Robotics " },
  { newCourseId: "7", oldCourseId: "4b416286-3a4a-4df0-8caf-d6bf609a7e81", description: "Social Change and Development in India" },
  { newCourseId: "8", oldCourseId: "a7e1b694-e5d9-4301-84ef-7f9143080aa8", description: "Bhaswati sanskrit" },
  { newCourseId: "9", oldCourseId: "2c89e109-b6ef-4b59-884a-b0caee9eed79", description: "Accountancy Part I And II" },
  { newCourseId: "10", oldCourseId: "b6fb5aa9-9be0-4432-a965-aa7738781a69", description: "Our Wondrous World" },
  { newCourseId: "11", oldCourseId: "e0f84b04-cec8-4d4b-9f0a-3070a8e5e7c0", description: "Class 12th NCERT Psychology book" },
  { newCourseId: "12", oldCourseId: "858f797d-c543-4aa6-bcab-3121d595d90c", description: "Arabic to English Translation book " },
  { newCourseId: "13", oldCourseId: "a4974181-1c19-4cd7-9168-a5e74afdfa0d", description: "Class 12th NCERT - Political Science -  Politics in India Since Independence" },
  { newCourseId: "14", oldCourseId: "9ba54099-a978-4673-85f7-575268faf26e", description: "Virtual Reality" },
  { newCourseId: "15", oldCourseId: "ea7afd75-b05d-400f-9d65-36915759767f", description: "12th NCERT - Business Studies Part - 1" },
  { newCourseId: "16", oldCourseId: "3634d6a0-a910-4777-aa13-9b33e5cbc581", description: "Class 12th - NCERT - Business Studies Part - 2" },
  { newCourseId: "17", oldCourseId: "60f4ceae-e396-45cf-a27c-83da03720361", description: "Teacher Training Certificate Programme for AI Awareness" },
  { newCourseId: "18", oldCourseId: "8e7da3d8-06eb-4730-82ad-835c5a10f0a7", description: "Class 12th - NCERT - Chemistry Part - 1" },
  { newCourseId: "19", oldCourseId: "1ec613a4-93df-4e8f-b01b-fbaf19679a0a", description: "Indian Societies" },
];

async function migrateCourseIds() {
  try {
    console.log("Ensuring database schema exists...");
    await ensureSchema();
    console.log("✓ Schema ready\n");

    console.log("Starting course ID migration...");
    console.log(`Found ${COURSE_ID_MAPPINGS.length} mappings to process`);

    if (COURSE_ID_MAPPINGS.length === 0) {
      console.warn("\n⚠️  WARNING: No course ID mappings defined!");
      console.log("Please edit this file and add your course ID mappings to the COURSE_ID_MAPPINGS array.");
      console.log("\nExample:");
      console.log('  { newCourseId: "course_1", oldCourseId: "s-101", description: "Study Skills" }');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const mapping of COURSE_ID_MAPPINGS) {
      try {
        await db.insert(courseIdMapping).values({
          newCourseId: mapping.newCourseId,
          oldCourseId: mapping.oldCourseId,
          description: mapping.description || null,
        }).onConflictDoUpdate({
          target: courseIdMapping.newCourseId,
          set: {
            oldCourseId: mapping.oldCourseId,
            description: mapping.description || null,
            updatedAt: new Date(),
          },
        });

        console.log(`✓ Mapped: ${mapping.newCourseId} → ${mapping.oldCourseId}`);
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to map ${mapping.newCourseId}:`, error);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`Migration completed!`);
    console.log(`  Success: ${successCount}`);
    console.log(`  Errors: ${errorCount}`);
    console.log("=".repeat(50));

    // Display current mappings
    console.log("\nCurrent course ID mappings:");
    const allMappings = await db.select().from(courseIdMapping);
    console.table(allMappings.map(m => ({
      "New Course ID": m.newCourseId,
      "Old Course ID": m.oldCourseId,
      "Description": m.description || "-",
    })));

  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration
migrateCourseIds()
  .then(() => {
    console.log("\n✓ Migration script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n✗ Migration script failed:", error);
    process.exit(1);
  });
