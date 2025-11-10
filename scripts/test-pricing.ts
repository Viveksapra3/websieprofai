#!/usr/bin/env tsx

/**
 * Test script to verify pricing data in database
 */

import { config } from 'dotenv';
import { db } from '../server/db';
import { coursePricing } from '../shared/schema';
import { paymentService } from '../server/payment-service';

// Load environment variables
config();

async function testPricing() {
  try {
    console.log('🔍 Testing pricing data in database...\n');

    // Test 1: Check all pricing data
    console.log('1. All pricing data in database:');
    const allPricing = await db.select().from(coursePricing);
    console.table(allPricing);

    // Test 2: Test specific course access
    const testCourses = ['s-101', 's-201', 's-310', 's-320'];
    console.log('\n2. Testing course access for test user:');
    
    for (const courseId of testCourses) {
      try {
        const hasAccess = await paymentService.hasAccess('test-user-id', courseId);
        const pricing = await paymentService.getCoursePricing(courseId);
        console.log(`${courseId}: hasAccess=${hasAccess}, isFree=${pricing?.isFree}, price=${pricing?.price}`);
      } catch (error) {
        console.error(`Error testing ${courseId}:`, error);
      }
    }

    console.log('\n✅ Test completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testPricing();
