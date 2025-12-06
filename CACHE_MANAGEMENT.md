# Cache Management Guide

## Overview
Your website now has proper cache management to prevent users from seeing stale content.

## What Was Fixed

### 1. React Query Cache (5 minutes)
- Changed from `Infinity` to 5 minutes staleTime
- Enabled refetch on window focus
- Location: `client/src/lib/queryClient.ts`

### 2. Server Cache Headers
- HTML files: Never cached (`no-cache, no-store`)
- Hashed assets (JS/CSS): Cached for 1 year (immutable)
- Other assets: Cached for 1 hour with revalidation
- Location: `server/index.ts`

### 3. Build Versioning
- All built files now include content hashes in filenames
- Example: `main.[hash].js`
- Location: `vite.config.ts`

### 4. HTML Meta Tags
- Added cache-prevention meta tags
- Location: `client/index.html`

### 5. LocalStorage Versioning (India AI Course)
- Added `COURSE_VERSION` constant
- Automatically cleans up old cached versions
- Location: `client/src/pages/india-ai-course.tsx`

## How to Force Cache Invalidation

### For India AI Course Content Updates

When you update quizzes, videos, or course content:

1. Open `client/src/pages/india-ai-course.tsx`
2. Find the `COURSE_VERSION` constant (around line 155)
3. Increment the version:
   ```typescript
   const COURSE_VERSION = "v3"; // Change v2 -> v3 -> v4, etc.
   ```
4. Save the file
5. Deploy your changes

**All users will automatically get fresh content on their next visit!**

### For General Website Updates

1. Run `npm run build` to generate new hashed assets
2. Deploy the new build
3. Users will automatically get the latest version

## Testing Cache Behavior

### Development Mode
- Cache is disabled by default
- Hot Module Replacement (HMR) works instantly
- No need to clear cache during development

### Production Mode
1. Build: `npm run build`
2. Test locally: `npm start` (or your production command)
3. Check Network tab in DevTools:
   - HTML files should show `no-cache`
   - JS/CSS files should have hashes in filenames

## Common Issues

### Issue: Users still seeing old quiz questions
**Solution**: Increment `COURSE_VERSION` in `india-ai-course.tsx`

### Issue: New features not appearing
**Solution**: 
1. Rebuild the app: `npm run build`
2. Redeploy
3. Check that hashed filenames changed

### Issue: Styles not updating
**Solution**: 
1. Clear your own browser cache once
2. Rebuild and redeploy
3. Hashed filenames will force browser to fetch new files

## Best Practices

1. **Always increment COURSE_VERSION** when updating India AI course content
2. **Rebuild before deploying** to generate new hashed assets
3. **Test in incognito mode** to verify cache behavior
4. **Monitor user reports** - if users report stale content, check version numbers

## Version History

- **v1**: Initial version (before cache fixes)
- **v2**: Current version (with cache management)
- Update this when you increment COURSE_VERSION

## Need Help?

If users still report cache issues:
1. Verify COURSE_VERSION was incremented
2. Check that the new build was deployed
3. Verify server cache headers are working (check Network tab)
4. As a last resort, users can clear their browser cache manually
