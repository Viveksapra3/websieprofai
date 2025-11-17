# Course Images Setup

## Overview
This document explains how to set up and manage custom course images in the database.

## Database Table
The `course_images` table stores custom image URLs for each course:
- `id`: Primary key (UUID)
- `course_id`: Course identifier (must match the course ID from the external API)
- `image_url`: URL of the custom image for the course
- `created_at`: Timestamp when the record was created
- `updated_at`: Timestamp when the record was last updated

## Setup Instructions

### 1. Run the Migration
Execute the SQL script to create the table and insert sample data:

```bash
psql -U your_username -d your_database -f scripts/add-course-images.sql
```

Or if using a connection string:
```bash
psql "your_database_connection_string" -f scripts/add-course-images.sql
```

### 2. Verify the Setup
Check that the table was created successfully:

```sql
SELECT course_id, image_url FROM course_images;
```

## Adding Custom Images

### Option 1: Direct SQL Insert
```sql
INSERT INTO course_images (course_id, image_url) VALUES
('your-course-id', 'https://your-image-url.com/image.jpg')
ON CONFLICT (course_id) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  updated_at = NOW();
```

### Option 2: Update Existing Record
```sql
UPDATE course_images 
SET image_url = 'https://new-image-url.com/image.jpg',
    updated_at = NOW()
WHERE course_id = 'your-course-id';
```

## Image URL Requirements
- Must be a valid HTTPS URL
- Recommended resolution: 800x600 or higher
- Supported formats: JPG, PNG, WebP
- Image should be optimized for web (< 500KB recommended)

## Image Sources
You can use images from:
- **Unsplash**: https://unsplash.com (free high-quality images)
- **Pexels**: https://pexels.com (free stock photos)
- **Your own CDN/storage**: Upload to your server or cloud storage
- **Cloudinary/ImageKit**: Use image CDN services for optimization

## Sample Image URLs
The initial setup includes sample Unsplash images for common courses:
- Study Skills: Technology workspace
- Math: Calculator and equations
- Coding: Computer programming
- Data Science: Data visualization
- Advanced Programming: Code editor
- Machine Learning: AI/ML concepts

## Fallback Behavior
If no custom image is found for a course:
1. The system will attempt to fetch an image from Pexels API (based on course title)
2. If Pexels fails, a placeholder image will be displayed

## Best Practices
1. Always use high-quality, relevant images
2. Ensure images are properly licensed for commercial use
3. Optimize images before uploading to reduce load time
4. Use consistent aspect ratios (16:9 or 4:3 recommended)
5. Update the `updated_at` timestamp when changing images
