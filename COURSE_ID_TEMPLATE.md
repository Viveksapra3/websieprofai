# Course ID Mapping Template

Use this template to organize your course ID mappings before adding them to the migration script.

## Instructions

1. Fill in the table below with your course IDs
2. Copy the mappings to `scripts/migrate-course-ids.ts`
3. Run `npm run migrate-course-ids`

## Course ID Mappings

| New Course ID | Old Course ID | Description |
|---------------|---------------|-------------|
| course_1      | s-101         | Study Skills Fundamentals |
| course_2      | s-201         | Math with AI Tutors |
| course_3      | s-310         | Creative Coding with Three.js |
| course_4      | s-320         | Intro to Data Science |
|               |               |             |
|               |               |             |
|               |               |             |

## Example Code Format

Once you've filled in the table above, format your mappings like this in `scripts/migrate-course-ids.ts`:

```typescript
const COURSE_ID_MAPPINGS: CourseIdMappingInput[] = [
  { newCourseId: "course_1", oldCourseId: "s-101", description: "Study Skills Fundamentals" },
  { newCourseId: "course_2", oldCourseId: "s-201", description: "Math with AI Tutors" },
  { newCourseId: "course_3", oldCourseId: "s-310", description: "Creative Coding with Three.js" },
  { newCourseId: "course_4", oldCourseId: "s-320", description: "Intro to Data Science" },
  // Add more mappings as needed
];
```

## Quick Commands

```bash
# Edit the migration script
code scripts/migrate-course-ids.ts

# Run the migration
npm run migrate-course-ids

# View current mappings
npm run view-course-mappings
```
