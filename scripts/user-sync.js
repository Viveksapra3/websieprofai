#!/usr/bin/env node

/**
 * User Synchronization Script
 * 
 * This script synchronizes users between the primary database (DATABASE_URL) 
 * and secondary database (DATABASE_URL2).
 * 
 * Features:
 * - Initial migration of all existing users
 * - Ongoing sync of new/updated users
 * - Conflict resolution (primary database wins)
 * - Detailed logging and error handling
 * 
 * Usage:
 *   node scripts/user-sync.js --migrate-all    # One-time migration of all users
 *   node scripts/user-sync.js --sync-new      # Sync only new/updated users
 *   node scripts/user-sync.js --continuous    # Run continuous sync (every 5 minutes)
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
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const BATCH_SIZE = 100; // Process users in batches
const MAX_RETRIES = 3;

// Logging utility
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
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    if (!process.env.DATABASE_URL2) {
      throw new Error('DATABASE_URL2 environment variable is required');
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
    
    // Ensure users table exists in secondary database
    await ensureUsersTableExists();
    
  } catch (error) {
    log.error('Failed to initialize databases:', error.message);
    throw error;
  }
}

/**
 * Ensure users table exists in secondary database
 */
async function ensureUsersTableExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      student_type TEXT,
      college_name TEXT,
      degree TEXT,
      school_class TEXT,
      school_affiliation TEXT,
      terms_accepted BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE UNIQUE INDEX IF NOT EXISTS users_username_idx ON users(username);
    CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users(email);
    CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
    CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at);
  `;
  
  try {
    await secondaryPool.query(createTableQuery);
    log.info('Users table structure verified in secondary database');
  } catch (error) {
    log.error('Failed to create users table in secondary database:', error.message);
    throw error;
  }
}

/**
 * Get users from primary database
 */
async function getUsersFromPrimary(offset = 0, limit = BATCH_SIZE, sinceDate = null) {
  let query = `
    SELECT id, username, email, password, role, student_type, college_name, 
           degree, school_class, school_affiliation, terms_accepted, created_at
    FROM users
  `;
  
  const params = [];
  
  if (sinceDate) {
    query += ` WHERE created_at > $1 OR updated_at > $1`;
    params.push(sinceDate);
  }
  
  query += ` ORDER BY created_at ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);
  
  try {
    const result = await primaryPool.query(query, params);
    return result.rows;
  } catch (error) {
    log.error('Failed to fetch users from primary database:', error.message);
    throw error;
  }
}

/**
 * Get total user count from primary database
 */
async function getTotalUserCount(sinceDate = null) {
  let query = 'SELECT COUNT(*) as count FROM users';
  const params = [];
  
  if (sinceDate) {
    query += ' WHERE created_at > $1 OR updated_at > $1';
    params.push(sinceDate);
  }
  
  try {
    const result = await primaryPool.query(query, params);
    return parseInt(result.rows[0].count);
  } catch (error) {
    log.error('Failed to get user count from primary database:', error.message);
    throw error;
  }
}

/**
 * Check if user exists in secondary database
 */
async function userExistsInSecondary(userId) {
  try {
    const result = await secondaryPool.query('SELECT id FROM users WHERE id = $1', [userId]);
    return result.rows.length > 0;
  } catch (error) {
    log.error(`Failed to check if user ${userId} exists in secondary database:`, error.message);
    return false;
  }
}

/**
 * Insert user into secondary database
 */
async function insertUserIntoSecondary(user) {
  const query = `
    INSERT INTO users (
      id, username, email, password, role, student_type, college_name,
      degree, school_class, school_affiliation, terms_accepted, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
      created_at = EXCLUDED.created_at
  `;
  
  const values = [
    user.id,
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
    user.created_at
  ];
  
  try {
    await secondaryPool.query(query, values);
    return true;
  } catch (error) {
    // Handle unique constraint violations gracefully
    if (error.code === '23505') {
      log.warn(`User ${user.id} (${user.username}) already exists with conflicting unique field, updating...`);
      
      // Try to update instead
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
          terms_accepted = $11
        WHERE id = $1
      `;
      
      try {
        await secondaryPool.query(updateQuery, [
          user.id, user.username, user.email, user.password, user.role,
          user.student_type, user.college_name, user.degree, user.school_class,
          user.school_affiliation, user.terms_accepted
        ]);
        return true;
      } catch (updateError) {
        log.error(`Failed to update user ${user.id}:`, updateError.message);
        return false;
      }
    } else {
      log.error(`Failed to insert user ${user.id}:`, error.message);
      return false;
    }
  }
}

/**
 * Sync users in batches
 */
async function syncUsersBatch(users) {
  let successCount = 0;
  let errorCount = 0;
  
  for (const user of users) {
    const success = await insertUserIntoSecondary(user);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }
  
  return { successCount, errorCount };
}

/**
 * Migrate all users from primary to secondary database
 */
async function migrateAllUsers() {
  log.info('Starting migration of all users...');
  
  try {
    const totalUsers = await getTotalUserCount();
    log.info(`Total users to migrate: ${totalUsers}`);
    
    let offset = 0;
    let totalSynced = 0;
    let totalErrors = 0;
    
    while (offset < totalUsers) {
      const users = await getUsersFromPrimary(offset, BATCH_SIZE);
      
      if (users.length === 0) {
        break;
      }
      
      log.info(`Processing batch: ${offset + 1}-${offset + users.length} of ${totalUsers}`);
      
      const { successCount, errorCount } = await syncUsersBatch(users);
      totalSynced += successCount;
      totalErrors += errorCount;
      
      log.info(`Batch completed: ${successCount} synced, ${errorCount} errors`);
      
      offset += BATCH_SIZE;
      
      // Small delay to avoid overwhelming the databases
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    log.success(`Migration completed: ${totalSynced} users synced, ${totalErrors} errors`);
    
  } catch (error) {
    log.error('Migration failed:', error.message);
    throw error;
  }
}

/**
 * Sync new/updated users (since last sync)
 */
async function syncNewUsers() {
  log.info('Starting sync of new/updated users...');
  
  try {
    // Get last sync timestamp (you might want to store this in a config table)
    const lastSyncFile = join(__dirname, '.last-sync');
    let lastSyncDate = null;
    
    try {
      const fs = await import('fs/promises');
      const lastSyncStr = await fs.readFile(lastSyncFile, 'utf8');
      lastSyncDate = new Date(lastSyncStr.trim());
      log.info(`Last sync: ${lastSyncDate.toISOString()}`);
    } catch {
      log.info('No previous sync timestamp found, syncing all users');
    }
    
    const totalUsers = await getTotalUserCount(lastSyncDate);
    log.info(`Users to sync: ${totalUsers}`);
    
    if (totalUsers === 0) {
      log.info('No new users to sync');
      return;
    }
    
    let offset = 0;
    let totalSynced = 0;
    let totalErrors = 0;
    
    while (offset < totalUsers) {
      const users = await getUsersFromPrimary(offset, BATCH_SIZE, lastSyncDate);
      
      if (users.length === 0) {
        break;
      }
      
      log.info(`Processing batch: ${offset + 1}-${offset + users.length} of ${totalUsers}`);
      
      const { successCount, errorCount } = await syncUsersBatch(users);
      totalSynced += successCount;
      totalErrors += errorCount;
      
      offset += BATCH_SIZE;
    }
    
    // Update last sync timestamp
    try {
      const fs = await import('fs/promises');
      await fs.writeFile(lastSyncFile, new Date().toISOString());
    } catch (error) {
      log.warn('Failed to update last sync timestamp:', error.message);
    }
    
    log.success(`Sync completed: ${totalSynced} users synced, ${totalErrors} errors`);
    
  } catch (error) {
    log.error('Sync failed:', error.message);
    throw error;
  }
}

/**
 * Run continuous sync
 */
async function runContinuousSync() {
  log.info(`Starting continuous sync (interval: ${SYNC_INTERVAL / 1000}s)`);
  
  const syncLoop = async () => {
    try {
      await syncNewUsers();
    } catch (error) {
      log.error('Continuous sync iteration failed:', error.message);
    }
    
    setTimeout(syncLoop, SYNC_INTERVAL);
  };
  
  // Initial sync
  await syncLoop();
}

/**
 * Cleanup database connections
 */
async function cleanup() {
  log.info('Cleaning up database connections...');
  
  if (primaryPool) {
    await primaryPool.end();
  }
  
  if (secondaryPool) {
    await secondaryPool.end();
  }
  
  log.info('Cleanup completed');
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
User Synchronization Script

Usage:
  node scripts/user-sync.js --migrate-all    # One-time migration of all users
  node scripts/user-sync.js --sync-new      # Sync only new/updated users  
  node scripts/user-sync.js --continuous    # Run continuous sync (every 5 minutes)

Environment Variables Required:
  DATABASE_URL      # Primary database connection string
  DATABASE_URL2     # Secondary database connection string
`);
    process.exit(1);
  }
  
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
    
    if (args.includes('--migrate-all')) {
      await migrateAllUsers();
    } else if (args.includes('--sync-new')) {
      await syncNewUsers();
    } else if (args.includes('--continuous')) {
      await runContinuousSync();
      // Keep the process running
      return;
    } else {
      log.error('Invalid arguments. Use --migrate-all, --sync-new, or --continuous');
      process.exit(1);
    }
    
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
