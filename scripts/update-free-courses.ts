import { db } from '../server/db.ts';
import { coursePricing } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';

async function updateFreeCourses() {
  try {
    console.log('Updating courses 1, 2, and 3 to be free...');
    
    // First, let's see what's currently in the database
    console.log('\nCurrent pricing data:');
    const allPricing = await db.select().from(coursePricing);
    console.table(allPricing);
    
    // Update existing records for courses 1, 2, 3
    const coursesToUpdate = ['1', '2', '3'];
    
    for (const courseId of coursesToUpdate) {
      // Check if record exists first
      const existing = await db
        .select()
        .from(coursePricing)
        .where(eq(coursePricing.courseId, courseId));
      
      console.log(`\nCourse ${courseId} existing record:`, existing[0]);
      
      if (existing.length > 0) {
        const result = await db
          .update(coursePricing)
          .set({
            isFree: true,
            price: '0.00',
            updatedAt: new Date()
          })
          .where(eq(coursePricing.courseId, courseId));
        
        console.log(`Updated course ${courseId} pricing to free`);
        
        // Verify the update
        const updated = await db
          .select()
          .from(coursePricing)
          .where(eq(coursePricing.courseId, courseId));
        console.log(`Course ${courseId} after update:`, updated[0]);
      } else {
        console.log(`Course ${courseId} not found in database`);
      }
    }
    
    console.log('\nFinal pricing data:');
    const finalPricing = await db.select().from(coursePricing);
    console.table(finalPricing);
    
  } catch (error) {
    console.error('Error updating course pricing:', error);
  } finally {
    process.exit(0);
  }
}

updateFreeCourses();
