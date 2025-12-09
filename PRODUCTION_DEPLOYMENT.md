# Production Deployment Guide

## Error: Cannot find package 'compression'

If you see this error on your production server:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'compression' imported from /root/apps/profai_0.2/websieprofai/dist/index.js
```

This means the dependencies are not installed on the production server.

## Solution: Install Dependencies on Production Server

### Step 1: Navigate to Your App Directory
```bash
cd /root/apps/profai_0.2/websieprofai
```

### Step 2: Install Production Dependencies
```bash
npm install --production
```

This will install all the required dependencies from `package.json` without installing devDependencies.

### Step 3: Start the Application
```bash
npm start
```

## Complete Deployment Checklist

### 1. **Build Locally** (on your development machine)
```bash
npm run build
```

This creates:
- `dist/public/` - Client build (React app)
- `dist/index.js` - Server build (Express app)

### 2. **Upload Files to Server**

Upload these files/folders to your production server:
- `dist/` - The entire dist folder
- `package.json` - Required for npm install
- `package-lock.json` - Ensures consistent dependency versions
- `.env` - Your environment variables (create on server if not exists)
- `node_modules/` - OR run `npm install --production` on server

### 3. **Set Up Environment Variables**

Create/update `.env` file on the server with:
```env
# Database
DATABASE_URL=your_postgres_connection_string

# Session
SESSION_SECRET=your_session_secret

# Server
PORT=5000
NODE_ENV=production

# External API
VITE_API_BASE=http://51.20.109.241:5001

# CCAvenue Payment (if using)
CCAVENUE_MERCHANT_ID=your_merchant_id
CCAVENUE_ACCESS_CODE=your_access_code
CCAVENUE_WORKING_KEY=your_working_key
CCAVENUE_KEY_BASE64=your_key_base64
CCAVENUE_IV_BASE64=your_iv_base64
CCAVENUE_REDIRECT_URL=your_redirect_url
CCAVENUE_CANCEL_URL=your_cancel_url
```

### 4. **Install Dependencies on Server**
```bash
cd /root/apps/profai_0.2/websieprofai
npm install --production
```

### 5. **Start the Application**
```bash
npm start
```

Or use PM2 for process management:
```bash
pm2 start npm --name "profai" -- start
pm2 save
pm2 startup
```

## Alternative: Using PM2

### Install PM2 globally
```bash
npm install -g pm2
```

### Start with PM2
```bash
pm2 start dist/index.js --name profai
pm2 save
pm2 startup
```

### PM2 Commands
```bash
pm2 list              # List all processes
pm2 logs profai       # View logs
pm2 restart profai    # Restart app
pm2 stop profai       # Stop app
pm2 delete profai     # Remove from PM2
```

## Quick Deployment Script

Create a file `deploy.sh` on your server:

```bash
#!/bin/bash

# Navigate to app directory
cd /root/apps/profai_0.2/websieprofai

# Pull latest code (if using git)
# git pull origin main

# Install dependencies
npm install --production

# Restart with PM2
pm2 restart profai || pm2 start npm --name "profai" -- start
pm2 save

echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
./deploy.sh
```

## Troubleshooting

### Issue: Module not found errors
**Solution:** Run `npm install --production` on the server

### Issue: Port already in use
**Solution:** 
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

### Issue: Database connection fails
**Solution:** Check your `DATABASE_URL` in `.env` file

### Issue: Permission denied
**Solution:** 
```bash
# Fix permissions
chmod -R 755 /root/apps/profai_0.2/websieprofai
```

## Files Required on Production Server

```
/root/apps/profai_0.2/websieprofai/
├── dist/
│   ├── public/          # Client build
│   └── index.js         # Server build
├── node_modules/        # Dependencies (install with npm install)
├── package.json         # Required for npm install
├── package-lock.json    # Lock file
└── .env                 # Environment variables
```

## Environment-Specific Notes

- **Development:** Uses `tsx watch` for hot reload
- **Production:** Uses `node dist/index.js` for optimized performance
- Dependencies are marked as `--packages=external` in the build, so they must be installed on the server
