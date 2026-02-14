#!/usr/bin/env tsx

/**
 * User Synchronization Script (TypeScript)
 * 
 * This script synchronizes users between the primary database (DATABASE_URL) 
 * and secondary database (DATABASE_URL2) using the existing Drizzle setup.
 */

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from '../shared/schema.js';
import { eq, gt, or } from 'drizzle-orm';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFile, readFile } from 'fs/promises';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Configuration
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const BATCH_SIZE = 100;

// Logging utility
const log = {
  info: (msg: string, ...args: any[]) => console.log(`[INFO] ${new Date().toISOString()} ${msg}`, ...args),
  warn: (msg: string, ...args: any[]) => console.warn(`[WARN] ${new Date().toISOString()} ${msg}`, ...args),
  error: (msg: string, ...args: any[]) => console.error(`[ERROR] ${new Date().toISOString()} ${msg}`, ...args),
  success: (msg: string, ...args: any[]) => console.log(`[SUCCESS] ${new Date().toISOString()} ${msg}`, ...args),
};

// Database connections
let primaryDb: ReturnType<typeof drizzle>;
let secondaryDb: ReturnType<typeof drizzle>;
let primaryPool: Pool;
let secondaryPool: Pool;

/**
 * Initialize database connections
 */
async function initializeDatabases() {
  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL2) {
    throw new Error('Both DATABASE_URL and DATABASE_URL2 environment variables are required');
  }

  primaryPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  secondaryPool = new Pool({
    connectionString: process.env.DATABASE_URL2,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  primaryDb = drizzle(primaryPool);
  secondaryDb = drizzle(secondaryPool);

  // Test connections
  await primaryPool.query('SELECT 1');
  await secondaryPool.query('SELECT 1');
  
  log.info('Database connections established successfully');
  
  // Ensure users table exists in secondary database
  await ensureUsersTableExists();
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
  
  await secondaryPool.query(createTableQuery);
  log.info('Users table structure verified in secondary database');
}

/**
 * Get users from primary database
 */
async function getUsersFromPrimary(limit: number = BATCH_SIZE, offset: number = 0, sinceDate?: Date) {
  try {
    if (sinceDate) {
      return await primaryDb
        .select()
        .from(users)
        .where(gt(users.createdAt, sinceDate))
        .limit(limit)
        .offset(offset);
    } else {
      return await primaryDb
        .select()
        .from(users)
        .limit(limit)
        .offset(offset);
    }
  } catch (error: any) {
    log.error('Failed to fetch users from primary database:', error.message);
    throw error;
  }
}

/**
 * Get total user count from primary database
 */
async function getTotalUserCount(sinceDate?: Date): Promise<number> {
  const result = await primaryPool.query(
    sinceDate 
      ? 'SELECT COUNT(*) as count FROM users WHERE created_at > $1'
      : 'SELECT COUNT(*) as count FROM users',
    sinceDate ? [sinceDate] : []
  );
  return parseInt(result.rows[0].count);
}

/**
 * Sync user to secondary database
 */
async function syncUserToSecondary(user: any) {
  try {
    await secondaryDb
      .insert(users)
      .values({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        studentType: user.studentType,
        collegeName: user.collegeName,
        degree: user.degree,
        schoolClass: user.schoolClass,
        schoolAffiliation: user.schoolAffiliation,
        termsAccepted: user.termsAccepted,
        createdAt: user.createdAt,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          studentType: user.studentType,
          collegeName: user.collegeName,
          degree: user.degree,
          schoolClass: user.schoolClass,
          schoolAffiliation: user.schoolAffiliation,
          termsAccepted: user.termsAccepted,
        },
      });
    return true;
  } catch (error: any) {
    log.error(`Failed to sync user ${user.id}:`, error.message);
    return false;
  }
}

/**
 * Migrate all users from primary to secondary database
 */
async function migrateAllUsers() {
  log.info('Starting migration of all users...');
  
  const totalUsers = await getTotalUserCount();
  log.info(`Total users to migrate: ${totalUsers}`);
  
  let offset = 0;
  let totalSynced = 0;
  let totalErrors = 0;
  
  while (offset < totalUsers) {
    const usersBatch = await getUsersFromPrimary(BATCH_SIZE, offset);
    
    if (usersBatch.length === 0) break;
    
    log.info(`Processing batch: ${offset + 1}-${offset + usersBatch.length} of ${totalUsers}`);
    
    for (const user of usersBatch) {
      const success = await syncUserToSecondary(user);
      if (success) {
        totalSynced++;
      } else {
        totalErrors++;
      }
    }
    
    log.info(`Batch completed: ${usersBatch.length} processed`);
    offset += BATCH_SIZE;
    
    // Small delay to avoid overwhelming the databases
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  log.success(`Migration completed: ${totalSynced} users synced, ${totalErrors} errors`);
}

/**
 * Sync new/updated users since last sync
 */
async function syncNewUsers() {
  log.info('Starting sync of new/updated users...');
  
  const lastSyncFile = join(__dirname, '.last-sync');
  let lastSyncDate: Date | undefined;
  
  try {
    const lastSyncStr = await readFile(lastSyncFile, 'utf8');
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
    const usersBatch = await getUsersFromPrimary(BATCH_SIZE, offset, lastSyncDate);
    
    if (usersBatch.length === 0) break;
    
    log.info(`Processing batch: ${offset + 1}-${offset + usersBatch.length} of ${totalUsers}`);
    
    for (const user of usersBatch) {
      const success = await syncUserToSecondary(user);
      if (success) {
        totalSynced++;
      } else {
        totalErrors++;
      }
    }
    
    offset += BATCH_SIZE;
  }
  
  // Update last sync timestamp
  try {
    await writeFile(lastSyncFile, new Date().toISOString());
  } catch (error: any) {
    log.warn('Failed to update last sync timestamp:', error.message);
  }
  
  log.success(`Sync completed: ${totalSynced} users synced, ${totalErrors} errors`);
}

/**
 * Run continuous sync
 */
async function runContinuousSync() {
  log.info(`Starting continuous sync (interval: ${SYNC_INTERVAL / 1000}s)`);
  
  const syncLoop = async () => {
    try {
      await syncNewUsers();
    } catch (error: any) {
      log.error('Continuous sync iteration failed:', error.message);
    }
    
    setTimeout(syncLoop, SYNC_INTERVAL);
  };
  
  await syncLoop();
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
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
User Synchronization Script

Usage:
  npm run user-sync -- --migrate-all    # One-time migration of all users
  npm run user-sync -- --sync-new      # Sync only new/updated users  
  npm run user-sync -- --continuous    # Run continuous sync (every 5 minutes)

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
      return; // Keep process running
    } else {
      log.error('Invalid arguments. Use --migrate-all, --sync-new, or --continuous');
      process.exit(1);
    }
    
    await cleanup();
    log.success('Script completed successfully');
    
  } catch (error: any) {
    log.error('Script failed:', error.message);
    await cleanup();
    process.exit(1);
  }
}

// Export for use in other modules
export { syncUserToSecondary, initializeDatabases, cleanup };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(async (error: any) => {
    log.error('Unhandled error:', error.message);
    await cleanup();
    process.exit(1);
  });
}
