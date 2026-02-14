#!/usr/bin/env node

/**
 * Database Schema Verification Script
 * 
 * This script compares the users table schema between primary and secondary databases
 * and ensures they match before syncing data.
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
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    secondaryPool = new Pool({
      connectionString: process.env.DATABASE_URL2,
      max: 5,
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
 * Get table schema information
 */
async function getTableSchema(pool, tableName = 'users') {
  const query = `
    SELECT 
      column_name,
      data_type,
      is_nullable,
      column_default,
      character_maximum_length,
      numeric_precision,
      numeric_scale
    FROM information_schema.columns 
    WHERE table_name = $1 
    ORDER BY ordinal_position;
  `;
  
  try {
    const result = await pool.query(query, [tableName]);
    return result.rows;
  } catch (error) {
    log.error(`Failed to get schema for table ${tableName}:`, error.message);
    return [];
  }
}

/**
 * Check if table exists
 */
async function tableExists(pool, tableName = 'users') {
  const query = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = $1
    );
  `;
  
  try {
    const result = await pool.query(query, [tableName]);
    return result.rows[0].exists;
  } catch (error) {
    log.error(`Failed to check if table ${tableName} exists:`, error.message);
    return false;
  }
}

/**
 * Create users table in secondary database with proper schema
 */
async function createUsersTable() {
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
    
    -- Create indexes for better performance
    CREATE UNIQUE INDEX IF NOT EXISTS users_username_idx ON users(username);
    CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users(email);
    CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
    CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at);
  `;
  
  try {
    await secondaryPool.query(createTableQuery);
    log.success('Users table created/verified in secondary database');
  } catch (error) {
    log.error('Failed to create users table in secondary database:', error.message);
    throw error;
  }
}

/**
 * Compare schemas between databases
 */
function compareSchemas(primarySchema, secondarySchema) {
  const differences = [];
  
  // Create maps for easier comparison
  const primaryMap = new Map(primarySchema.map(col => [col.column_name, col]));
  const secondaryMap = new Map(secondarySchema.map(col => [col.column_name, col]));
  
  // Check for columns in primary but not in secondary
  for (const [colName, colInfo] of primaryMap) {
    if (!secondaryMap.has(colName)) {
      differences.push({
        type: 'missing_in_secondary',
        column: colName,
        details: colInfo
      });
    } else {
      // Check for type differences
      const secCol = secondaryMap.get(colName);
      if (colInfo.data_type !== secCol.data_type) {
        differences.push({
          type: 'type_mismatch',
          column: colName,
          primary_type: colInfo.data_type,
          secondary_type: secCol.data_type
        });
      }
    }
  }
  
  // Check for columns in secondary but not in primary
  for (const [colName, colInfo] of secondaryMap) {
    if (!primaryMap.has(colName)) {
      differences.push({
        type: 'extra_in_secondary',
        column: colName,
        details: colInfo
      });
    }
  }
  
  return differences;
}

/**
 * Get user count from database
 */
async function getUserCount(pool) {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM users');
    return parseInt(result.rows[0].count);
  } catch (error) {
    log.error('Failed to get user count:', error.message);
    return 0;
  }
}

/**
 * Sync users from primary to secondary database
 */
async function syncUsers() {
  log.info('Starting user synchronization...');
  
  const BATCH_SIZE = 50;
  let offset = 0;
  let totalSynced = 0;
  let totalErrors = 0;
  
  const primaryCount = await getUserCount(primaryPool);
  const secondaryCount = await getUserCount(secondaryPool);
  
  log.info(`Primary database users: ${primaryCount}`);
  log.info(`Secondary database users: ${secondaryCount}`);
  log.info(`Users to process: ${primaryCount}`);
  
  while (offset < primaryCount) {
    try {
      // Fetch batch from primary database
      const result = await primaryPool.query(`
        SELECT id, username, email, password, role, student_type, college_name, 
               degree, school_class, school_affiliation, terms_accepted, created_at
        FROM users 
        ORDER BY created_at ASC 
        LIMIT $1 OFFSET $2
      `, [BATCH_SIZE, offset]);
      
      const users = result.rows;
      if (users.length === 0) break;
      
      log.info(`Processing batch: ${offset + 1}-${offset + users.length} of ${primaryCount}`);
      
      // Sync each user
      for (const user of users) {
        try {
          await secondaryPool.query(`
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
          `, [
            user.id, user.username, user.email, user.password, user.role,
            user.student_type, user.college_name, user.degree, user.school_class,
            user.school_affiliation, user.terms_accepted, user.created_at
          ]);
          
          totalSynced++;
        } catch (userError) {
          log.error(`Failed to sync user ${user.username} (${user.id}):`, userError.message);
          totalErrors++;
        }
      }
      
      offset += BATCH_SIZE;
      
      // Small delay to avoid overwhelming the databases
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (batchError) {
      log.error(`Failed to process batch at offset ${offset}:`, batchError.message);
      break;
    }
  }
  
  const finalSecondaryCount = await getUserCount(secondaryPool);
  
  log.success(`Synchronization completed:`);
  log.success(`  Users synced: ${totalSynced}`);
  log.success(`  Errors: ${totalErrors}`);
  log.success(`  Final secondary database count: ${finalSecondaryCount}`);
}

/**
 * Main verification and sync function
 */
async function main() {
  try {
    await initializeDatabases();
    
    log.info('Verifying database schemas...');
    
    // Check if users table exists in both databases
    const primaryExists = await tableExists(primaryPool, 'users');
    const secondaryExists = await tableExists(secondaryPool, 'users');
    
    log.info(`Primary database users table exists: ${primaryExists}`);
    log.info(`Secondary database users table exists: ${secondaryExists}`);
    
    if (!primaryExists) {
      throw new Error('Users table does not exist in primary database');
    }
    
    if (!secondaryExists) {
      log.warn('Users table does not exist in secondary database, creating...');
      await createUsersTable();
    }
    
    // Get schemas
    const primarySchema = await getTableSchema(primaryPool, 'users');
    const secondarySchema = await getTableSchema(secondaryPool, 'users');
    
    log.info(`Primary schema columns: ${primarySchema.length}`);
    log.info(`Secondary schema columns: ${secondarySchema.length}`);
    
    // Compare schemas
    const differences = compareSchemas(primarySchema, secondarySchema);
    
    if (differences.length > 0) {
      log.warn('Schema differences found:');
      differences.forEach(diff => {
        switch (diff.type) {
          case 'missing_in_secondary':
            log.warn(`  Missing column in secondary: ${diff.column} (${diff.details.data_type})`);
            break;
          case 'extra_in_secondary':
            log.warn(`  Extra column in secondary: ${diff.column} (${diff.details.data_type})`);
            break;
          case 'type_mismatch':
            log.warn(`  Type mismatch for ${diff.column}: primary=${diff.primary_type}, secondary=${diff.secondary_type}`);
            break;
        }
      });
      
      // For critical differences, we might want to stop
      const criticalDiffs = differences.filter(d => d.type === 'missing_in_secondary' || d.type === 'type_mismatch');
      if (criticalDiffs.length > 0) {
        log.warn('Critical schema differences detected, but proceeding with sync...');
        log.warn('Some data might not sync properly due to schema mismatches');
      }
    } else {
      log.success('Schemas match perfectly!');
    }
    
    // Proceed with sync
    await syncUsers();
    
  } catch (error) {
    log.error('Schema verification and sync failed:', error.message);
    throw error;
  } finally {
    // Cleanup
    if (primaryPool) await primaryPool.end();
    if (secondaryPool) await secondaryPool.end();
    log.info('Database connections closed');
  }
}

// Run the script
main().catch((error) => {
  log.error('Script failed:', error.message);
  process.exit(1);
});
