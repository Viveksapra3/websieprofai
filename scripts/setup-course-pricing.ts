#!/usr/bin/env node

/**
 * Setup Course Pricing Script
 * 
 * This script helps initialize course pricing in the database.
 * It fetches courses from your external API and sets up pricing
 * with the first 3 courses as free and the rest as paid.
 */

import { config } from 'dotenv';
import { db } from '../server/db';
import { coursePricing } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Load environment variables
config();

const DEFAULT_PAID_PRICE = 999; // Default price for paid courses in INR

interface Course {
  id: string;
  title: string;
  index: number;
}

interface SetupOptions {
  freeCoursesCount?: number;
  defaultPrice?: number;
  currency?: string;
}

async function fetchCoursesFromAPI(): Promise<Course[]> {
  const apiBase = process.env.VITE_API_BASE;
  if (!apiBase) {
    throw new Error('VITE_API_BASE environment variable is required');
  }

  console.log(`Fetching courses from: ${apiBase}/api/courses`);
  
  try {
    const response = await fetch(`${apiBase}/api/courses`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    // Handle different response formats
    const courses = Array.isArray(data.courses) ? data.courses : 
                   Array.isArray(data) ? data : [data];

    return courses.map((course: any, index: number): Course => ({
      id: String(course.course_id || course.id || `course_${index + 1}`),
      title: String(course.course_title || course.title || `Course ${index + 1}`),
      index: index
    }));
  } catch (error) {
    console.error('Failed to fetch courses from API:', error);
    throw error;
  }
}

async function setupCoursePricing(courses: Course[], options: SetupOptions = {}) {
  const {
    freeCoursesCount = 3,
    defaultPrice = DEFAULT_PAID_PRICE,
    currency = 'INR'
  } = options;

  console.log(`Setting up pricing for ${courses.length} courses...`);
  console.log(`First ${freeCoursesCount} courses will be free, rest will cost ₹${defaultPrice}`);

  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    const isFree = i < freeCoursesCount;
    const price = isFree ? 0 : defaultPrice;

    try {
      // Check if pricing already exists
      const existing = await db
        .select()
        .from(coursePricing)
        .where(eq(coursePricing.courseId, course.id))
        .limit(1);

      if (existing.length > 0) {
        // Update existing pricing
        await db
          .update(coursePricing)
          .set({
            price: price.toFixed(2),
            isFree,
            displayOrder: i + 1,
            updatedAt: new Date(),
          })
          .where(eq(coursePricing.courseId, course.id));

        console.log(`Updated: ${course.title} - ${isFree ? 'FREE' : `₹${price}`}`);
      } else {
        // Create new pricing record
        await db.insert(coursePricing).values({
          courseId: course.id,
          price: price.toFixed(2),
          currency,
          isFree,
          displayOrder: i + 1,
        });

        console.log(`Created: ${course.title} - ${isFree ? 'FREE' : `₹${price}`}`);
      }
    } catch (error) {
      console.error(`Failed to set pricing for course ${course.id}:`, error);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting course pricing setup...\n');

    // Parse command line arguments
    const args = process.argv.slice(2);
    const options: SetupOptions = {};

    // Parse options
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i];
      const value = args[i + 1];

      switch (key) {
        case '--free-count':
          options.freeCoursesCount = parseInt(value);
          break;
        case '--price':
          options.defaultPrice = parseFloat(value);
          break;
        case '--currency':
          options.currency = value;
          break;
        case '--help':
          console.log(`
Usage: node setup-course-pricing.js [options]

Options:
  --free-count <number>   Number of free courses (default: 3)
  --price <number>        Default price for paid courses (default: 999)
  --currency <string>     Currency code (default: INR)
  --help                  Show this help message

Examples:
  node setup-course-pricing.js
  node setup-course-pricing.js --free-count 5 --price 1499
  node setup-course-pricing.js --currency USD --price 19.99
          `);
          process.exit(0);
      }
    }

    // Fetch courses from external API
    const courses = await fetchCoursesFromAPI();
    console.log(`Found ${courses.length} courses\n`);

    if (courses.length === 0) {
      console.log('No courses found. Please check your API configuration.');
      process.exit(1);
    }

    // Setup pricing
    await setupCoursePricing(courses, options);

    console.log('\n✅ Course pricing setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify the pricing in your database');
    console.log('2. Test the payment flow with a paid course');
    console.log('3. Configure your CCAvenue credentials if not done already');

  } catch (error) {
    console.error('\n❌ Setup failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
