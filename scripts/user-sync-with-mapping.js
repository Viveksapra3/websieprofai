#!/usr/bin/env node

/**
 * User Synchronization Script with Proper ID Mapping
 * 
 * Maps user_number from DATABASE_URL to id in DATABASE_URL2
 * Handles the schema differences correctly.
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Database connection pools
let primaryPool;
let secondaryPool;

// Configuration
const BATCH_SIZE = 50;

const log = {
  info: (msg, ...args) => console.log(`[INFO] ${new Date().toISOString()} ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN] ${new Date().toISOString()} ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${new Date().toISOString()} ${msg}`, ...args),
  success: (msg, ...args) => console.log(`[SUCCESS] ${new Date().toISOString()} ${msg}`, ...args),
};

/**
 * Initialize database connections
 */
async function initializeDatabases() {
  try {
    if (!process.env.DATABASE_URL || !process.env.DATABASE_URL2) {
      throw new Error('Both DATABASE_URL and DATABASE_URL2 environment variables are required');
    }

    primaryPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    secondaryPool = new Pool({
      connectionString: process.env.DATABASE_URL2,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // Test connections
    await primaryPool.query('SELECT 1');
    await secondaryPool.query('SELECT 1');
    
    log.info('Database connections established successfully');
    
  } catch (error) {
    log.error('Failed to initialize databases:', error.message);
    throw error;
  }
}

/**
 * Get users from primary database with proper field selection
 */
async function getUsersFromPrimary(limit = BATCH_SIZE, offset = 0) {
  const query = `
    SELECT 
      id as original_id,
      user_number,
      username, 
      email, 
      password, 
      role, 
      student_type, 
      college_name, 
      degree, 
      school_class, 
      school_affiliation, 
      terms_accepted, 
      created_at,
      institution,
      subject,
      experience
    FROM users 
    WHERE user_number IS NOT NULL
    ORDER BY user_number ASC 
    LIMIT $1 OFFSET $2
  `;
  
  try {
    const result = await primaryPool.query(query, [limit, offset]);
    return result.rows;
  } catch (error) {
    log.error('Failed to fetch users from primary database:', error.message);
    throw error;
  }
}

/**
 * Get total user count from primary database
 */
async function getTotalUserCount() {
  try {
    const result = await primaryPool.query('SELECT COUNT(*) as count FROM users WHERE user_number IS NOT NULL');
    return parseInt(result.rows[0].count);
  } catch (error) {
    log.error('Failed to get user count from primary database:', error.message);
    throw error;
  }
}

/**
 * Check if user exists in secondary database by user_number
 */
async function userExistsInSecondary(userNumber) {
  try {
    const result = await secondaryPool.query('SELECT id FROM users WHERE user_number = $1', [userNumber]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    log.error(`Failed to check if user ${userNumber} exists in secondary database:`, error.message);
    return null;
  }
}

/**
 * Insert or update user in secondary database
 * Maps user_number from primary to id in secondary
 */
async function syncUserToSecondary(user) {
  try {
    // Check if user already exists
    const existingUser = await userExistsInSecondary(user.user_number);
    
    if (existingUser) {
      // Update existing user
      const updateQuery = `
        UPDATE users SET
          username = $2,
          email = $3,
          password = $4,
          role = $5,
          student_type = $6,
          college_name = $7,
          degree = $8,
          school_class = $9,
          school_affiliation = $10,
          terms_accepted = $11,
          created_at = $12,
          institution = $13,
          subject = $14,
          experience = $15,
          updated_at = NOW()
        WHERE user_number = $1
        RETURNING id, user_number
      `;
      
      const result = await secondaryPool.query(updateQuery, [
        user.user_number,
        user.username,
        user.email,
        user.password,
        user.role,
        user.student_type,
        user.college_name,
        user.degree,
        user.school_class,
        user.school_affiliation,
        user.terms_accepted,
        user.created_at,
        user.institution,
        user.subject,
        user.experience
      ]);
      
      log.info(`Updated user: ${user.username} (user_number: ${user.user_number} -> id: ${result.rows[0].id})`);
      return true;
      
    } else {
      // Insert new user with user_number as id
      const insertQuery = `
        INSERT INTO users (
          id, username, email, password, role, student_type, college_name,
          degree, school_class, school_affiliation, terms_accepted, created_at,
          institution, subject, experience, user_number, email_verified, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING id, user_number
      `;
      
      const result = await secondaryPool.query(insertQuery, [
        user.user_number, // Use user_number as id in secondary database
        user.username,
        user.email,
        user.password,
        user.role,
        user.student_type,
        user.college_name,
        user.degree,
        user.school_class,
        user.school_affiliation,
        user.terms_accepted,
        user.created_at,
        user.institution,
        user.subject,
        user.experience,
        user.user_number,
        false, // email_verified default
        true   // is_active default
      ]);
      
      log.info(`Inserted user: ${user.username} (user_number: ${user.user_number} -> id: ${result.rows[0].id})`);
      return true;
    }
    
  } catch (error) {
    // Handle unique constraint violations
    if (error.code === '23505') {
      log.warn(`User ${user.username} (user_number: ${user.user_number}) has unique constraint conflict: ${error.detail}`);
      
      // Try to update by email if username conflict
      if (error.detail.includes('email')) {
        try {
          const updateByEmailQuery = `
            UPDATE users SET
              username = $2,
              password = $3,
              role = $4,
              student_type = $5,
              college_name = $6,
              degree = $7,
              school_class = $8,
              school_affiliation = $9,
              terms_accepted = $10,
              institution = $11,
              subject = $12,
              experience = $13,
              user_number = $14,
              updated_at = NOW()
            WHERE email = $1
            RETURNING id, user_number
          `;
          
          const result = await secondaryPool.query(updateByEmailQuery, [
            user.email,
            user.username,
            user.password,
            user.role,
            user.student_type,
            user.college_name,
            user.degree,
            user.school_class,
            user.school_affiliation,
            user.terms_accepted,
            user.institution,
            user.subject,
            user.experience,
            user.user_number
          ]);
          
          log.info(`Updated user by email: ${user.username} (${user.email}) -> id: ${result.rows[0].id}`);
          return true;
        } catch (updateError) {
          log.error(`Failed to update user ${user.username} by email:`, updateError.message);
          return false;
        }
      }
      return false;
    } else {
      log.error(`Failed to sync user ${user.username} (user_number: ${user.user_number}):`, error.message);
      return false;
    }
  }
}

/**
 * Main sync function
 */
async function syncUsers() {
  log.info('Starting user synchronization with proper ID mapping...');
  
  try {
    const totalUsers = await getTotalUserCount();
    log.info(`Total users to sync: ${totalUsers}`);
    
    let offset = 0;
    let totalSynced = 0;
    let totalErrors = 0;
    
    while (offset < totalUsers) {
      const users = await getUsersFromPrimary(BATCH_SIZE, offset);
      
      if (users.length === 0) break;
      
      log.info(`Processing batch: ${offset + 1}-${offset + users.length} of ${totalUsers}`);
      
      for (const user of users) {
        const success = await syncUserToSecondary(user);
        if (success) {
          totalSynced++;
        } else {
          totalErrors++;
        }
      }
      
      log.info(`Batch completed: ${users.length} processed`);
      offset += BATCH_SIZE;
      
      // Small delay to avoid overwhelming the databases
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Final verification
    const secondaryCount = await secondaryPool.query('SELECT COUNT(*) as count FROM users');
    
    log.success(`Synchronization completed:`);
    log.success(`  Users synced: ${totalSynced}`);
    log.success(`  Errors: ${totalErrors}`);
    log.success(`  Total users in secondary database: ${secondaryCount.rows[0].count}`);
    
  } catch (error) {
    log.error('Sync failed:', error.message);
    throw error;
  }
}

/**
 * Cleanup database connections
 */
async function cleanup() {
  log.info('Cleaning up database connections...');
  
  if (primaryPool) await primaryPool.end();
  if (secondaryPool) await secondaryPool.end();
  
  log.info('Cleanup completed');
}

/**
 * Main function
 */
async function main() {
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    log.info('Received SIGINT, shutting down gracefully...');
    await cleanup();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    log.info('Received SIGTERM, shutting down gracefully...');
    await cleanup();
    process.exit(0);
  });
  
  try {
    await initializeDatabases();
    await syncUsers();
    await cleanup();
    log.success('Script completed successfully');
    
  } catch (error) {
    log.error('Script failed:', error.message);
    await cleanup();
    process.exit(1);
  }
}

// Run the script
main().catch(async (error) => {
  log.error('Unhandled error:', error.message);
  await cleanup();
  process.exit(1);
});
