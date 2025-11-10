-- Manual setup for course pricing
-- Run this SQL script to set up basic course pricing

-- Insert sample course pricing (first 3 free, rest paid)
INSERT INTO course_pricing (course_id, price, currency, is_free, display_order) VALUES
('s-101', 0.00, 'INR', true, 1),
('s-201', 0.00, 'INR', true, 2),
('s-310', 0.00, 'INR', true, 3),
('s-320', 999.00, 'INR', false, 4),
('course_1', 999.00, 'INR', false, 5),
('course_2', 1499.00, 'INR', false, 6),
('course_3', 799.00, 'INR', false, 7)
ON CONFLICT (course_id) DO UPDATE SET
  price = EXCLUDED.price,
  is_free = EXCLUDED.is_free,
  display_order = EXCLUDED.display_order,
  updated_at = now();

-- Verify the data
SELECT course_id, price, currency, is_free, display_order 
FROM course_pricing 
ORDER BY display_order;
