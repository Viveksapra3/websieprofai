/**
 * User Sync Service
 * 
 * Service module for syncing users between primary and secondary databases.
 * Can be used for automatic sync when users are created/updated.
 */

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import type { User } from '../shared/schema.js';

// Singleton pools for secondary database
let secondaryPool: Pool | null = null;
let secondaryDb: ReturnType<typeof drizzle> | null = null;

const log = {
  info: (msg: string, ...args: any[]) => console.log(`[USER-SYNC] ${new Date().toISOString()} ${msg}`, ...args),
  warn: (msg: string, ...args: any[]) => console.warn(`[USER-SYNC] ${new Date().toISOString()} ${msg}`, ...args),
  error: (msg: string, ...args: any[]) => console.error(`[USER-SYNC] ${new Date().toISOString()} ${msg}`, ...args),
};

/**
 * Initialize secondary database connection
 */
async function initializeSecondaryDb() {
  if (secondaryDb && secondaryPool) {
    return { db: secondaryDb, pool: secondaryPool };
  }

  if (!process.env.DATABASE_URL2) {
    log.warn('DATABASE_URL2 not configured, user sync disabled');
    return null;
  }

  try {
    secondaryPool = new Pool({
      connectionString: process.env.DATABASE_URL2,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    secondaryDb = drizzle(secondaryPool);

    // Test connection
    await secondaryPool.query('SELECT 1');
    
    // Ensure users table exists
    await ensureUsersTableExists();
    
    log.info('Secondary database connection initialized');
    return { db: secondaryDb, pool: secondaryPool };
    
  } catch (error: any) {
    log.error('Failed to initialize secondary database:', error.message);
    return null;
  }
}

/**
 * Ensure users table exists in secondary database
 */
async function ensureUsersTableExists() {
  if (!secondaryPool) return;

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
  } catch (error: any) {
    log.error('Failed to create users table in secondary database:', error.message);
  }
}

/**
 * Map student_type value from primary to secondary database format
 */
function mapStudentType(primaryValue: string | null): string | null {
  if (!primaryValue) return null;
  
  const mapping: Record<string, string> = {
    'college': 'undergrad',
    'school': 'high_school'
  };
  
  return mapping[primaryValue] || null;
}

/**
 * Sync a single user to secondary database with proper ID mapping
 */
export async function syncUserToSecondary(user: User): Promise<boolean> {
  const connection = await initializeSecondaryDb();
  if (!connection) {
    return false; // Sync disabled or failed to connect
  }

  try {
    // Get user_number from primary database for this user
    const userNumberQuery = `
      SELECT user_number FROM users WHERE id = $1
    `;
    
    let userNumber: number | null = null;
    try {
      const result = await connection.pool.query(userNumberQuery, [user.id]);
      userNumber = result.rows[0]?.user_number || null;
    } catch (error: any) {
      // If we can't get user_number, we'll let the secondary DB auto-generate the ID
      log.warn(`Could not get user_number for user ${user.username}, using auto-generated ID`);
    }

    // Map student_type to match secondary database constraints
    const mappedStudentType = mapStudentType(user.studentType);

    // Use raw SQL for better control over the sync process
    const syncQuery = `
      INSERT INTO users (
        ${userNumber ? 'id,' : ''} username, email, password, role, student_type, college_name,
        degree, school_class, school_affiliation, terms_accepted, created_at,
        institution, subject, experience, user_number, email_verified, is_active
      ) VALUES (
        ${userNumber ? '$1,' : ''} $${userNumber ? '2' : '1'}, $${userNumber ? '3' : '2'}, $${userNumber ? '4' : '3'}, $${userNumber ? '5' : '4'}, $${userNumber ? '6' : '5'}, $${userNumber ? '7' : '6'},
        $${userNumber ? '8' : '7'}, $${userNumber ? '9' : '8'}, $${userNumber ? '10' : '9'}, $${userNumber ? '11' : '10'}, $${userNumber ? '12' : '11'},
        $${userNumber ? '13' : '12'}, $${userNumber ? '14' : '13'}, $${userNumber ? '15' : '14'}, $${userNumber ? '16' : '15'}, $${userNumber ? '17' : '16'}, $${userNumber ? '18' : '17'}
      )
      ON CONFLICT (${userNumber ? 'id' : 'email'}) DO UPDATE SET
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
        institution = EXCLUDED.institution,
        subject = EXCLUDED.subject,
        experience = EXCLUDED.experience,
        user_number = EXCLUDED.user_number,
        updated_at = NOW()
      RETURNING id, user_number, username
    `;

    const values = userNumber 
      ? [
          userNumber, // id (use user_number as id)
          user.username,
          user.email,
          user.password,
          user.role,
          mappedStudentType,
          user.collegeName,
          user.degree,
          user.schoolClass,
          user.schoolAffiliation,
          user.termsAccepted,
          user.createdAt,
          null, // institution
          null, // subject
          null, // experience
          userNumber, // user_number
          false, // email_verified
          true   // is_active
        ]
      : [
          user.username,
          user.email,
          user.password,
          user.role,
          mappedStudentType,
          user.collegeName,
          user.degree,
          user.schoolClass,
          user.schoolAffiliation,
          user.termsAccepted,
          user.createdAt,
          null, // institution
          null, // subject
          null, // experience
          userNumber, // user_number (will be null)
          false, // email_verified
          true   // is_active
        ];

    const result = await connection.pool.query(syncQuery, values);
    
    if (result.rows.length > 0) {
      const syncedUser = result.rows[0];
      log.info(`User ${user.username} synced successfully (id: ${syncedUser.id}, user_number: ${syncedUser.user_number})`);
    }
    
    return true;
    
  } catch (error: any) {
    // Handle constraint violations gracefully
    if (error.code === '23505') {
      log.warn(`User ${user.username} has unique constraint conflict, attempting to resolve...`);
      
      try {
        // Try to update existing user by email
        const updateQuery = `
          UPDATE users SET
            username = $2,
            password = $3,
            role = $4,
            student_type = $5,
            college_name = $6,
            degree = $7,
            school_class = $8,
            school_affiliation = $9,
            terms_accepted = $10,
            updated_at = NOW()
          WHERE email = $1
          RETURNING id, user_number, username
        `;
        
        const result = await connection.pool.query(updateQuery, [
          user.email,
          user.username,
          user.password,
          user.role,
          mapStudentType(user.studentType),
          user.collegeName,
          user.degree,
          user.schoolClass,
          user.schoolAffiliation,
          user.termsAccepted
        ]);
        
        if (result.rows.length > 0) {
          log.info(`Resolved conflict for user ${user.username} -> id: ${result.rows[0].id}`);
          return true;
        }
      } catch (resolveError: any) {
        log.error(`Failed to resolve conflict for user ${user.username}:`, resolveError.message);
      }
    }
    
    log.error(`Failed to sync user ${user.username}:`, error.message);
    return false;
  }
}

/**
 * Sync user by ID from primary database
 */
export async function syncUserById(primaryDb: ReturnType<typeof drizzle>, userId: string): Promise<boolean> {
  try {
    const [user] = await primaryDb
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      log.warn(`User with ID ${userId} not found in primary database`);
      return false;
    }

    return await syncUserToSecondary(user);
    
  } catch (error: any) {
    log.error(`Failed to sync user by ID ${userId}:`, error.message);
    return false;
  }
}

/**
 * Async wrapper for user sync (fire and forget)
 */
export function syncUserAsync(user: User): void {
  syncUserToSecondary(user).catch((error) => {
    log.error('Async user sync failed:', error.message);
  });
}

/**
 * Cleanup secondary database connection
 */
export async function cleanupSecondaryDb(): Promise<void> {
  if (secondaryPool) {
    try {
      await secondaryPool.end();
      secondaryPool = null;
      secondaryDb = null;
      log.info('Secondary database connection closed');
    } catch (error: any) {
      log.error('Failed to close secondary database connection:', error.message);
    }
  }
}

/**
 * Health check for secondary database
 */
export async function checkSecondaryDbHealth(): Promise<boolean> {
  const connection = await initializeSecondaryDb();
  if (!connection) {
    return false;
  }

  try {
    await connection.pool.query('SELECT 1');
    return true;
  } catch (error: any) {
    log.error('Secondary database health check failed:', error.message);
    return false;
  }
}
