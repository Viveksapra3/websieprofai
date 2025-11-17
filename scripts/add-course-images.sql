-- Create course_images table
CREATE TABLE IF NOT EXISTS course_images (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample course images with high-quality educational images
INSERT INTO course_images (course_id, image_url) VALUES
('s-101', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop'),
('s-201', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=600&fit=crop'),
('s-310', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'),
('s-320', 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop'),
('course_1', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop'),
('course_2', 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop'),
('course_3', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop')
ON CONFLICT (course_id) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  updated_at = NOW();

-- Verify the data
SELECT course_id, image_url, created_at 
FROM course_images 
ORDER BY created_at;
