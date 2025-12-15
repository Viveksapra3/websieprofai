# Populating Course Pricing Table

## Overview
This guide explains how to create pricing entries for all courses in the `course_pricing` table with course names included.

## Available Scripts

### Option 1: Simple Script (Recommended)
**File**: `scripts/create-course-pricing-entries.ts`

Uses course names from the `course_id_mapping` table descriptions.

**Run:**
```bash
npm run tsx scripts/create-course-pricing-entries.ts
```

**What it does:**
- Fetches all courses from `course_id_mapping` table
- Uses the `description` field as the course name
- Creates/updates pricing entries with course names
- Sets first 3 courses as FREE (price = 0.00)
- Sets remaining courses as PAID (price = 99.00 INR)
- Assigns display order based on mapping order

### Option 2: API-Based Script
**File**: `scripts/populate-course-pricing.ts`

Fetches course names from external API for more accurate names.

**Run:**
```bash
npm run tsx scripts/populate-course-pricing.ts
```

**What it does:**
- Fetches all courses from `course_id_mapping` table
- Fetches course details from external API (using VITE_API_BASE)
- Uses API course titles as course names
- Falls back to mapping descriptions if API fails
- Creates/updates pricing entries
- Sets first 3 courses as FREE
- Sets remaining courses as PAID

## Prerequisites

1. **Database must be set up:**
   ```bash
   npm run dev  # This will run ensureSchema()
   ```

2. **Course ID mappings must exist:**
   ```bash
   npm run tsx scripts/migrate-course-ids.ts
   ```

3. **Environment variables must be set:**
   ```
   DATABASE_URL=your_postgres_connection_string
   VITE_API_BASE=your_api_base_url  # Only for Option 2
   ```

## Expected Output

### Console Output
```
================================================================================
CREATING COURSE PRICING ENTRIES
================================================================================

📋 Fetching course mappings...
✅ Found 19 courses

Creating/updating pricing entries...

================================================================================

1. Course 1: Generative AI Handson
   Old ID: 9d5e836e-e0f9-4b85-ac93-8f075871738d
   Price: 0.00 INR (FREE)
   ✅ Created

2. Course 2: Basic English Speaking Techniques
   Old ID: 767fae5c-a317-4313-a64c-22ff19644fdd
   Price: 0.00 INR (FREE)
   ✅ Created

3. Course 3: Hindi to English Speaking course
   Old ID: 3c5829c7-0d89-4766-96a1-144b3b66f403
   Price: 0.00 INR (FREE)
   ✅ Created

4. Course 4: Cyber Security
   Old ID: 384b22a4-b8b5-4eb8-bbf0-329780dc3b9f
   Price: 99.00 INR (PAID)
   ✅ Created

...

================================================================================
SUMMARY
================================================================================
✅ Created: 19
🔄 Updated: 0
❌ Errors: 0
📊 Total: 19
```

### Database Result

After running the script, your `course_pricing` table will have entries like:

| course_id | course_name | price | currency | is_free | display_order |
|-----------|-------------|-------|----------|---------|---------------|
| 9d5e836e-... | Generative AI Handson | 0.00 | INR | true | 1 |
| 767fae5c-... | Basic English Speaking Techniques | 0.00 | INR | true | 2 |
| 3c5829c7-... | Hindi to English Speaking course | 0.00 | INR | true | 3 |
| 384b22a4-... | Cyber Security | 99.00 | INR | false | 4 |
| 30e88984-... | Artificial Intelligence and Machine Learning | 99.00 | INR | false | 5 |

## Pricing Rules

1. **First 3 Courses**: Always FREE (price = 0.00, is_free = true)
2. **Remaining Courses**: PAID (price = 99.00, is_free = false)
3. **Display Order**: Based on order in `course_id_mapping` table
4. **Course Names**: From mapping descriptions or API

## Updating Existing Entries

Both scripts are **idempotent** - safe to run multiple times:
- If entry exists: Updates course_name, price, is_free, display_order
- If entry doesn't exist: Creates new entry

## Manual Updates

To manually update a course's pricing:

```sql
-- Make a course free
UPDATE course_pricing 
SET price = 0.00, is_free = true, course_name = 'Your Course Name'
WHERE course_id = 'your-course-id';

-- Make a course paid
UPDATE course_pricing 
SET price = 149.00, is_free = false, course_name = 'Your Course Name'
WHERE course_id = 'your-course-id';
```

## Verifying Results

Check the pricing table:
```sql
SELECT 
  display_order,
  course_name,
  price,
  currency,
  is_free
FROM course_pricing
ORDER BY display_order;
```

Or use the API:
```bash
curl http://localhost:5000/api/courses-with-pricing
```

## Troubleshooting

### "No course mappings found"
**Solution**: Run the mapping script first:
```bash
npm run tsx scripts/migrate-course-ids.ts
```

### "Database connection failed"
**Solution**: Check your DATABASE_URL environment variable:
```bash
echo $DATABASE_URL  # Linux/Mac
echo %DATABASE_URL%  # Windows
```

### "API fetch failed" (Option 2 only)
**Solution**: 
- Check VITE_API_BASE is set correctly
- Make sure external API is running
- Script will fall back to mapping descriptions

### Duplicate key errors
**Solution**: Some courses already exist. The script will update them instead of creating new ones.

## Next Steps

After populating pricing:

1. **Verify in database:**
   ```sql
   SELECT COUNT(*) FROM course_pricing;
   ```

2. **Test API endpoint:**
   ```bash
   curl http://localhost:5000/api/courses-with-pricing
   ```

3. **Check frontend:**
   - Visit `/courses` page
   - Verify course names are displayed
   - Verify first 3 courses show as FREE
   - Verify remaining courses show prices

4. **Populate course images** (optional):
   ```bash
   npm run tsx scripts/populate-course-images.ts
   ```

## Notes

- Course names are stored in the `course_name` column
- Pricing uses **old course IDs** (UUIDs) from the mapping table
- Frontend displays courses using **new course IDs** (1, 2, 3, etc.)
- The system automatically maps between new and old IDs
