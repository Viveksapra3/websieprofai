import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'add-course-images.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📝 Executing migration...');
    
    // Execute the SQL
    const result = await pool.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('\n📊 Verifying data...');
    
    // Verify the data
    const verifyResult = await pool.query('SELECT course_id, image_url FROM course_images ORDER BY created_at');
    
    console.log(`\n✨ Found ${verifyResult.rows.length} course images:`);
    verifyResult.rows.forEach(row => {
      console.log(`  - ${row.course_id}: ${row.image_url.substring(0, 50)}...`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('\n🔌 Database connection closed.');
  }
}

runMigration();
