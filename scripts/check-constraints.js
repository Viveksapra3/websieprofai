#!/usr/bin/env node

/**
 * Check Database Constraints Script
 * 
 * Examines the constraints in the secondary database to understand
 * what's causing the sync failures.
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

async function checkConstraints() {
  let secondaryPool;
  
  try {
    secondaryPool = new Pool({
      connectionString: process.env.DATABASE_URL2,
      max: 3,
      connectionTimeoutMillis: 10000,
    });

    console.log('🔍 Checking constraints in SECONDARY database...\n');

    // Get all constraints
    const constraints = await secondaryPool.query(`
      SELECT 
        conname as constraint_name,
        contype as constraint_type,
        pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint 
      WHERE conrelid = 'users'::regclass
      ORDER BY conname;
    `);
    
    console.log('📋 Constraints on users table:');
    constraints.rows.forEach(constraint => {
      const type = {
        'c': 'CHECK',
        'f': 'FOREIGN KEY',
        'p': 'PRIMARY KEY',
        'u': 'UNIQUE',
        'x': 'EXCLUDE'
      }[constraint.constraint_type] || constraint.constraint_type;
      
      console.log(`  ${constraint.constraint_name} (${type}):`);
      console.log(`    ${constraint.constraint_definition}`);
      console.log('');
    });

    // Check specifically for student_type check constraint
    const checkConstraints = await secondaryPool.query(`
      SELECT 
        conname,
        pg_get_constraintdef(oid) as definition
      FROM pg_constraint 
      WHERE conrelid = 'users'::regclass 
      AND contype = 'c'
      AND conname LIKE '%student_type%';
    `);
    
    if (checkConstraints.rows.length > 0) {
      console.log('🚨 Student Type Check Constraint Details:');
      checkConstraints.rows.forEach(constraint => {
        console.log(`  ${constraint.conname}: ${constraint.definition}`);
      });
    }

    // Check what student_type values exist in secondary database
    const studentTypes = await secondaryPool.query(`
      SELECT DISTINCT student_type, COUNT(*) as count
      FROM users 
      WHERE student_type IS NOT NULL
      GROUP BY student_type
      ORDER BY count DESC;
    `);
    
    console.log('\n📊 Existing student_type values in secondary database:');
    studentTypes.rows.forEach(row => {
      console.log(`  "${row.student_type}": ${row.count} users`);
    });

    // Check what student_type values exist in primary database
    const primaryPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      connectionTimeoutMillis: 10000,
    });

    const primaryStudentTypes = await primaryPool.query(`
      SELECT DISTINCT student_type, COUNT(*) as count
      FROM users 
      WHERE student_type IS NOT NULL
      GROUP BY student_type
      ORDER BY count DESC;
    `);
    
    console.log('\n📊 student_type values in PRIMARY database:');
    primaryStudentTypes.rows.forEach(row => {
      console.log(`  "${row.student_type}": ${row.count} users`);
    });

    await primaryPool.end();

  } catch (error) {
    console.error('❌ Error checking constraints:', error.message);
  } finally {
    if (secondaryPool) await secondaryPool.end();
  }
}

checkConstraints();
