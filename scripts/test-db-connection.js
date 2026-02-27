#!/usr/bin/env node

import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

async function testConnections() {
  console.log('Testing database connections...\n');
  
  // Test primary database
  console.log('Testing PRIMARY database (DATABASE_URL)...');
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not configured');
  } else {
    try {
      const primaryPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 5000,
      });
      
      const result = await primaryPool.query('SELECT COUNT(*) as count FROM users');
      console.log(`✅ Primary database connected successfully`);
      console.log(`   Users in primary database: ${result.rows[0].count}`);
      await primaryPool.end();
    } catch (error) {
      console.log(`❌ Primary database connection failed: ${error.message}`);
    }
  }
  
  console.log('\nTesting SECONDARY database (DATABASE_URL2)...');
  if (!process.env.DATABASE_URL2) {
    console.log('❌ DATABASE_URL2 not configured');
  } else {
    try {
      const secondaryPool = new Pool({
        connectionString: process.env.DATABASE_URL2,
        connectionTimeoutMillis: 5000,
      });
      
      // First test basic connection
      await secondaryPool.query('SELECT 1');
      console.log(`✅ Secondary database connected successfully`);
      
      // Check if users table exists
      try {
        const result = await secondaryPool.query('SELECT COUNT(*) as count FROM users');
        console.log(`   Users in secondary database: ${result.rows[0].count}`);
      } catch (tableError) {
        console.log(`   ⚠️  Users table doesn't exist in secondary database`);
        console.log(`   This is normal for first-time setup - the sync script will create it`);
      }
      
      await secondaryPool.end();
    } catch (error) {
      console.log(`❌ Secondary database connection failed: ${error.message}`);
      console.log(`   Connection string format: ${process.env.DATABASE_URL2.replace(/:[^:@]*@/, ':***@')}`);
    }
  }
}

testConnections().catch(console.error);
