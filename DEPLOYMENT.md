# ProfAICoach Deployment Guide

## Overview
This guide covers deploying the ProfAICoach application with a Dockerized backend on EC2 and a frontend that can be deployed to various hosting platforms.

## Architecture
- **Backend**: Dockerized Node.js/Express server running on EC2 with parallel data processing
- **Database**: PostgreSQL (Neon or self-hosted)
- **Frontend**: React/Vite application (can be deployed to Vercel, Netlify, AWS S3, etc.)

---

## Backend Deployment (EC2 with Docker)

### Prerequisites
- EC2 instance running (Ubuntu recommended)
- Docker and Docker Compose installed on EC2
- Security groups configured to allow traffic on required ports

### EC2 Security Group Configuration
Ensure your EC2 security group allows inbound traffic on:
- **Port 5001**: Backend API server
- **Port 3002**: Avatar/3D visualization service (if applicable)
- **Port 22**: SSH access
- **Port 80/443**: If using reverse proxy (recommended)

### Backend Environment Variables
On your EC2 instance, create a `.env` file in your backend directory with:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:5432/database

# Server
PORT=5001
NODE_ENV=production

# Session & Security
SESSION_SECRET=your-strong-random-secret
SESSION_NAME=sid
COOKIE_SECURE=true
COOKIE_SAMESITE=none

# CORS - Add your frontend domain
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Payment Gateway
CCAVENUE_MERCHANT_ID=your-merchant-id
CCAVENUE_ACCESS_CODE=your-access-code
CCAVENUE_WORKING_KEY=your-working-key
CCAVENUE_ENV=production
CCAVENUE_KEY_BASE64=your-base64-key
CCAVENUE_IV_BASE64=your-base64-iv
CCAVENUE_URL=https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction
```

### Docker Deployment
Your backend should already be containerized. Ensure your `docker-compose.yml` includes:

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    restart: unless-stopped
```

Deploy with:
```bash
docker-compose up -d --build
```

---

## Frontend Deployment

### Step 1: Update Environment Variables

Create a `.env.production.local` file in the `websieprofai` directory:

```bash
# Backend API (Replace with your EC2 IP or domain)
VITE_API_BASE=http://YOUR_EC2_PUBLIC_IP:5001
VITE_API_URL=ws://YOUR_EC2_PUBLIC_IP:5001
VITE_AVI_URL=http://YOUR_EC2_PUBLIC_IP:3002

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Auth Redirect
VITE_AUTH_REDIRECT_URL=https://yourdomain.com/auth/callback
```

### Step 2: Build the Frontend

```bash
cd websieprofai
npm install
npm run build
```

This creates a production build in `dist/public/`.

### Step 3: Deploy Frontend

#### Option A: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Set environment variables in Vercel dashboard

#### Option B: Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod --dir=dist/public`
3. Set environment variables in Netlify dashboard

#### Option C: AWS S3 + CloudFront
1. Upload `dist/public/` to S3 bucket
2. Configure bucket for static website hosting
3. Create CloudFront distribution
4. Set environment variables before build

#### Option D: Same EC2 Instance (with Nginx)
1. Copy `dist/public/` to EC2: `/var/www/profaicoach`
2. Configure Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/profaicoach;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Enable and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/profaicoach /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## HTTPS/SSL Configuration (Recommended)

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (certbot sets this up automatically)
sudo certbot renew --dry-run
```

After SSL setup, update your environment variables:
- Change `http://` to `https://`
- Set `COOKIE_SECURE=true`
- Update `ALLOWED_ORIGINS` with HTTPS URLs

---

## Environment-Specific Configuration

### Development
```bash
VITE_API_BASE=http://localhost:5000
VITE_API_URL=ws://localhost:5000
```

### Staging/Testing
```bash
VITE_API_BASE=http://YOUR_EC2_IP:5001
VITE_API_URL=ws://YOUR_EC2_IP:5001
```

### Production
```bash
VITE_API_BASE=https://api.yourdomain.com
VITE_API_URL=wss://api.yourdomain.com
```

---

## CORS Configuration

Ensure your backend's `ALLOWED_ORIGINS` includes your frontend domain:

```bash
# Backend .env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com
```

---

## Monitoring & Logs

### Backend Logs (Docker)
```bash
# View logs
docker-compose logs -f backend

# View last 100 lines
docker-compose logs --tail=100 backend
```

### Frontend Logs
- Check browser console for client-side errors
- Use hosting platform's logging (Vercel, Netlify, etc.)

---

## Troubleshooting

### CORS Errors
- Verify `ALLOWED_ORIGINS` in backend `.env`
- Check that frontend is using correct `VITE_API_BASE`
- Ensure `COOKIE_SAMESITE` and `COOKIE_SECURE` are properly configured

### Connection Refused
- Verify EC2 security groups allow traffic on port 5001
- Check if Docker container is running: `docker ps`
- Test backend directly: `curl http://YOUR_EC2_IP:5001/api/health`

### Mixed Content Errors (HTTP/HTTPS)
- Use HTTPS for both frontend and backend
- Or use relative URLs if both are on same domain

### Session/Cookie Issues
- Set `COOKIE_SECURE=false` for HTTP (development only)
- Set `COOKIE_SECURE=true` for HTTPS (production)
- Use `COOKIE_SAMESITE=none` for cross-domain cookies (requires HTTPS)
- Use `COOKIE_SAMESITE=lax` for same-domain deployment

---

## Performance Optimization

### Frontend
1. Enable gzip/brotli compression in Nginx or hosting platform
2. Use CDN for static assets
3. Implement lazy loading for routes
4. Optimize images and assets

### Backend
1. Enable Docker resource limits
2. Use PM2 or similar for process management
3. Implement Redis for session storage (optional)
4. Set up load balancer for horizontal scaling

---

## Security Checklist

- [ ] Use HTTPS for all production traffic
- [ ] Set strong `SESSION_SECRET`
- [ ] Configure proper CORS origins
- [ ] Enable security headers (Helmet.js)
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Regular security audits
- [ ] Database backups configured
- [ ] EC2 security groups properly configured

---

## Rollback Procedure

### Backend
```bash
# Rollback to previous Docker image
docker-compose down
docker-compose up -d --build <previous-tag>
```

### Frontend
- Use hosting platform's rollback feature (Vercel, Netlify)
- Or redeploy previous build from Git

---

## Support & Resources

- **Backend Repository**: Link to your backend repo
- **Frontend Repository**: Link to your frontend repo
- **Documentation**: Additional docs location
- **Issue Tracker**: GitHub issues or similar

---

## Quick Reference

### Current Configuration (from .env)
- **Backend URL**: `http://51.20.109.241:5001`
- **Database**: Neon PostgreSQL
- **Payment Gateway**: CCAvenue (Test mode)

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Deployment Commands
```bash
# Backend (EC2)
ssh user@51.20.109.241
cd /path/to/backend
docker-compose up -d --build

# Frontend (example: Vercel)
cd websieprofai
npm run build
vercel --prod
```
