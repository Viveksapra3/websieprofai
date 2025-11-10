#!/usr/bin/env tsx

/**
 * Direct Database Setup Script
 * This script directly inserts pricing data into the database
 */

import { config } from 'dotenv';
import { db } from '../server/db';
import { coursePricing } from '../shared/schema';

// Load environment variables
config();

async function setupPricingDirectly() {
  try {
    console.log('🚀 Setting up course pricing directly in database...\n');

    const pricingData = [
      { courseId: 's-101', price: '0.00', currency: 'INR', isFree: true, displayOrder: 1 },
      { courseId: 's-201', price: '0.00', currency: 'INR', isFree: true, displayOrder: 2 },
      { courseId: 's-310', price: '0.00', currency: 'INR', isFree: true, displayOrder: 3 },
      { courseId: 's-320', price: '999.00', currency: 'INR', isFree: false, displayOrder: 4 },
      { courseId: 'course_1', price: '999.00', currency: 'INR', isFree: false, displayOrder: 5 },
      { courseId: 'course_2', price: '1499.00', currency: 'INR', isFree: false, displayOrder: 6 },
      { courseId: 'course_3', price: '799.00', currency: 'INR', isFree: false, displayOrder: 7 },
      { courseId: 'course_4', price: '1299.00', currency: 'INR', isFree: false, displayOrder: 8 },
      { courseId: 'course_5', price: '899.00', currency: 'INR', isFree: false, displayOrder: 9 },
    ];

    for (const pricing of pricingData) {
      try {
        await db.insert(coursePricing).values(pricing).onConflictDoUpdate({
          target: coursePricing.courseId,
          set: {
            price: pricing.price,
            isFree: pricing.isFree,
            displayOrder: pricing.displayOrder,
            updatedAt: new Date(),
          },
        });

        console.log(`✅ ${pricing.courseId}: ${pricing.isFree ? 'FREE' : `₹${pricing.price}`}`);
      } catch (error) {
        console.error(`❌ Failed to set pricing for ${pricing.courseId}:`, error);
      }
    }

    console.log('\n🎉 Course pricing setup completed!');
    console.log('\nNext steps:');
    console.log('1. Refresh your courses page');
    console.log('2. First 3 courses should show as FREE');
    console.log('3. Other courses should show pricing');

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupPricingDirectly();
