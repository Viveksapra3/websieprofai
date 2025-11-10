# ProfAICoach Development Setup

## Database Connection Error Fix

The error you're encountering is due to missing database configuration. Follow these steps to resolve it:

### 1. Create Environment File
Copy the `.env.example` file to `.env`:
```bash
copy .env.example .env
```

### 2. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL Installation
1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. Create a database named `profaicoach`
3. Update the `DATABASE_URL` in your `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/profaicoach
   ```

#### Option B: Use Docker (Recommended)
1. Install Docker Desktop
2. Run PostgreSQL container:
   ```bash
   docker run --name profaicoach-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=profaicoach -p 5432:5432 -d postgres:15
   ```
3. Update your `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/profaicoach
   ```

#### Option C: Use Online Database (Neon/Supabase)
1. Create a free PostgreSQL database at https://neon.tech or https://supabase.com
2. Copy the connection string to your `.env` file

### 3. Update Port (if needed)
If port 5000 is still in use, change it in your `.env` file:
```
PORT=3001
```

### 4. Generate Session Secret
Replace the default session secret with a secure one:
```
SESSION_SECRET=your-super-secure-random-string-here
```

### 5. Start Development Server
```bash
npm run dev
```

## Common Issues

### Port Already in Use
- Change the `PORT` in `.env` to an available port (e.g., 3001, 8000)
- Or kill the process using port 5000

### Database Connection Timeout
- Ensure PostgreSQL is running
- Verify the `DATABASE_URL` is correct
- Check firewall settings

### Session Store Errors
- Ensure `SESSION_SECRET` is set
- Database must be accessible for session storage
