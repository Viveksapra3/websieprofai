# Course ID Migration Summary

## ✅ Migration Completed Successfully

**Date:** December 9, 2025  
**Total Courses Mapped:** 19

## What Was Done

Your course IDs have been successfully mapped from UUID format to sequential numbers (1-19) in the `course_id_mapping` table.

## Course ID Mappings

| New ID | Old Course ID (UUID) | Course Title |
|--------|---------------------|--------------|
| 1 | 9d5e836e-e0f9-4b85-ac93-8f075871738d | Generative AI Handson |
| 2 | 767fae5c-a317-4313-a64c-22ff19644fdd | Basic English Speaking Techniques |
| 3 | 3c5829c7-0d89-4766-96a1-144b3b66f403 | Hindi to English Speaking course |
| 4 | 384b22a4-b8b5-4eb8-bbf0-329780dc3b9f | Cyber Security |
| 5 | 30e88984-e4b5-4dda-9421-bb6df424afe7 | Artificial Intelligence and Machine Learning (AI/Ml) |
| 6 | 3e06c6aa-3f26-4622-aef3-161165dd47d0 | Robotics |
| 7 | 4b416286-3a4a-4df0-8caf-d6bf609a7e81 | Social Change and Development in India |
| 8 | a7e1b694-e5d9-4301-84ef-7f9143080aa8 | Bhaswati sanskrit |
| 9 | 2c89e109-b6ef-4b59-884a-b0caee9eed79 | Accountancy Part I And II |
| 10 | b6fb5aa9-9be0-4432-a965-aa7738781a69 | Our Wondrous World |
| 11 | e0f84b04-cec8-4d4b-9f0a-3070a8e5e7c0 | Class 12th NCERT Psychology book |
| 12 | 858f797d-c543-4aa6-bcab-3121d595d90c | Arabic to English Translation book |
| 13 | a4974181-1c19-4cd7-9168-a5e74afdfa0d | Class 12th NCERT - Political Science - Politics in India Since Independence |
| 14 | 9ba54099-a978-4673-85f7-575268faf26e | Virtual Reality |
| 15 | ea7afd75-b05d-400f-9d65-36915759767f | 12th NCERT - Business Studies Part - 1 |
| 16 | 3634d6a0-a910-4777-aa13-9b33e5cbc581 | Class 12th - NCERT - Business Studies Part - 2 |
| 17 | 60f4ceae-e396-45cf-a27c-83da03720361 | Teacher Training Certificate Programme for AI Awareness |
| 18 | 8e7da3d8-06eb-4730-82ad-835c5a10f0a7 | Class 12th - NCERT - Chemistry Part - 1 |
| 19 | 1ec613a4-93df-4e8f-b01b-fbaf19679a0a | Indian Societies |

## Database Changes

### New Table Created
- **Table Name:** `course_id_mapping`
- **Purpose:** Maps new sequential course IDs to original UUID course IDs
- **Indexes:** Created on both `new_course_id` and `old_course_id` for fast lookups

### Schema Structure
```sql
CREATE TABLE course_id_mapping (
  id text PRIMARY KEY,
  new_course_id text NOT NULL UNIQUE,  -- Sequential IDs: 1, 2, 3, etc.
  old_course_id text NOT NULL,         -- Original UUID course IDs
  description text,
  created_at timestamp,
  updated_at timestamp
);
```

## How to Use the Mappings

### Query by New ID to Get Old ID
```typescript
import { db } from "./server/db";
import { courseIdMapping } from "@shared/schema";
import { eq } from "drizzle-orm";

const mapping = await db
  .select()
  .from(courseIdMapping)
  .where(eq(courseIdMapping.newCourseId, "1"))
  .limit(1);

console.log(mapping[0]?.oldCourseId); // 9d5e836e-e0f9-4b85-ac93-8f075871738d
```

### Query by Old ID to Get New ID
```typescript
const mapping = await db
  .select()
  .from(courseIdMapping)
  .where(eq(courseIdMapping.oldCourseId, "9d5e836e-e0f9-4b85-ac93-8f075871738d"))
  .limit(1);

console.log(mapping[0]?.newCourseId); // "1"
```

## Available Commands

```bash
# View all current mappings
npm run view-course-mappings

# Re-fetch course IDs and generate new mappings
npm run fetch-course-ids

# Run the migration (if you need to update mappings)
npm run migrate-course-ids
```

## Next Steps

If you want to actually **replace** the UUID course IDs with the sequential IDs in your system, you would need to:

1. **Update existing data** in tables like:
   - `user_purchases` (courseId column)
   - `payment_transactions` (courseId column)
   - `course_pricing` (courseId column)
   - `course_images` (courseId column)

2. **Update your API** to use the new IDs when fetching/storing course data

3. **Update the external API** (if you control it) to use sequential IDs

For now, the mapping table allows you to **translate** between the two ID formats without breaking existing functionality.

## Notes

- The mapping table is ready and populated
- All 19 courses have been successfully mapped
- The original UUID course IDs are preserved in the `old_course_id` column
- You can query the mapping table at any time to convert between ID formats
