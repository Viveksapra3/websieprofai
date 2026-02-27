# User Synchronization Scripts

This directory contains scripts to synchronize users between the primary database (`DATABASE_URL`) and secondary database (`DATABASE_URL2`).

## Overview

The user sync system provides:
- **One-time migration** of all existing users
- **Incremental sync** of new/updated users
- **Continuous sync** service for real-time synchronization
- **Automatic sync** when new users register

## Files

- `user-sync.js` - Node.js version (standalone)
- `user-sync.ts` - TypeScript version (integrated with existing codebase)
- `user-sync-service.ts` - Service module for automatic sync integration

## Environment Variables

Ensure these are set in your `.env` file:

```env
DATABASE_URL=postgresql://...     # Primary database
DATABASE_URL2=postgresql://...    # Secondary database
```

## Usage

### 1. One-time Migration (All Users)

Migrate all existing users from primary to secondary database:

```bash
npm run user-sync:migrate-all
```

This will:
- Create the users table in the secondary database if it doesn't exist
- Copy all users from primary to secondary database
- Handle conflicts by updating existing records
- Process users in batches to avoid memory issues

### 2. Incremental Sync (New Users Only)

Sync only new/updated users since the last sync:

```bash
npm run user-sync:sync-new
```

This will:
- Check for a `.last-sync` timestamp file
- Sync only users created/updated since that timestamp
- Update the timestamp file after successful sync

### 3. Continuous Sync Service

Run a continuous sync service that checks for new users every 5 minutes:

```bash
npm run user-sync:continuous
```

This will:
- Run the incremental sync every 5 minutes
- Keep running until manually stopped (Ctrl+C)
- Useful for production environments

### 4. Automatic Sync (Integrated)

The `user-sync-service.ts` module is designed to be integrated into your registration routes for automatic sync when users are created. This happens automatically when users register.

## Database Schema

The sync scripts ensure the following users table structure exists in the secondary database:

```sql
CREATE TABLE users (
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
```

## Error Handling

- **Connection failures**: Scripts will retry and log errors
- **Unique constraint violations**: Handled by updating existing records
- **Partial failures**: Individual user sync failures won't stop the entire process
- **Graceful shutdown**: Scripts handle SIGINT/SIGTERM for clean shutdown

## Monitoring

All scripts provide detailed logging:
- `[INFO]` - General information and progress
- `[WARN]` - Non-critical issues (e.g., sync disabled)
- `[ERROR]` - Critical errors that need attention
- `[SUCCESS]` - Successful completion messages

## Production Deployment

For production environments:

1. **Initial Setup**: Run the one-time migration
   ```bash
   npm run user-sync:migrate-all
   ```

2. **Ongoing Sync**: Set up the continuous sync service
   ```bash
   npm run user-sync:continuous
   ```

3. **Process Management**: Use PM2 or similar to manage the continuous sync process
   ```bash
   pm2 start "npm run user-sync:continuous" --name "user-sync"
   ```

4. **Monitoring**: Monitor logs for sync failures and database connectivity issues

## Troubleshooting

### Common Issues

1. **"DATABASE_URL2 not configured"**
   - Ensure `DATABASE_URL2` is set in your `.env` file
   - Check that the connection string is valid

2. **"Failed to create users table"**
   - Verify the secondary database user has CREATE TABLE permissions
   - Check database connectivity

3. **"Unique constraint violation"**
   - This is normal and handled automatically
   - The script will update existing records instead of inserting

4. **"Connection timeout"**
   - Check network connectivity to the secondary database
   - Verify firewall settings allow the connection

### Manual Verification

To verify sync is working:

1. Check user counts in both databases:
   ```sql
   -- Primary database
   SELECT COUNT(*) FROM users;
   
   -- Secondary database  
   SELECT COUNT(*) FROM users;
   ```

2. Compare recent users:
   ```sql
   SELECT id, username, email, created_at 
   FROM users 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

## Security Considerations

- Database connection strings contain sensitive credentials
- Ensure `.env` file is not committed to version control
- Use read-only credentials for the secondary database if possible
- Monitor sync logs for any data exposure

## Performance

- Scripts process users in configurable batches (default: 100)
- Small delays between batches prevent database overload
- Connection pooling optimizes database performance
- Sync operations are designed to be non-blocking for the main application
