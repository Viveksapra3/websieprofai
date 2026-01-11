import "dotenv/config";
import { Pool } from "pg";
import * as crypto from "crypto";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: false,
});

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function createAdminUser() {
  const adminEmail = "admin@profai.com";
  const adminPassword = "Admin@123";
  const adminUsername = "ProfAI Admin";
  
  try {
    // Check if admin user already exists
    const existingUser = await pool.query(
      "SELECT id, email, role FROM users WHERE email = $1",
      [adminEmail]
    );
    
    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      if (user.role === 'admin') {
        console.log("Admin user already exists!");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
      } else {
        // Update existing user to admin role
        await pool.query(
          "UPDATE users SET role = 'admin' WHERE email = $1",
          [adminEmail]
        );
        console.log("Updated existing user to admin role!");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
      }
    } else {
      // Create new admin user
      const hashedPassword = hashPassword(adminPassword);
      
      await pool.query(
        `INSERT INTO users (username, email, password, role, terms_accepted) 
         VALUES ($1, $2, $3, 'admin', true)`,
        [adminUsername, adminEmail, hashedPassword]
      );
      
      console.log("Admin user created successfully!");
      console.log("=====================================");
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      console.log("=====================================");
    }
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await pool.end();
  }
}

createAdminUser();
