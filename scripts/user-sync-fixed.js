#!/usr/bin/env node

/**
 * Fixed User Synchronization Script
 * 
 * Maps user_number from DATABASE_URL to id in DATABASE_URL2
 * Handles constraint violations and value mappings correctly.
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
const BATCH_SIZE = 20; // Smaller batch size to avoid timeouts
const DELAY_MS = 200;   // Longer delay between operations

// Value mappings for constraints
const STUDENT_TYPE_MAPPING = {
  'college': 'undergrad',
  'school': 'high_school',
  // Add null handling
  null: null,
  undefined: null
};

const log = {
  info: (msg, ...args) => console.log(`[INFO] ${new Date().toISOString()} ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN] ${new Date().toISOString()} ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR] ${new Date().toISOString()} ${msg}`, ...args),
  success: (msg, ...args) => console.log(`[SUCCESS] ${new Date().toISOString()} ${msg}`, ...args),
};

/**
 * Initialize database connections with better timeout handling
 */
async function initializeDatabases() {
  try {
    if (!process.env.DATABASE_URL || !process.env.DATABASE_URL2) {
      throw new Error('Both DATABASE_URL and DATABASE_URL2 environment variables are required');
    }

    primaryPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 15000,
      statement_timeout: 30000,
      query_timeout: 30000,
    });

    secondaryPool = new Pool({
      connectionString: process.env.DATABASE_URL2,
      max: 5,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 15000,
      statement_timeout: 30000,
      query_timeout: 30000,
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
 * Map student_type value from primary to secondary database format
 */
function mapStudentType(primaryValue) {
  if (primaryValue === null || primaryValue === undefined) {
    return null;
  }
  
  const mapped = STUDENT_TYPE_MAPPING[primaryValue];
  if (mapped === undefined) {
    log.warn(`Unknown student_type value: "${primaryValue}", mapping to null`);
    return null;
  }
  
  return mapped;
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
 * Check if user exists in secondary database
 */
async function getUserInSecondary(userNumber) {
  try {
    const result = await secondaryPool.query('SELECT id, username, email FROM users WHERE user_number = $1 OR id = $1', [userNumber]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    log.error(`Failed to check if user ${userNumber} exists in secondary database:`, error.message);
    return null;
  }
}

/**
 * Insert or update user in secondary database with proper constraint handling
 */
async function syncUserToSecondary(user) {
  try {
    // Map values to match secondary database constraints
    const mappedStudentType = mapStudentType(user.student_type);
    
    // Check if user already exists (by user_number or id)
    const existingUser = await getUserInSecondary(user.user_number);
    
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
          user_number = $16,
          updated_at = NOW()
        WHERE id = $1
        RETURNING id, user_number, username
      `;
      
      const result = await secondaryPool.query(updateQuery, [
        existingUser.id,
        user.username,
        user.email,
        user.password,
        user.role,
        mappedStudentType,
        user.college_name,
        user.degree,
        user.school_class,
        user.school_affiliation,
        user.terms_accepted,
        user.created_at,
        user.institution,
        user.subject,
        user.experience,
        user.user_number
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
        ON CONFLICT (id) DO UPDATE SET
          username = EXCLUDED.username,
          email = EXCLUDED.email,
          password = EXCLUDED.password,
          role = EXCLUDED.role,
          student_type = EXCLUDED.student_type,
          college_name = EXCLUDED.college_name,
          degree = EXCLUDED.degree,
          school_class = EXCLUDED.school_class,
          school_affiliation = EXCLUDED.school_affiliation,
          terms_accepted = EXCLUDED.terms_accepted,
          institution = EXCLUDED.institution,
          subject = EXCLUDED.subject,
          experience = EXCLUDED.experience,
          user_number = EXCLUDED.user_number,
          updated_at = NOW()
        RETURNING id, user_number, username
      `;
      
      const result = await secondaryPool.query(insertQuery, [
        user.user_number, // Use user_number as id in secondary database
        user.username,
        user.email,
        user.password,
        user.role,
        mappedStudentType,
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
      
      log.info(`Synced user: ${user.username} (user_number: ${user.user_number} -> id: ${result.rows[0].id})`);
      return true;
    }
    
  } catch (error) {
    // Handle unique constraint violations more gracefully
    if (error.code === '23505') {
      log.warn(`User ${user.username} (user_number: ${user.user_number}) has unique constraint conflict: ${error.detail}`);
      
      // Try to resolve by updating existing record with same email or username
      try {
        const conflictQuery = `
          UPDATE users SET
            user_number = $2,
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
            updated_at = NOW()
          WHERE email = $1 OR username = $1
          RETURNING id, user_number, username
        `;
        
        const result = await secondaryPool.query(conflictQuery, [
          user.email,
          user.user_number,
          user.password,
          user.role,
          mapStudentType(user.student_type),
          user.college_name,
          user.degree,
          user.school_class,
          user.school_affiliation,
          user.terms_accepted,
          user.institution,
          user.subject,
          user.experience
        ]);
        
        if (result.rows.length > 0) {
          log.info(`Resolved conflict for user: ${user.username} -> id: ${result.rows[0].id}`);
          return true;
        }
      } catch (resolveError) {
        log.error(`Failed to resolve conflict for user ${user.username}:`, resolveError.message);
      }
      
      return false;
    } else {
      log.error(`Failed to sync user ${user.username} (user_number: ${user.user_number}):`, error.message);
      return false;
    }
  }
}

/**
 * Main sync function with better error handling
 */
async function syncUsers() {
  log.info('Starting user synchronization with constraint handling...');
  
  try {
    const totalUsers = await getTotalUserCount();
    log.info(`Total users to sync: ${totalUsers}`);
    
    let offset = 0;
    let totalSynced = 0;
    let totalErrors = 0;
    let totalSkipped = 0;
    
    while (offset < totalUsers) {
      try {
        const users = await getUsersFromPrimary(BATCH_SIZE, offset);
        
        if (users.length === 0) break;
        
        log.info(`Processing batch: ${offset + 1}-${offset + users.length} of ${totalUsers}`);
        
        for (const user of users) {
          try {
            const success = await syncUserToSecondary(user);
            if (success) {
              totalSynced++;
            } else {
              totalSkipped++;
            }
            
            // Small delay between each user to avoid overwhelming the database
            await new Promise(resolve => setTimeout(resolve, 50));
            
          } catch (userError) {
            log.error(`Error processing user ${user.username}:`, userError.message);
            totalErrors++;
          }
        }
        
        log.info(`Batch completed: ${users.length} processed (${totalSynced} synced, ${totalSkipped} skipped, ${totalErrors} errors)`);
        offset += BATCH_SIZE;
        
        // Longer delay between batches
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        
      } catch (batchError) {
        log.error(`Failed to process batch at offset ${offset}:`, batchError.message);
        log.info('Retrying batch in 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        // Don't increment offset to retry the same batch
      }
    }
    
    // Final verification
    const secondaryCount = await secondaryPool.query('SELECT COUNT(*) as count FROM users');
    
    log.success(`Synchronization completed:`);
    log.success(`  Users synced: ${totalSynced}`);
    log.success(`  Users skipped: ${totalSkipped}`);
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
  
  try {
    if (primaryPool) await primaryPool.end();
    if (secondaryPool) await secondaryPool.end();
  } catch (error) {
    log.error('Error during cleanup:', error.message);
  }
  
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
