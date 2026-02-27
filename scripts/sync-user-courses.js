#!/usr/bin/env node

/**
 * User Course Enrollment Sync Script
 * 
 * Syncs user course enrollments (purchases and progress) between 
 * DATABASE_URL and DATABASE_URL2 to ensure enrolled users have 
 * access to their courses in both databases.
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
 * Ensure required tables exist in secondary database
 */
async function ensureTablesExist() {
  const createTablesQuery = `
    -- Course pricing table
    CREATE TABLE IF NOT EXISTS course_pricing (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      course_id TEXT NOT NULL UNIQUE,
      course_name TEXT,
      price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      currency TEXT NOT NULL DEFAULT 'INR',
      is_free BOOLEAN NOT NULL DEFAULT false,
      display_order INTEGER,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- User purchases table
    CREATE TABLE IF NOT EXISTS user_purchases (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      course_id TEXT NOT NULL,
      payment_id VARCHAR,
      amount DECIMAL(10,2) NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      status TEXT NOT NULL DEFAULT 'pending',
      payment_method TEXT DEFAULT 'ccavenue',
      purchased_at TIMESTAMP DEFAULT NOW(),
      expires_at TIMESTAMP
    );

    -- Course progress table
    CREATE TABLE IF NOT EXISTS course_progress (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      course_key TEXT NOT NULL,
      course_version TEXT NOT NULL,
      progress JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Course images table
    CREATE TABLE IF NOT EXISTS course_images (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      course_id TEXT NOT NULL UNIQUE,
      course_name TEXT,
      image_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Course ID mapping table
    CREATE TABLE IF NOT EXISTS course_id_mapping (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      new_course_id TEXT NOT NULL UNIQUE,
      old_course_id TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_purchases_course_id ON user_purchases(course_id);
    CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_course_progress_course_key ON course_progress(course_key);
    CREATE INDEX IF NOT EXISTS idx_course_pricing_course_id ON course_pricing(course_id);
    CREATE INDEX IF NOT EXISTS idx_course_images_course_id ON course_images(course_id);
  `;
  
  try {
    await secondaryPool.query(createTablesQuery);
    log.info('Course-related tables verified in secondary database');
  } catch (error) {
    log.error('Failed to create course tables in secondary database:', error.message);
    throw error;
  }
}

/**
 * Sync course pricing data
 */
async function syncCoursePricing() {
  log.info('Syncing course pricing data...');
  
  try {
    const pricingData = await primaryPool.query(`
      SELECT id, course_id, course_name, price, currency, is_free, display_order, created_at, updated_at
      FROM course_pricing
      ORDER BY created_at ASC
    `);
    
    log.info(`Found ${pricingData.rows.length} course pricing records to sync`);
    
    let synced = 0;
    let errors = 0;
    
    for (const pricing of pricingData.rows) {
      try {
        await secondaryPool.query(`
          INSERT INTO course_pricing (
            id, course_id, course_name, price, currency, is_free, display_order, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (course_id) DO UPDATE SET
            course_name = EXCLUDED.course_name,
            price = EXCLUDED.price,
            currency = EXCLUDED.currency,
            is_free = EXCLUDED.is_free,
            display_order = EXCLUDED.display_order,
            updated_at = EXCLUDED.updated_at
        `, [
          pricing.id,
          pricing.course_id,
          pricing.course_name,
          pricing.price,
          pricing.currency,
          pricing.is_free,
          pricing.display_order,
          pricing.created_at,
          pricing.updated_at
        ]);
        
        synced++;
      } catch (error) {
        log.error(`Failed to sync pricing for course ${pricing.course_id}:`, error.message);
        errors++;
      }
    }
    
    log.success(`Course pricing sync completed: ${synced} synced, ${errors} errors`);
    
  } catch (error) {
    log.error('Failed to sync course pricing:', error.message);
    throw error;
  }
}

/**
 * Sync user purchases with proper user ID mapping
 */
async function syncUserPurchases() {
  log.info('Syncing user purchases...');
  
  try {
    // Get purchases from primary database with user_number mapping
    const purchasesData = await primaryPool.query(`
      SELECT 
        up.id,
        u.user_number,
        up.course_id,
        up.payment_id,
        up.amount,
        up.currency,
        up.status,
        up.payment_method,
        up.purchased_at,
        up.expires_at
      FROM user_purchases up
      JOIN users u ON up.user_id = u.id
      WHERE u.user_number IS NOT NULL
      ORDER BY up.purchased_at ASC
    `);
    
    log.info(`Found ${purchasesData.rows.length} user purchases to sync`);
    
    let synced = 0;
    let errors = 0;
    
    for (const purchase of purchasesData.rows) {
      try {
        await secondaryPool.query(`
          INSERT INTO user_purchases (
            id, user_id, course_id, payment_id, amount, currency, status, payment_method, purchased_at, expires_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            course_id = EXCLUDED.course_id,
            payment_id = EXCLUDED.payment_id,
            amount = EXCLUDED.amount,
            currency = EXCLUDED.currency,
            status = EXCLUDED.status,
            payment_method = EXCLUDED.payment_method,
            purchased_at = EXCLUDED.purchased_at,
            expires_at = EXCLUDED.expires_at
        `, [
          purchase.id,
          purchase.user_number, // Use user_number as user_id in secondary DB
          purchase.course_id,
          purchase.payment_id,
          purchase.amount,
          purchase.currency,
          purchase.status,
          purchase.payment_method,
          purchase.purchased_at,
          purchase.expires_at
        ]);
        
        synced++;
      } catch (error) {
        log.error(`Failed to sync purchase ${purchase.id}:`, error.message);
        errors++;
      }
    }
    
    log.success(`User purchases sync completed: ${synced} synced, ${errors} errors`);
    
  } catch (error) {
    log.error('Failed to sync user purchases:', error.message);
    throw error;
  }
}

/**
 * Sync course progress with proper user ID mapping
 */
async function syncCourseProgress() {
  log.info('Syncing course progress...');
  
  try {
    // Get progress from primary database with user_number mapping
    const progressData = await primaryPool.query(`
      SELECT 
        cp.id,
        u.user_number,
        cp.course_key,
        cp.course_version,
        cp.progress,
        cp.created_at,
        cp.updated_at
      FROM course_progress cp
      JOIN users u ON cp.user_id = u.id
      WHERE u.user_number IS NOT NULL
      ORDER BY cp.created_at ASC
    `);
    
    log.info(`Found ${progressData.rows.length} course progress records to sync`);
    
    let synced = 0;
    let errors = 0;
    
    for (const progress of progressData.rows) {
      try {
        await secondaryPool.query(`
          INSERT INTO course_progress (
            id, user_id, course_key, course_version, progress, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            course_key = EXCLUDED.course_key,
            course_version = EXCLUDED.course_version,
            progress = EXCLUDED.progress,
            created_at = EXCLUDED.created_at,
            updated_at = EXCLUDED.updated_at
        `, [
          progress.id,
          progress.user_number, // Use user_number as user_id in secondary DB
          progress.course_key,
          progress.course_version,
          progress.progress,
          progress.created_at,
          progress.updated_at
        ]);
        
        synced++;
      } catch (error) {
        log.error(`Failed to sync progress ${progress.id}:`, error.message);
        errors++;
      }
    }
    
    log.success(`Course progress sync completed: ${synced} synced, ${errors} errors`);
    
  } catch (error) {
    log.error('Failed to sync course progress:', error.message);
    throw error;
  }
}

/**
 * Sync course images
 */
async function syncCourseImages() {
  log.info('Syncing course images...');
  
  try {
    const imagesData = await primaryPool.query(`
      SELECT id, course_id, course_name, image_url, created_at, updated_at
      FROM course_images
      ORDER BY created_at ASC
    `);
    
    log.info(`Found ${imagesData.rows.length} course images to sync`);
    
    let synced = 0;
    let errors = 0;
    
    for (const image of imagesData.rows) {
      try {
        await secondaryPool.query(`
          INSERT INTO course_images (
            id, course_id, course_name, image_url, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (course_id) DO UPDATE SET
            course_name = EXCLUDED.course_name,
            image_url = EXCLUDED.image_url,
            updated_at = EXCLUDED.updated_at
        `, [
          image.id,
          image.course_id,
          image.course_name,
          image.image_url,
          image.created_at,
          image.updated_at
        ]);
        
        synced++;
      } catch (error) {
        log.error(`Failed to sync image for course ${image.course_id}:`, error.message);
        errors++;
      }
    }
    
    log.success(`Course images sync completed: ${synced} synced, ${errors} errors`);
    
  } catch (error) {
    log.error('Failed to sync course images:', error.message);
    throw error;
  }
}

/**
 * Sync course ID mappings
 */
async function syncCourseIdMappings() {
  log.info('Syncing course ID mappings...');
  
  try {
    const mappingsData = await primaryPool.query(`
      SELECT id, new_course_id, old_course_id, description, created_at, updated_at
      FROM course_id_mapping
      ORDER BY created_at ASC
    `);
    
    log.info(`Found ${mappingsData.rows.length} course ID mappings to sync`);
    
    let synced = 0;
    let errors = 0;
    
    for (const mapping of mappingsData.rows) {
      try {
        await secondaryPool.query(`
          INSERT INTO course_id_mapping (
            id, new_course_id, old_course_id, description, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (new_course_id) DO UPDATE SET
            old_course_id = EXCLUDED.old_course_id,
            description = EXCLUDED.description,
            updated_at = EXCLUDED.updated_at
        `, [
          mapping.id,
          mapping.new_course_id,
          mapping.old_course_id,
          mapping.description,
          mapping.created_at,
          mapping.updated_at
        ]);
        
        synced++;
      } catch (error) {
        log.error(`Failed to sync mapping ${mapping.new_course_id}:`, error.message);
        errors++;
      }
    }
    
    log.success(`Course ID mappings sync completed: ${synced} synced, ${errors} errors`);
    
  } catch (error) {
    log.error('Failed to sync course ID mappings:', error.message);
    throw error;
  }
}

/**
 * Main sync function
 */
async function syncAllCourseData() {
  log.info('Starting comprehensive course data synchronization...');
  
  try {
    await ensureTablesExist();
    await syncCoursePricing();
    await syncUserPurchases();
    await syncCourseProgress();
    await syncCourseImages();
    await syncCourseIdMappings();
    
    log.success('All course data synchronized successfully!');
    
  } catch (error) {
    log.error('Course data sync failed:', error.message);
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
    await syncAllCourseData();
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
