#!/usr/bin/env node

/**
 * Schema Examination Script
 * 
 * Examines the actual schema differences between DATABASE_URL and DATABASE_URL2
 * to understand the user_number to id mapping requirement.
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

async function examineSchemas() {
  let primaryPool, secondaryPool;
  
  try {
    // Initialize connections
    primaryPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      connectionTimeoutMillis: 10000,
    });

    secondaryPool = new Pool({
      connectionString: process.env.DATABASE_URL2,
      max: 3,
      connectionTimeoutMillis: 10000,
    });

    console.log('🔍 Examining database schemas...\n');

    // Get schema for primary database (DATABASE_URL)
    console.log('📊 PRIMARY DATABASE (DATABASE_URL) - Users table schema:');
    const primarySchema = await primaryPool.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    primarySchema.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

    // Get sample data from primary
    console.log('\n📋 Sample data from PRIMARY database:');
    const primarySample = await primaryPool.query('SELECT * FROM users LIMIT 3');
    console.log('Columns:', Object.keys(primarySample.rows[0] || {}));
    primarySample.rows.forEach((row, i) => {
      console.log(`  Row ${i + 1}:`, {
        id: row.id,
        user_number: row.user_number,
        username: row.username,
        email: row.email,
        role: row.role
      });
    });

    console.log('\n' + '='.repeat(60) + '\n');

    // Get schema for secondary database (DATABASE_URL2)
    console.log('📊 SECONDARY DATABASE (DATABASE_URL2) - Users table schema:');
    const secondarySchema = await secondaryPool.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    secondarySchema.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

    // Get sample data from secondary
    console.log('\n📋 Sample data from SECONDARY database:');
    const secondarySample = await secondaryPool.query('SELECT * FROM users LIMIT 3');
    console.log('Columns:', Object.keys(secondarySample.rows[0] || {}));
    secondarySample.rows.forEach((row, i) => {
      console.log(`  Row ${i + 1}:`, {
        id: row.id,
        user_number: row.user_number,
        username: row.username,
        email: row.email,
        role: row.role
      });
    });

    console.log('\n' + '='.repeat(60) + '\n');

    // Compare schemas
    console.log('🔄 SCHEMA COMPARISON:');
    const primaryCols = new Set(primarySchema.rows.map(r => r.column_name));
    const secondaryCols = new Set(secondarySchema.rows.map(r => r.column_name));
    
    console.log('\n📍 Columns in PRIMARY but not in SECONDARY:');
    primaryCols.forEach(col => {
      if (!secondaryCols.has(col)) {
        console.log(`  - ${col}`);
      }
    });
    
    console.log('\n📍 Columns in SECONDARY but not in PRIMARY:');
    secondaryCols.forEach(col => {
      if (!primaryCols.has(col)) {
        console.log(`  - ${col}`);
      }
    });

    console.log('\n📍 Common columns:');
    primaryCols.forEach(col => {
      if (secondaryCols.has(col)) {
        console.log(`  ✓ ${col}`);
      }
    });

    // Check user counts
    const primaryCount = await primaryPool.query('SELECT COUNT(*) as count FROM users');
    const secondaryCount = await secondaryPool.query('SELECT COUNT(*) as count FROM users');
    
    console.log('\n📊 USER COUNTS:');
    console.log(`  Primary database: ${primaryCount.rows[0].count} users`);
    console.log(`  Secondary database: ${secondaryCount.rows[0].count} users`);
    console.log(`  Difference: ${primaryCount.rows[0].count - secondaryCount.rows[0].count} users need syncing`);

  } catch (error) {
    console.error('❌ Error examining schemas:', error.message);
  } finally {
    if (primaryPool) await primaryPool.end();
    if (secondaryPool) await secondaryPool.end();
  }
}

examineSchemas();
