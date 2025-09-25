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
  `;
  await pool.query(ddl);
}
