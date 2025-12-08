# Frontend Configuration for EC2 Backend

## Quick Start

Your backend is now running on EC2 with Docker at `http://51.20.109.241:5001`. Follow these steps to configure your frontend:

### 1. Update Environment Variables

Your current `.env` file already points to EC2:
```bash
VITE_API_BASE=http://51.20.109.241:5001
```

This is correct for development and testing. For production deployment, you may want to:

#### Option A: Keep using IP address
```bash
VITE_API_BASE=http://51.20.109.241:5001
VITE_API_URL=ws://51.20.109.241:5001
```

#### Option B: Use a domain name (recommended)
1. Point a domain to your EC2 IP (e.g., `api.yourdomain.com`)
2. Set up SSL/HTTPS
3. Update environment variables:
```bash
VITE_API_BASE=https://api.yourdomain.com
VITE_API_URL=wss://api.yourdomain.com
```

### 2. Test the Connection

Run the development server to test:
```bash
npm run dev
```

Visit `http://localhost:5173` and verify:
- ✅ API calls work
- ✅ Authentication works
- ✅ Course data loads
- ✅ Payment integration works

### 3. Build for Production

When ready to deploy:

```bash
# Interactive setup (recommended)
npm run setup:prod

# Or manually create .env.production.local with your values
# Then build:
npm run build:prod
```

The production build will be in `dist/public/`.

### 4. Deploy Frontend

Choose your deployment platform:

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard:
- `VITE_API_BASE=http://51.20.109.241:5001`
- `VITE_API_URL=ws://51.20.109.241:5001`
- All Firebase variables

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist/public
```

Set environment variables in Netlify dashboard.

#### AWS S3 + CloudFront
1. Build: `npm run build:prod`
2. Upload `dist/public/` to S3
3. Configure CloudFront distribution
4. Update DNS

## Current Configuration

Based on your `.env` file:

| Service | URL |
|---------|-----|
| Backend API | `http://51.20.109.241:5001` |
| Database | Neon PostgreSQL (cloud) |
| Avatar Service | `http://localhost:3002` (update if deployed) |
| Payment Gateway | CCAvenue (Test mode) |

## Important Notes

### CORS Configuration
Ensure your backend's `ALLOWED_ORIGINS` includes your frontend domain:

```bash
# On EC2 backend .env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Security Considerations

1. **HTTPS**: For production, use HTTPS for both frontend and backend
2. **Cookies**: Update cookie settings based on deployment:
   - Same domain: `COOKIE_SAMESITE=lax`
   - Cross-domain: `COOKIE_SAMESITE=none` (requires HTTPS)
3. **API Keys**: Never commit `.env` files with real credentials

### Environment Variables Reference

#### Required for Frontend
- `VITE_API_BASE` - Backend API URL
- `VITE_API_URL` - WebSocket URL
- `VITE_FIREBASE_*` - Firebase configuration

#### Optional
- `VITE_AVI_URL` - Avatar service URL
- `VITE_AUTH_REDIRECT_URL` - Auth callback URL

## Troubleshooting

### API Connection Failed
- ✅ Check EC2 security group allows port 5001
- ✅ Verify backend is running: `curl http://51.20.109.241:5001/api/health`
- ✅ Check CORS settings in backend

### CORS Errors
- ✅ Add frontend domain to backend `ALLOWED_ORIGINS`
- ✅ Verify `COOKIE_SAMESITE` and `COOKIE_SECURE` settings

### Mixed Content Errors
- ✅ Use HTTPS for both frontend and backend
- ✅ Or deploy frontend on same domain as backend

### Session/Cookie Issues
- ✅ Check cookie settings match your deployment type
- ✅ For cross-domain: use `COOKIE_SAMESITE=none` with HTTPS
- ✅ For same-domain: use `COOKIE_SAMESITE=lax`

## Next Steps

1. ✅ Test current setup with EC2 backend
2. ⬜ Set up domain name for backend (optional but recommended)
3. ⬜ Configure SSL/HTTPS
4. ⬜ Update backend CORS settings
5. ⬜ Build and deploy frontend
6. ⬜ Test production deployment
7. ⬜ Monitor and optimize

## Resources

- [Full Deployment Guide](./DEPLOYMENT.md)
- [Environment Variables Guide](./.env.example)
- [Production Setup Script](./scripts/setup-production.ps1)

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs: `docker-compose logs -f backend`
3. Verify environment variables are set correctly
4. Review CORS and cookie settings
