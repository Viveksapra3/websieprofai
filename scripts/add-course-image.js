import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;

async function addCourseImage(courseId, imageUrl) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log(`\n🖼️  Adding image for course: ${courseId}`);
    
    const result = await pool.query(
      `INSERT INTO course_images (course_id, image_url) 
       VALUES ($1, $2)
       ON CONFLICT (course_id) DO UPDATE SET
         image_url = EXCLUDED.image_url,
         updated_at = NOW()
       RETURNING *`,
      [courseId, imageUrl]
    );

    console.log('✅ Image added successfully!');
    console.log(`   Course ID: ${result.rows[0].course_id}`);
    console.log(`   Image URL: ${result.rows[0].image_url}`);
    console.log(`   Updated: ${result.rows[0].updated_at}`);
    
  } catch (error) {
    console.error('❌ Error adding image:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
📸 Add Course Image Script

Usage:
  node scripts/add-course-image.js <course_id> <image_url>

Examples:
  node scripts/add-course-image.js "course_4" "https://images.unsplash.com/photo-1234567890"
  node scripts/add-course-image.js "s-401" "https://example.com/image.jpg"

Image URL Tips:
  - Use Unsplash: https://unsplash.com/photos/[photo-id]?w=800&h=600&fit=crop
  - Use Pexels: https://images.pexels.com/photos/[id]/pexels-photo-[id].jpeg?w=800&h=600
  - Recommended size: 800x600 or higher
  - Formats: JPG, PNG, WebP
  `);
  process.exit(1);
}

const [courseId, imageUrl] = args;

// Validate URL
try {
  new URL(imageUrl);
} catch (error) {
  console.error('❌ Invalid URL provided');
  process.exit(1);
}

addCourseImage(courseId, imageUrl);
