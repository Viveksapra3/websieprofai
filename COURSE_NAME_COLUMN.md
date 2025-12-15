# Course Name Column Addition

## Overview
Added `course_name` column to both `course_pricing` and `course_images` tables to store the course title/name alongside the course ID.

## Changes Made

### 1. Schema Update (`shared/schema.ts`)
- ✅ Added `courseName: text("course_name")` to `coursePricing` table definition
- ✅ Verified `courseName: text("course_name")` exists in `courseImages` table definition

### 2. Database Schema (`server/db.ts`)
- ✅ Added `course_name text` column to `course_pricing` table creation SQL
- ✅ Added `ALTER TABLE course_pricing ADD COLUMN IF NOT EXISTS course_name text;` for existing tables
- ✅ Verified `course_name text` column in `course_images` table creation SQL
- ✅ Verified `ALTER TABLE course_images ADD COLUMN IF NOT EXISTS course_name text;` for existing tables

### 3. Migration Script
Created `scripts/add-course-name-column.ts` to add the column to existing databases.

## Database Schema

### course_pricing Table
```sql
CREATE TABLE course_pricing (
  id text PRIMARY KEY,
  course_id text NOT NULL UNIQUE,
  course_name text,                    -- NEW COLUMN
  price decimal(10,2) NOT NULL DEFAULT 0.00,
  currency text NOT NULL DEFAULT 'INR',
  is_free boolean NOT NULL DEFAULT false,
  display_order integer,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

### course_images Table
```sql
CREATE TABLE course_images (
  id text PRIMARY KEY,
  course_id text NOT NULL UNIQUE,
  course_name text,                    -- EXISTING COLUMN (verified)
  image_url text NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

## Running the Migration

For existing databases, run the migration script:

```bash
npm run tsx scripts/add-course-name-column.ts
```

This script:
- Adds `course_name` column to `course_pricing` table if it doesn't exist
- Verifies `course_name` column exists in `course_images` table
- Shows current table structure
- Safe to run multiple times (idempotent)

## Usage

### Setting Course Name When Creating Pricing

```typescript
await db.insert(coursePricing).values({
  courseId: "course-123",
  courseName: "Introduction to AI",  // NEW: Store course name
  price: "99.00",
  currency: "INR",
  isFree: false,
  displayOrder: 1,
});
```

### Setting Course Name When Creating Image

```typescript
await db.insert(courseImages).values({
  courseId: "course-123",
  courseName: "Introduction to AI",  // Store course name
  imageUrl: "https://example.com/image.jpg",
});
```

### Querying with Course Name

```typescript
// Get pricing with course name
const pricing = await db
  .select()
  .from(coursePricing)
  .where(eq(coursePricing.courseId, "course-123"));

console.log(pricing[0].courseName); // "Introduction to AI"

// Get images with course name
const images = await db
  .select()
  .from(courseImages)
  .where(eq(courseImages.courseId, "course-123"));

console.log(images[0].courseName); // "Introduction to AI"
```

## Benefits

1. **Easier Debugging**: Can see course names directly in pricing/image records
2. **Better Logging**: Log course names instead of just IDs
3. **Admin UI**: Display course names in admin panels without extra joins
4. **Data Integrity**: Course name stored with pricing/images for reference
5. **Performance**: Avoid joins when only need course name with pricing/images

## Backward Compatibility

- ✅ Column is **optional** (nullable)
- ✅ Existing records will have `NULL` for `course_name`
- ✅ System works without course names populated
- ✅ Can be populated gradually as courses are updated

## Populating Existing Records

To populate course names for existing records, you can create a script that:
1. Fetches courses from external API
2. Uses course ID mapping to get old course IDs
3. Updates `course_pricing` and `course_images` with course names

Example:
```typescript
// Fetch course from API
const course = await fetchCourseById(oldCourseId);

// Update pricing with course name
await db
  .update(coursePricing)
  .set({ courseName: course.title })
  .where(eq(coursePricing.courseId, oldCourseId));

// Update images with course name
await db
  .update(courseImages)
  .set({ courseName: course.title })
  .where(eq(courseImages.courseId, oldCourseId));
```

## Notes

- The `course_name` column is **optional** and can be `NULL`
- It's recommended to populate this field when creating/updating pricing or images
- The column is indexed via the existing course_id indexes
- No additional indexes needed for this column
