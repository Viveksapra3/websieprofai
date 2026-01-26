import "dotenv/config";
import { Pool } from "pg";

const DATABASE_URL2 = process.env.DATABASE_URL2;

if (!DATABASE_URL2) {
  console.error("DATABASE_URL2 environment variable is required");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL2,
});

async function debugCourseProgress() {
  try {
    console.log("🔍 DEBUGGING COURSE PROGRESS ISSUES");
    console.log("=".repeat(60));
    
    // Check if course_progress table exists
    console.log("\n📋 CHECKING TABLE STRUCTURE:");
    console.log("=".repeat(60));
    
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'course_progress'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    console.log(`✅ course_progress table exists: ${tableExists}`);
    
    if (tableExists) {
      // Check table structure
      const structure = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'course_progress'
        ORDER BY ordinal_position;
      `);
      
      console.log("\n📊 TABLE STRUCTURE:");
      structure.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type} (${col.is_nullable}) ${col.column_default || ''}`);
      });
    }
    
    // Check total records
    console.log("\n📈 TOTAL PROGRESS RECORDS:");
    console.log("=".repeat(60));
    
    const totalRecords = await pool.query("SELECT COUNT(*) as count FROM course_progress");
    console.log(`✅ Total progress records: ${totalRecords.rows[0].count}`);
    
    // Check India AI course progress specifically
    console.log("\n🎯 INDIA AI COURSE PROGRESS:");
    console.log("=".repeat(60));
    
    const indiaAiProgress = await pool.query(`
      SELECT 
        user_id,
        course_key,
        course_version,
        updated_at,
        created_at,
        CASE 
          WHEN progress IS NOT NULL THEN 'Has Data'
          ELSE 'No Data'
        END as progress_status
      FROM course_progress
      WHERE course_key = 'india-ai-course'
      ORDER BY updated_at DESC
      LIMIT 10
    `);
    
    console.log(`✅ India AI course records: ${indiaAiProgress.rows.length}`);
    
    if (indiaAiProgress.rows.length > 0) {
      console.log("\n📋 RECENT INDIA AI PROGRESS:");
      indiaAiProgress.rows.forEach((row, index) => {
        console.log(`${index + 1}. User ${row.user_id} - ${row.course_version} - ${row.progress_status} - Updated: ${row.updated_at}`);
      });
    }
    
    // Check users without progress
    console.log("\n👥 USERS WITHOUT INDIA AI PROGRESS:");
    console.log("=".repeat(60));
    
    const usersWithoutProgress = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        COUNT(cp.user_id) as progress_count
      FROM users u
      LEFT JOIN course_progress cp ON u.id = cp.user_id AND cp.course_key = 'india-ai-course'
      WHERE cp.user_id IS NULL
      LIMIT 10
    `);
    
    console.log(`✅ Users without India AI progress: ${usersWithoutProgress.rows.length}`);
    
    if (usersWithoutProgress.rows.length > 0) {
      console.log("\n📋 USERS WITHOUT PROGRESS:");
      usersWithoutProgress.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.username} (${row.email}) - ID: ${row.id}`);
      });
    }
    
    // Check for potential data issues
    console.log("\n⚠️  POTENTIAL ISSUES:");
    console.log("=".repeat(60));
    
    // Check for NULL progress data
    const nullProgress = await pool.query(`
      SELECT COUNT(*) as count
      FROM course_progress
      WHERE progress IS NULL
    `);
    
    if (nullProgress.rows[0].count > 0) {
      console.log(`❌ Found ${nullProgress.rows[0].count} records with NULL progress data`);
    }
    
    // Check for invalid JSON
    const invalidJson = await pool.query(`
      SELECT COUNT(*) as count
      FROM course_progress
      WHERE progress::text = 'null' OR progress::text = ''
    `);
    
    if (invalidJson.rows[0].count > 0) {
      console.log(`❌ Found ${invalidJson.rows[0].count} records with invalid JSON`);
    }
    
    // Check user ID format issues
    const userIdIssues = await pool.query(`
      SELECT COUNT(*) as count
      FROM course_progress cp
      JOIN users u ON cp.user_id = u.id
      WHERE u.id IS NULL
    `);
    
    if (userIdIssues.rows[0].count > 0) {
      console.log(`❌ Found ${userIdIssues.rows[0].count} records with invalid user IDs`);
    }
    
    console.log("\n🎯 DIAGNOSIS:");
    console.log("=".repeat(60));
    
    if (!tableExists) {
      console.log("❌ course_progress table doesn't exist - NEED TO CREATE");
    } else if (totalRecords.rows[0].count === 0) {
      console.log("⚠️  No progress records found - Users haven't started tracking");
    } else if (indiaAiProgress.rows.length === 0) {
      console.log("⚠️  No India AI course progress found - Course tracking issue");
    } else if (nullProgress.rows[0].count > 0 || invalidJson.rows[0].count > 0) {
      console.log("❌ Data corruption found - NEED TO CLEAN UP");
    } else if (userIdIssues.rows[0].count > 0) {
      console.log("❌ User ID mismatch - NEED TO FIX REFERENCES");
    } else {
      console.log("✅ Course progress tracking appears to be working");
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

debugCourseProgress();
