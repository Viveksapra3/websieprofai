# Course Pricing Logic with ID Mapping

## Overview
The system uses a course ID mapping table to map new course IDs to old course IDs. When fetching pricing and images, the system automatically resolves the old course ID from the new course ID. Courses are determined to be free based on their pricing in the `course_pricing` table.

## Course ID Mapping

The system uses the `course_id_mapping` table to map new course IDs to old course IDs:
- **New Course ID**: Simple IDs like "1", "2", "3", etc.
- **Old Course ID**: UUID-based IDs like "9d5e836e-e0f9-4b85-ac93-8f075871738d"

When fetching pricing or images:
1. System receives request with new course ID (e.g., "1")
2. Looks up mapping in `course_id_mapping` table
3. Retrieves old course ID (e.g., "9d5e836e-...")
4. Uses old course ID to query `course_pricing` and `course_images` tables

### course_id_mapping Table
```sql
CREATE TABLE course_id_mapping (
  id text PRIMARY KEY,
  new_course_id text NOT NULL UNIQUE,  -- e.g., "1", "2", "3"
  old_course_id text NOT NULL,         -- e.g., "9d5e836e-..."
  description text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

## Free Course Logic

A course is considered **FREE** if:
1. The `is_free` flag is set to `true` in the `course_pricing` table, OR
2. The `price` is set to `0.00` in the `course_pricing` table

**Note**: Pricing and images are stored using the **old course ID** in the database.

## Implementation

### Payment Service (`server/payment-service.ts`)

**`getOldCourseId(newCourseId)` - Private Helper**
- Queries `course_id_mapping` table
- Returns old course ID if mapping exists
- Returns original ID if no mapping found
- Handles errors gracefully

**`hasAccess(userId, courseId)`**
- Maps new course ID to old course ID using `getOldCourseId()`
- Queries `course_pricing` table using old course ID
- Checks if `isFree === true` OR `price === 0`
- If free, grants immediate access
- If paid, checks if user has purchased the course (using old course ID)

**`getCoursePricing(courseId)`**
- Maps new course ID to old course ID using `getOldCourseId()`
- Returns pricing data from `course_pricing` table using old course ID
- If no pricing found, defaults to paid (99.00 INR)

**`syncCoursePricing(apiBase)`**
- Fetches courses from external API
- Maps each new course ID to old course ID
- Syncs pricing using old course IDs
- First 3 courses are set as free

### Routes (`server/routes.ts`)

**`getOldCourseId(newCourseId)` - Helper Function**
- Same functionality as payment service helper
- Queries `course_id_mapping` table
- Returns old course ID or original ID

**`GET /api/courses-with-pricing`**
- Fetches all course ID mappings for efficient lookup
- Creates a mapping map for quick lookups
- For each course:
  - Maps new course ID to old course ID
  - Queries `course_pricing` using old course ID
  - Queries `course_images` using old course ID
  - Checks if `isFree === true` OR `price === 0`
  - Sets `isFree` flag accordingly
  - Grants access if course is free OR user purchased it (using old course ID)

**`POST /api/admin/course-pricing`**
- Maps new course IDs to old course IDs
- Sets pricing using old course IDs
- First 3 courses are set as free

## Example Flow

### User Requests Course "1"

```
1. User requests course with ID "1"
   ↓
2. System looks up mapping:
   SELECT old_course_id FROM course_id_mapping WHERE new_course_id = '1'
   Result: "9d5e836e-e0f9-4b85-ac93-8f075871738d"
   ↓
3. System queries pricing using old ID:
   SELECT * FROM course_pricing WHERE course_id = '9d5e836e-...'
   Result: { price: 0.00, is_free: true, ... }
   ↓
4. System queries images using old ID:
   SELECT * FROM course_images WHERE course_id = '9d5e836e-...'
   Result: { image_url: 'https://...', ... }
   ↓
5. System determines course is free (price = 0)
   ↓
6. User gets immediate access with pricing and image data
```

### Why This Approach?

- **Backward Compatibility**: Existing pricing and images stored with old UUIDs continue to work
- **Clean API**: Frontend uses simple IDs (1, 2, 3) instead of UUIDs
- **Flexible**: Can remap courses without changing pricing/images data
- **Transparent**: Mapping happens automatically in the backend

## Database Schema

### course_pricing Table
```sql
CREATE TABLE course_pricing (
  id text PRIMARY KEY,
  course_id text NOT NULL UNIQUE,
  price decimal(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  is_free boolean NOT NULL DEFAULT false,
  display_order integer,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

## Setting Course Pricing

### To Make a Course Free
Set either:
- `price = 0.00`, OR
- `is_free = true`

Example:
```sql
UPDATE course_pricing 
SET price = 0.00, is_free = true 
WHERE course_id = 'your-course-id';
```

### To Make a Course Paid
Set:
- `price = <amount>` (e.g., 99.00)
- `is_free = false`

Example:
```sql
UPDATE course_pricing 
SET price = 99.00, is_free = false 
WHERE course_id = 'your-course-id';
```

## Admin Endpoint

**`POST /api/admin/course-pricing`**
- Accepts an array of courses with pricing
- First 3 courses in the array are set as free (price = 0)
- Remaining courses use their specified pricing

Example request:
```json
{
  "courses": [
    { "id": "course-1", "price": 0 },      // Will be free
    { "id": "course-2", "price": 0 },      // Will be free
    { "id": "course-3", "price": 0 },      // Will be free
    { "id": "course-4", "price": 99 },     // Will be paid
    { "id": "course-5", "price": 149 }     // Will be paid
  ]
}
```

## Sync Endpoint

**`POST /api/admin/sync-courses`**
- Fetches courses from external API
- First 3 courses are set as free (price = 0)
- Remaining courses default to 99 INR

## Access Control

### Free Courses
- Accessible to all logged-in users
- No payment required
- Immediate access granted

### Paid Courses
- Require payment to access
- User must complete purchase via CCAvenue
- Access granted after successful payment

## Default Behavior

If a course has **no pricing record** in the database:
- Treated as **PAID** (99.00 INR)
- User must purchase to access
- `isFree = false`

## Testing

To verify pricing logic:

1. **Check if course is free:**
   ```sql
   SELECT course_id, price, is_free 
   FROM course_pricing 
   WHERE course_id = 'your-course-id';
   ```

2. **List all free courses:**
   ```sql
   SELECT course_id, price, is_free 
   FROM course_pricing 
   WHERE is_free = true OR price = 0;
   ```

3. **Test API endpoint:**
   ```bash
   curl http://localhost:5000/api/courses-with-pricing
   ```

## Summary

- ✅ No hardcoded free courses
- ✅ Free status determined by `price = 0` OR `is_free = true`
- ✅ Courses without pricing default to paid
- ✅ Consistent logic across payment service and routes
- ✅ Admin can control pricing via database or API endpoints
