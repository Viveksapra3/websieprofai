-- Update courses 1, 2, and 3 to be free
UPDATE course_pricing 
SET 
    is_free = true,
    price = '0.00',
    updated_at = CURRENT_TIMESTAMP
WHERE course_id IN ('1', '2', '3');

-- Insert pricing records for courses 1, 2, 3 if they don't exist
INSERT INTO course_pricing (id, course_id, price, currency, is_free, display_order, created_at, updated_at)
VALUES 
    ('free_1', '1', '0.00', 'INR', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('free_2', '2', '0.00', 'INR', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('free_3', '3', '0.00', 'INR', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (course_id) DO UPDATE SET
    is_free = true,
    price = '0.00',
    display_order = EXCLUDED.display_order,
    updated_at = CURRENT_TIMESTAMP;
