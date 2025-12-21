import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Optimized connection pool for faster database connectivity
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  // Connection pool optimization
  min: 2,                    // Minimum connections to keep alive
  max: 20,                   // Maximum connections in pool
  idleTimeoutMillis: 30000,  // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Timeout for new connections
  // Performance optimizations
  keepAlive: true,           // Keep TCP connections alive
  keepAliveInitialDelayMillis: 10000,
  // Query optimization
  statement_timeout: 10000,  // 10 second query timeout
  query_timeout: 10000,      // 10 second query timeout
});

export const db = drizzle(pool, { schema });

// Connection monitoring for performance insights
pool.on('connect', (client) => {
  console.log(`[DB] New client connected (total: ${pool.totalCount}, idle: ${pool.idleCount})`);
});

pool.on('error', (err, client) => {
  console.error('[DB] Unexpected error on idle client', err);
});

export async function testDbConnection() {
  const start = Date.now();
  try {
    await pool.query("SELECT 1");
    const duration = Date.now() - start;
    console.log(`[DB] Connection test successful in ${duration}ms`);
  } catch (error) {
    console.error('[DB] Connection test failed:', error);
    throw error;
  }
}

// Get connection pool stats for monitoring
export function getPoolStats() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
}

export async function ensureSchema() {
  // Create extension and table if not exists to avoid "users does not exist" during local dev
  const ddl = `
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
      username text NOT NULL UNIQUE,
      email text NOT NULL UNIQUE,
      password text NOT NULL,
      role text NOT NULL DEFAULT 'student',
      student_type text,
      college_name text,
      degree text,
      school_class text,
      school_affiliation text,
      terms_accepted boolean NOT NULL DEFAULT false,
      created_at timestamp DEFAULT now()
    );
    -- Ensure new columns exist for existing tables
    ALTER TABLE users ADD COLUMN IF NOT EXISTS student_type text;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS college_name text;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS degree text;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS school_class text;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS school_affiliation text;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted boolean NOT NULL DEFAULT false;

    -- Course pricing table
    CREATE TABLE IF NOT EXISTS course_pricing (
      id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
      course_id text NOT NULL UNIQUE,
      course_name text,
      price decimal(10,2) NOT NULL DEFAULT 0.00,
      currency text NOT NULL DEFAULT 'INR',
      is_free boolean NOT NULL DEFAULT false,
      display_order integer,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
    
    -- Add course_name column if it doesn't exist
    ALTER TABLE course_pricing ADD COLUMN IF NOT EXISTS course_name text;

    -- User purchases table
    CREATE TABLE IF NOT EXISTS user_purchases (
      id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id text NOT NULL REFERENCES users(id),
      course_id text NOT NULL,
      payment_id text,
      amount decimal(10,2) NOT NULL,
      currency text NOT NULL DEFAULT 'INR',
      status text NOT NULL DEFAULT 'pending',
      payment_method text DEFAULT 'ccavenue',
      purchased_at timestamp DEFAULT now(),
      expires_at timestamp
    );

    -- Payment transactions table
    CREATE TABLE IF NOT EXISTS payment_transactions (
      id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id text NOT NULL REFERENCES users(id),
      course_id text NOT NULL,
      order_id text NOT NULL UNIQUE,
      ccavenue_order_id text,
      amount decimal(10,2) NOT NULL,
      currency text NOT NULL DEFAULT 'INR',
      status text NOT NULL DEFAULT 'initiated',
      payment_response text,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );

    -- Course images table
    CREATE TABLE IF NOT EXISTS course_images (
      id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
      course_id text NOT NULL UNIQUE,
      course_name text,
      image_url text NOT NULL,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
    
    -- Add course_name column if it doesn't exist
    ALTER TABLE course_images ADD COLUMN IF NOT EXISTS course_name text;

    -- Course ID mapping table
    CREATE TABLE IF NOT EXISTS course_id_mapping (
      id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
      new_course_id text NOT NULL UNIQUE,
      old_course_id text NOT NULL,
      description text,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );

    -- API Access Requests table
    CREATE TABLE IF NOT EXISTS api_access_requests (
      id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
      first_name text NOT NULL,
      last_name text NOT NULL,
      email text NOT NULL,
      phone text NOT NULL,
      company text NOT NULL,
      job_title text NOT NULL,
      use_case text,
      status text NOT NULL DEFAULT 'pending',
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_purchases_course_id ON user_purchases(course_id);
    CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
    CREATE INDEX IF NOT EXISTS idx_course_pricing_course_id ON course_pricing(course_id);
    CREATE INDEX IF NOT EXISTS idx_course_pricing_display_order ON course_pricing(display_order);
    CREATE INDEX IF NOT EXISTS idx_course_images_course_id ON course_images(course_id);
    CREATE INDEX IF NOT EXISTS idx_course_id_mapping_new_id ON course_id_mapping(new_course_id);
    CREATE INDEX IF NOT EXISTS idx_course_id_mapping_old_id ON course_id_mapping(old_course_id);
    CREATE INDEX IF NOT EXISTS idx_api_access_requests_email ON api_access_requests(email);
    CREATE INDEX IF NOT EXISTS idx_api_access_requests_status ON api_access_requests(status);
    CREATE INDEX IF NOT EXISTS idx_api_access_requests_created_at ON api_access_requests(created_at);
  `;
  await pool.query(ddl);
}
