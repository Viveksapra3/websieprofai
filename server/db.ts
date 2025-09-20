import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// For local Postgres on localhost:5432, no SSL by default
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

export const db = drizzle(pool, { schema });

export async function testDbConnection() {
  await pool.query("select 1");
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
