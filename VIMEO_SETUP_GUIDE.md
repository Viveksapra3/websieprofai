# Vimeo Video Setup Guide for My Course Page

## Overview
The course page now supports Vimeo video streaming with a modern, Netflix-style UI featuring:
- Video player with sidebar navigation
- Progress tracking
- Sequential lesson unlocking
- Auto-advance to next lesson
- Certificate generation

## How to Add Vimeo Videos

### 1. Get Your Vimeo Video ID

For a Vimeo video URL like: `https://vimeo.com/76979871`
The video ID is: `76979871`

### 2. Update Course Data Structure

Open `client/src/pages/my-course.tsx` and locate the `DEMO_MODULES` array (around line 50).

### 3. Add Videos Module by Module

Each lesson can have:
- `vimeoId`: The Vimeo video ID (string)
- `type`: "video", "reading", or "quiz"
- `completed`: boolean (tracked automatically)
- `duration`: string (e.g., "12:45")

### Example Pattern:

```typescript
const DEMO_MODULES: Module[] = [
  {
    id: "module-1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals",
    lessons: [
      {
        id: "lesson-1-1",
        title: "Welcome Video",
        duration: "5:30",
        completed: false,
        vimeoId: "YOUR_VIMEO_ID_HERE",  // ← Replace with your Vimeo ID
        type: "video"
      },
      {
        id: "lesson-1-2",
        title: "HTML Basics",
        duration: "12:45",
        completed: false,
        vimeoId: "ANOTHER_VIMEO_ID",     // ← Replace with your Vimeo ID
        type: "video"
      },
      {
        id: "lesson-1-3",
        title: "Reading Material",
        duration: "10:00",
        completed: false,
        type: "reading"                   // ← No vimeoId needed for reading
      },
      {
        id: "lesson-1-4",
        title: "Module Quiz",
        duration: "15:00",
        completed: false,
        type: "quiz"                      // ← No vimeoId needed for quiz
      }
    ]
  },
  // Add more modules...
];
```

## Lesson Types

### 1. Video Lessons
```typescript
{
  id: "lesson-x-x",
  title: "Video Lesson Title",
  duration: "12:45",
  completed: false,
  vimeoId: "76979871",  // Required for videos
  type: "video"
}
```

### 2. Reading Lessons
```typescript
{
  id: "lesson-x-x",
  title: "Reading Material",
  duration: "10:00",
  completed: false,
  type: "reading"  // No vimeoId needed
}
```

### 3. Quiz/Assessment Lessons
```typescript
{
  id: "lesson-x-x",
  title: "Module Quiz",
  duration: "15:00",
  completed: false,
  type: "quiz"  // No vimeoId needed
}
```

## Features

### Auto-Progress
When a video ends, the system automatically:
1. Marks the current lesson as completed
2. Advances to the next lesson in the module
3. If it's the last lesson, moves to the first lesson of the next module

### Sequential Unlocking
- Lessons are locked until the previous lesson is completed
- Locked lessons show a lock icon and cannot be clicked
- This ensures students follow the intended learning path

### Progress Tracking
- Overall course progress percentage
- Per-module completion tracking
- Visual indicators for completed lessons
- Progress persists in localStorage

### Certificate Generation
- Unlocks when all lessons are completed
- Generates a printable certificate
- Opens in new window with print dialog

## Customization

### Change Course Information
Update the `DEMO_COURSE` object:
```typescript
const DEMO_COURSE: Course = {
  title: "Your Course Title",
  description: "Your course description",
  instructor: "Instructor Name",
  thumbnail: "https://your-image-url.com/image.jpg"
};
```

### Add More Modules
Simply add more objects to the `DEMO_MODULES` array following the same pattern.

### Modify Lesson Duration
Update the `duration` field for each lesson (format: "MM:SS" or "HH:MM:SS").

## Vimeo Player Features

The VimeoPlayer component supports:
- Responsive 16:9 aspect ratio
- Fullscreen mode
- Auto-play next lesson
- Event tracking (video ended)
- Embedded controls

## Testing

1. Replace demo Vimeo IDs with your actual video IDs
2. Navigate to `/my-course` in your browser
3. Click on a video lesson to start playing
4. Test the auto-advance feature by letting a video play to the end
5. Verify progress tracking and lesson unlocking

## Notes

- The demo uses Vimeo video ID `76979871` as a placeholder
- Replace ALL instances of this ID with your actual Vimeo video IDs
- Vimeo videos must be publicly accessible or have proper embed settings
- For private videos, ensure your Vimeo privacy settings allow embedding

## File Locations

- **Main Course Page**: `client/src/pages/my-course.tsx`
- **Vimeo Player Component**: `client/src/components/VimeoPlayer.tsx`
- **Route Configuration**: `client/src/App.tsx` (line 48)
- **Navigation Link**: Home page India AI Mission section

## Support

If videos don't load:
1. Check Vimeo video privacy settings
2. Verify the video ID is correct
3. Ensure the video allows embedding
4. Check browser console for errors
