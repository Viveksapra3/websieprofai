import "dotenv/config";
import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: false,
});

async function addUserNumberColumn() {
  try {
    console.log("Adding user_number column to users table...");
    
    // Add the column if it doesn't exist
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS user_number SERIAL
    `);
    
    console.log("Column added. Now populating with sequential numbers...");
    
    // Update existing users with sequential numbers based on created_at order
    await pool.query(`
      WITH numbered AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) as rn
        FROM users
      )
      UPDATE users 
      SET user_number = numbered.rn
      FROM numbered 
      WHERE users.id = numbered.id
    `);
    
    // Get the mapping result
    const result = await pool.query(`
      SELECT user_number, id, email, username, created_at 
      FROM users 
      ORDER BY user_number ASC
    `);
    
    console.log("\n=== User ID Mapping ===");
    console.log("user_number | id | email | username");
    console.log("-".repeat(80));
    
    for (const row of result.rows) {
      console.log(`${row.user_number} | ${row.id.substring(0, 8)}... | ${row.email} | ${row.username}`);
    }
    
    console.log("-".repeat(80));
    console.log(`Total users mapped: ${result.rows.length}`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

addUserNumberColumn();
