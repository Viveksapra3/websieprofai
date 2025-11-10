#!/usr/bin/env node

/**
 * Set All Courses to Free
 * 
 * This script sets all existing courses in the database to free (price = 0)
 * without changing any other settings like display_order or currency.
 * It also fetches courses from the external API and adds any missing ones.
 */

import { config } from 'dotenv';
import { db } from '../server/db';
import { coursePricing } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Load environment variables
config();

async function fetchCoursesFromAPI() {
  const apiBase = process.env.VITE_API_BASE;
  if (!apiBase) {
    console.warn('⚠️  VITE_API_BASE not set, skipping API fetch');
    return [];
  }

  try {
    // Handle both absolute URLs and relative paths
    let apiUrl: string;
    if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
      // Absolute URL - use as is
      apiUrl = `${apiBase}/api/courses`;
    } else {
      // Relative path - skip for now as we can't determine the host in a script
      console.warn('⚠️  VITE_API_BASE is a relative path. Please use an absolute URL (e.g., http://localhost:5000)');
      return [];
    }
    
    console.log(`📡 Fetching courses from: ${apiUrl}`);
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const courses = Array.isArray(data.courses) ? data.courses : 
                   Array.isArray(data) ? data : [data];

    return courses.map((course: any) => ({
      id: String(course.course_id || course.id),
      title: String(course.course_title || course.title || 'Untitled'),
    }));
  } catch (error) {
    console.error('❌ Failed to fetch courses from API:', error);
    return [];
  }
}

async function setAllCoursesFree() {
  try {
    console.log('🚀 Setting all courses to free...\n');

    // First, fetch courses from API and add any missing ones
    const apiCourses = await fetchCoursesFromAPI();
    
    if (apiCourses.length > 0) {
      console.log(`\n📋 Found ${apiCourses.length} courses from API`);
      
      for (const course of apiCourses) {
        const existing = await db
          .select()
          .from(coursePricing)
          .where(eq(coursePricing.courseId, course.id))
          .limit(1);

        if (existing.length === 0) {
          console.log(`  ➕ Adding missing course: ${course.id} (${course.title})`);
          await db.insert(coursePricing).values({
            courseId: course.id,
            price: '0.00',
            currency: 'INR',
            isFree: true,
          });
        }
      }
    }

    // Update all existing course pricing records to free
    const result = await db
      .update(coursePricing)
      .set({
        price: '0.00',
        isFree: true,
        updatedAt: new Date(),
      })
      .returning();

    console.log(`\n✅ Updated ${result.length} courses to free`);
    
    if (result.length > 0) {
      console.log('\nAll courses are now FREE:');
      result.forEach(course => {
        console.log(`  - Course ID: ${course.courseId}`);
      });
    } else {
      console.log('\n⚠️  No courses found in the database.');
      console.log('Run setup-course-pricing.ts first to initialize course pricing.');
    }

    console.log('\n✅ All courses are now free!');

  } catch (error) {
    console.error('\n❌ Failed to update courses:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run the script
setAllCoursesFree();
