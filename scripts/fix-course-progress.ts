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

async function fixCourseProgress() {
  try {
    console.log("🔧 FIXING COURSE PROGRESS TRACKING");
    console.log("=".repeat(60));
    
    // Check table structure
    console.log("\n📋 CHECKING TABLE STRUCTURE:");
    console.log("=".repeat(60));
    
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'course_progress'
      ORDER BY ordinal_position;
    `);
    
    console.log("📊 TABLE STRUCTURE:");
    structure.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
    });
    
    // Check total records
    const totalRecords = await pool.query("SELECT COUNT(*) as count FROM course_progress");
    console.log(`\n📈 Total progress records: ${totalRecords.rows[0].count}`);
    
    // Check users
    console.log("\n👥 CHECKING USERS:");
    console.log("=".repeat(60));
    
    const users = await pool.query(`
      SELECT id, username, email, role
      FROM users
      WHERE role = 'student'
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    console.log(`✅ Found ${users.rows.length} student users:`);
    users.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email}) - ID: ${user.id}`);
    });
    
    // Check recent API calls or potential issues
    console.log("\n🔍 POTENTIAL ISSUES:");
    console.log("=".repeat(60));
    
    // Issue 1: No progress records at all
    if (totalRecords.rows[0].count === 0) {
      console.log("❌ ISSUE: No course progress records found");
      console.log("🔧 CAUSE: Progress tracking may not be working");
      
      // Check if there are any course completion attempts
      console.log("\n🎯 TESTING PROGRESS TRACKING:");
      
      if (users.rows.length > 0) {
        const testUser = users.rows[0];
        console.log(`📝 Testing with user: ${testUser.username} (ID: ${testUser.id})`);
        
        // Try to insert a test progress record
        try {
          const testProgress = await pool.query(`
            INSERT INTO course_progress (user_id, course_key, course_version, progress)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, course_key, course_version) 
            DO UPDATE SET progress = EXCLUDED.progress, updated_at = NOW()
            RETURNING *
          `, [
            testUser.id,
            'india-ai-course',
            'v5',
            JSON.stringify([{ test: true }])
          ]);
          
          console.log("✅ Test progress record created successfully");
          console.log("📋 Record:", testProgress.rows[0]);
          
          // Clean up test record
          await pool.query("DELETE FROM course_progress WHERE user_id = $1", [testUser.id]);
          console.log("🧹 Test record cleaned up");
          
        } catch (insertError) {
          console.log("❌ Failed to insert test progress:", insertError.message);
        }
      }
    }
    
    // Issue 2: Check user ID format mismatch
    console.log("\n🔍 USER ID FORMAT CHECK:");
    console.log("=".repeat(60));
    
    const userIdFormats = await pool.query(`
      SELECT 
        id,
        CASE 
          WHEN id ~ '^[0-9]+$' THEN 'Integer'
          WHEN id ~ '^[a-f0-9-]{36}$' THEN 'UUID'
          ELSE 'Other'
        END as id_format
      FROM users
      LIMIT 5
    `);
    
    console.log("📊 User ID formats:");
    userIdFormats.rows.forEach(row => {
      console.log(`- User ${row.id}: ${row.id_format}`);
    });
    
    // Issue 3: Check course key and version
    console.log("\n📚 COURSE CONFIGURATION CHECK:");
    console.log("=".repeat(60));
    
    console.log("📋 Expected course configuration:");
    console.log("- Course Key: 'india-ai-course'");
    console.log("- Course Version: 'v5'");
    console.log("- Storage Prefix: 'course-progress'");
    
    // Check if there are any server-side issues
    console.log("\n🌐 SERVER-SIDE CHECKS:");
    console.log("=".repeat(60));
    
    console.log("🔧 Potential server issues:");
    console.log("1. Session management - User authentication");
    console.log("2. Database connection - DATABASE_URL2");
    console.log("3. API endpoint - /api/course-progress/:courseKey");
    console.log("4. Client-side storage - localStorage");
    console.log("5. Course version mismatch");
    
    console.log("\n💡 RECOMMENDATIONS:");
    console.log("=".repeat(60));
    
    if (totalRecords.rows[0].count === 0) {
      console.log("🎯 IMMEDIATE ACTIONS:");
      console.log("1. Check if users are authenticated");
      console.log("2. Verify API endpoints are working");
      console.log("3. Test course progress saving");
      console.log("4. Check browser console for errors");
      console.log("5. Verify localStorage is working");
    }
    
    console.log("\n🔧 DEBUGGING STEPS:");
    console.log("1. Open browser developer tools");
    console.log("2. Go to Network tab");
    console.log("3. Start the India AI course");
    console.log("4. Complete a lesson");
    console.log("5. Check for /api/course-progress calls");
    console.log("6. Verify response status and data");
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

fixCourseProgress();
