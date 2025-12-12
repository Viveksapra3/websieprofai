# Course Names Sync Summary

## ✅ Changes Completed

### 1. Database Schema Updated
- Added `course_name` column to `course_images` table
- Column is nullable (optional) to support existing entries
- Auto-migration added to `ensureSchema()` function

### 2. Scripts Created

#### `sync-course-names.ts`
- Fetches courses from external API
- Uses course ID mapping table to translate sequential IDs to UUIDs
- Updates `course_name` field for all matching courses
- **Command:** `npm run sync-course-names`

#### `view-course-images.ts`
- Displays all course images with their names
- **Command:** `npm run view-course-images`

## Sync Results

**Last Run:** December 10, 2025

| Status | Count | Details |
|--------|-------|---------|
| ✅ Updated | 10 | Successfully synced course names |
| ❌ Not Found | 8 | Old course IDs not in current API |
| **Total** | **18** | Course images in database |

### Successfully Synced Courses:

1. **ID: 1** → Generative AI Handson
2. **ID: 3** → Hindi to English Speaking course
3. **ID: 7** → Social Change and Development in India
4. **ID: 8** → Bhaswati sanskrit
5. **ID: 11** → Class 12th NCERT Psychology book
6. **ID: 13** → Class 12th NCERT - Political Science - Politics in India Since Independence
7. **ID: 14** → Virtual Reality
8. **ID: 17** → Teacher Training Certificate Programme for AI Awareness
9. **ID: 18** → Class 12th - NCERT - Chemistry Part - 1
10. **ID: 1ec613a4-93df-4e8f-b01b-fbaf19679a0a** → Indian Societies

### Not Found (Old Course IDs):

These course IDs exist in your `course_images` table but don't match any courses in the current API:

- s-101
- s-201
- s-310
- s-320
- course_1
- course_2
- course_3
- course_4

**Recommendation:** You may want to remove these old entries or update them to use the new course IDs.

## Database Schema

```sql
-- course_images table structure
CREATE TABLE course_images (
  id text PRIMARY KEY,
  course_id text NOT NULL UNIQUE,
  course_name text,              -- ← NEW COLUMN
  image_url text NOT NULL,
  created_at timestamp,
  updated_at timestamp
);
```

## How It Works

1. **Fetch Courses:** Script fetches all courses from external API
2. **Load Mappings:** Loads course ID mappings (sequential → UUID)
3. **Match & Update:** For each course image:
   - Checks if course_id is a sequential ID (1, 2, 3, etc.)
   - Uses mapping table to find the actual UUID
   - Finds the course in API response
   - Updates the `course_name` field

## Usage

### Sync Course Names
```bash
npm run sync-course-names
```

### View Course Images
```bash
npm run view-course-images
```

### Re-sync After Adding New Courses
If you add new courses to the API or update course names:
```bash
npm run sync-course-names
```

## Benefits

- **Better UX:** Course names are now stored locally for faster access
- **Offline Support:** Names available even if external API is slow/down
- **Admin Dashboard:** Can display course names without extra API calls
- **Search/Filter:** Easier to implement search by course name

## Next Steps

### Option 1: Clean Up Old Entries
Remove course images for old course IDs that no longer exist:
```sql
DELETE FROM course_images 
WHERE course_id IN ('s-101', 's-201', 's-310', 's-320', 'course_1', 'course_2', 'course_3', 'course_4');
```

### Option 2: Update Old Entries
Update old course IDs to use new sequential IDs (if you know the mapping):
```sql
-- Example: Update s-101 to use new ID
UPDATE course_images 
SET course_id = '1' 
WHERE course_id = 's-101';
```

### Option 3: Keep As-Is
Leave them in the database for historical reference. They won't cause issues.

## Automatic Sync

To automatically sync course names when the server starts, you could add this to your server initialization:

```typescript
// In server/index.ts
import { syncCourseNames } from './scripts/sync-course-names';

// After database connection
if (process.env.NODE_ENV === 'production') {
  syncCourseNames().catch(console.error);
}
```

## Troubleshooting

### Issue: Course names not updating
**Solution:** Run `npm run sync-course-names` manually

### Issue: "course_name column doesn't exist"
**Solution:** Restart your server to run `ensureSchema()` which adds the column

### Issue: Some courses show "(not set)"
**Solution:** Those course IDs don't exist in the current API. Check if they're old IDs that need to be removed or updated.
