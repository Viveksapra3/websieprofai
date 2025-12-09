# Course ID Mapping Guide

## Overview

The course ID mapping system allows you to map new course IDs to previous/old course IDs. This is useful when course IDs have been updated and you need to maintain backward compatibility or restore previous IDs.

## Database Schema

A new table `course_id_mapping` has been created with the following structure:

```sql
CREATE TABLE course_id_mapping (
  id text PRIMARY KEY,
  new_course_id text NOT NULL UNIQUE,  -- Current/new course ID
  old_course_id text NOT NULL,         -- Previous/old course ID
  description text,                     -- Optional description
  created_at timestamp,
  updated_at timestamp
);
```

## How to Use

### Step 1: Identify Your Course IDs

First, identify which course IDs need to be mapped. You need to know:
- **New Course ID**: The current course ID in your system
- **Old Course ID**: The previous course ID you want to restore or reference

### Step 2: Edit the Migration Script

Open `scripts/migrate-course-ids.ts` and add your mappings to the `COURSE_ID_MAPPINGS` array:

```typescript
const COURSE_ID_MAPPINGS: CourseIdMappingInput[] = [
  { 
    newCourseId: "course_1", 
    oldCourseId: "s-101", 
    description: "Study Skills Fundamentals" 
  },
  { 
    newCourseId: "course_2", 
    oldCourseId: "s-201", 
    description: "Math with AI Tutors" 
  },
  // Add more mappings as needed
];
```

### Step 3: Run the Migration

Execute the migration script to populate the mapping table:

```bash
npm run tsx scripts/migrate-course-ids.ts
```

This will:
- Insert all mappings into the database
- Update existing mappings if they already exist
- Show a summary of successful and failed operations

### Step 4: View Current Mappings

To view all current course ID mappings:

```bash
npm run tsx scripts/view-course-mappings.ts
```

This will display a table with all mappings and their details.

## Example Workflow

Let's say your course IDs were updated from:
- `s-101` → `course_1`
- `s-201` → `course_2`
- `s-310` → `course_3`

And you want to restore the old IDs. Here's what you do:

1. **Edit `scripts/migrate-course-ids.ts`**:
```typescript
const COURSE_ID_MAPPINGS: CourseIdMappingInput[] = [
  { newCourseId: "course_1", oldCourseId: "s-101", description: "Study Skills" },
  { newCourseId: "course_2", oldCourseId: "s-201", description: "Math with AI" },
  { newCourseId: "course_3", oldCourseId: "s-310", description: "Creative Coding" },
];
```

2. **Run the migration**:
```bash
npm run tsx scripts/migrate-course-ids.ts
```

3. **Verify the mappings**:
```bash
npm run tsx scripts/view-course-mappings.ts
```

## Using Mappings in Your Code

You can query the mapping table in your application code:

```typescript
import { db } from "./server/db";
import { courseIdMapping } from "@shared/schema";
import { eq } from "drizzle-orm";

// Get old course ID from new course ID
async function getOldCourseId(newCourseId: string) {
  const mapping = await db
    .select()
    .from(courseIdMapping)
    .where(eq(courseIdMapping.newCourseId, newCourseId))
    .limit(1);
  
  return mapping[0]?.oldCourseId || null;
}

// Get new course ID from old course ID
async function getNewCourseId(oldCourseId: string) {
  const mapping = await db
    .select()
    .from(courseIdMapping)
    .where(eq(courseIdMapping.oldCourseId, oldCourseId))
    .limit(1);
  
  return mapping[0]?.newCourseId || null;
}
```

## Updating Existing Data

If you need to update existing records (like `user_purchases`, `payment_transactions`, etc.) to use the old course IDs, you can create a custom migration script. Here's an example:

```typescript
import { db, pool } from "../server/db";
import { courseIdMapping, userPurchases } from "../shared/schema";
import { eq } from "drizzle-orm";

async function updatePurchasesToOldIds() {
  const mappings = await db.select().from(courseIdMapping);
  
  for (const mapping of mappings) {
    await db
      .update(userPurchases)
      .set({ courseId: mapping.oldCourseId })
      .where(eq(userPurchases.courseId, mapping.newCourseId));
    
    console.log(`Updated purchases: ${mapping.newCourseId} → ${mapping.oldCourseId}`);
  }
  
  await pool.end();
}
```

## Troubleshooting

### Issue: "No course ID mappings defined"
- **Solution**: Edit `scripts/migrate-course-ids.ts` and add your mappings to the `COURSE_ID_MAPPINGS` array.

### Issue: Migration fails with "duplicate key value"
- **Solution**: The mapping already exists. The script will automatically update existing mappings, but if you see this error, check if there are conflicting entries.

### Issue: TypeScript errors in migration script
- **Solution**: Make sure you're using the correct import paths and that your `tsconfig.json` is properly configured.

## Database Indexes

The following indexes are created for optimal performance:
- `idx_course_id_mapping_new_id` on `new_course_id`
- `idx_course_id_mapping_old_id` on `old_course_id`

## Notes

- The `new_course_id` field has a UNIQUE constraint, so each new course ID can only map to one old course ID.
- The mapping table is automatically created when you run the application (via `ensureSchema()`).
- You can run the migration script multiple times - it will update existing mappings instead of creating duplicates.
