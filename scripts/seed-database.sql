-- Seed data for EcoCart platform
-- This script populates the database with sample data for testing

-- Insert sample profiles (Note: In real app, these would be created via Supabase Auth)
INSERT INTO public.profiles (id, email, full_name, company_name, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'retailer1@example.com', 'John Smith', 'EcoTech Solutions', 'retailer'),
    ('550e8400-e29b-41d4-a716-446655440002', 'retailer2@example.com', 'Sarah Johnson', 'Green Electronics Co', 'retailer'),
    ('550e8400-e29b-41d4-a716-446655440003', 'customer1@example.com', 'Mike Davis', NULL, 'customer'),
    ('550e8400-e29b-41d4-a716-446655440004', 'customer2@example.com', 'Emily Chen', NULL, 'customer'),
    ('550e8400-e29b-41d4-a716-446655440005', 'admin@ecocart.com', 'Admin User', 'EcoCart', 'admin');

-- Insert sample products
INSERT INTO public.products (id, name, category, length, width, height, weight, description, destination, retailer_id) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Wireless Headphones', 'electronics', 20.0, 15.0, 8.0, 300.0, 'Premium wireless headphones with noise cancellation', 'New York, NY', '550e8400-e29b-41d4-a716-446655440001'),
    ('660e8400-e29b-41d4-a716-446655440002', 'Smartphone Case', 'electronics', 16.0, 8.0, 2.0, 50.0, 'Eco-friendly phone case made from recycled materials', 'Los Angeles, CA', '550e8400-e29b-41d4-a716-446655440001'),
    ('660e8400-e29b-41d4-a716-446655440003', 'Bluetooth Speaker', 'electronics', 25.0, 12.0, 10.0, 800.0, 'Portable waterproof Bluetooth speaker', 'Chicago, IL', '550e8400-e29b-41d4-a716-446655440002'),
    ('660e8400-e29b-41d4-a716-446655440004', 'Laptop Stand', 'electronics', 30.0, 25.0, 5.0, 1200.0, 'Adjustable aluminum laptop stand', 'Miami, FL', '550e8400-e29b-41d4-a716-446655440002'),
    ('660e8400-e29b-41d4-a716-446655440005', 'USB Cable Set', 'electronics', 15.0, 10.0, 3.0, 150.0, 'Set of 3 USB-C cables in different lengths', 'Seattle, WA', '550e8400-e29b-41d4-a716-446655440001');

-- Insert packaging suggestions
INSERT INTO public.packaging_suggestions (id, product_id, optimal_length, optimal_width, optimal_height, material, eco_score, cost_estimate, co2_reduction, packaging_efficiency) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 22.0, 17.0, 10.0, 'Recycled Cardboard', 88, 3.20, 2.3, 85.5),
    ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 18.0, 10.0, 3.0, 'Biodegradable Plastic', 92, 2.10, 1.1, 90.2),
    ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 27.0, 14.0, 12.0, 'Hemp Fiber Composite', 95, 4.50, 3.2, 88.7),
    ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 32.0, 27.0, 7.0, 'Recycled Cardboard', 85, 5.80, 2.8, 82.3),
    ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 17.0, 12.0, 4.0, 'Biodegradable Plastic', 90, 1.80, 0.9, 88.9);

-- Insert route optimizations
INSERT INTO public.routes (id, product_id, origin_address, destination_address, vehicle_type, distance, duration, co2_emissions, co2_saved, delivery_cost, optimized_route) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Warehouse A, Newark, NJ', 'New York, NY', 'electric', 24.5, 35, 0.0, 4.2, 8.50, '{"waypoints": [{"lat": 40.7128, "lng": -74.0060}, {"lat": 40.7589, "lng": -73.9851}]}'),
    ('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Warehouse B, Ontario, CA', 'Los Angeles, CA', 'hybrid', 28.3, 42, 1.8, 2.4, 7.20, '{"waypoints": [{"lat": 34.0522, "lng": -118.2437}, {"lat": 34.0639, "lng": -118.1467}]}'),
    ('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'Warehouse C, Schaumburg, IL', 'Chicago, IL', 'electric', 32.1, 48, 0.0, 5.1, 9.20, '{"waypoints": [{"lat": 41.8781, "lng": -87.6298}, {"lat": 42.0333, "lng": -88.0834}]}'),
    ('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'Warehouse D, Doral, FL', 'Miami, FL', 'electric', 18.7, 28, 0.0, 3.1, 6.80, '{"waypoints": [{"lat": 25.7617, "lng": -80.1918}, {"lat": 25.8197, "lng": -80.3242}]}'),
    ('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'Warehouse E, Bellevue, WA', 'Seattle, WA', 'hybrid', 22.4, 35, 1.2, 2.8, 7.50, '{"waypoints": [{"lat": 47.6062, "lng": -122.3321}, {"lat": 47.6101, "lng": -122.2015}]}');

-- Insert sample orders
INSERT INTO public.orders (id, order_number, customer_id, product_id, packaging_id, route_id, status, delivery_type, eco_score, total_co2_saved, points_earned, estimated_delivery) VALUES
    ('990e8400-e29b-41d4-a716-446655440001', 'ORD-001', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'in_transit', 'EV Delivery', 88, 6.5, 150, '2024-01-20'),
    ('990e8400-e29b-41d4-a716-446655440002', 'ORD-002', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'delivered', 'Green Packaging', 92, 3.5, 75, '2024-01-15'),
    ('990e8400-e29b-41d4-a716-446655440003', 'ORD-003', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'processing', 'EV + Eco Packaging', 95, 8.3, 200, '2024-01-22'),
    ('990e8400-e29b-41d4-a716-446655440004', 'ORD-004', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'pending', 'EV Delivery', 85, 5.9, 125, '2024-01-25');

-- Insert reward history
INSERT INTO public.rewards (id, user_id, order_id, points, action_type, description) VALUES
    ('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440001', 150, 'ev_delivery', 'Chose electric vehicle delivery'),
    ('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440002', 75, 'eco_packaging', 'Selected biodegradable packaging'),
    ('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440003', 200, 'combo_green', 'EV delivery + eco packaging combo'),
    ('aa0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', NULL, 100, 'carbon_offset', 'Purchased carbon offset credits'),
    ('aa0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', NULL, 50, 'referral', 'Referred a friend to EcoCart');

-- Insert blockchain tracking data (simulated)
INSERT INTO public.packaging_blockchain (id, packaging_id, material_origin, certification_type, certification_number, sustainability_score, verification_hash) VALUES
    ('bb0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Sustainable Forests, Oregon', 'FSC Certified', 'FSC-C123456', 95, 'hash_abc123def456ghi789'),
    ('bb0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'Recycled Ocean Plastic, California', 'Ocean Positive', 'OP-789012', 98, 'hash_def456ghi789jkl012'),
    ('bb0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 'Hemp Farms, Colorado', 'Organic Certified', 'USDA-345678', 97, 'hash_ghi789jkl012mno345'),
    ('bb0e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 'Recycled Paper Mills, Wisconsin', 'FSC Recycled', 'FSC-R987654', 92, 'hash_jkl012mno345pqr678'),
    ('bb0e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', 'Bioplastic Facility, Texas', 'Biodegradable Certified', 'BPI-567890', 94, 'hash_mno345pqr678stu901');

-- Insert analytics data
INSERT INTO public.analytics (id, user_id, metric_type, metric_value, period_start, period_end) VALUES
    ('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'co2_saved', 156.5, '2024-01-01', '2024-01-31'),
    ('cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'cost_savings', 2340.00, '2024-01-01', '2024-01-31'),
    ('cc0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'packaging_efficiency', 89.2, '2024-01-01', '2024-01-31'),
    ('cc0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'co2_saved', 45.2, '2024-01-01', '2024-01-31'),
    ('cc0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'points_earned', 1250, '2024-01-01', '2024-01-31'),
    ('cc0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', 'co2_saved', 38.7, '2024-01-01', '2024-01-31'),
    ('cc0e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', 'points_earned', 875, '2024-01-01', '2024-01-31');

-- Create a view for easy dashboard queries
CREATE VIEW public.dashboard_stats AS
SELECT 
    p.role,
    p.id as user_id,
    p.full_name,
    COALESCE(SUM(CASE WHEN a.metric_type = 'co2_saved' THEN a.metric_value END), 0) as total_co2_saved,
    COALESCE(SUM(CASE WHEN a.metric_type = 'points_earned' THEN a.metric_value END), 0) as total_points,
    COALESCE(SUM(CASE WHEN a.metric_type = 'cost_savings' THEN a.metric_value END), 0) as total_savings,
    COUNT(DISTINCT o.id) as total_orders
FROM public.profiles p
LEFT JOIN public.analytics a ON p.id = a.user_id
LEFT JOIN public.orders o ON p.id = o.customer_id OR p.id IN (
    SELECT pr.retailer_id FROM public.products pr WHERE pr.id = o.product_id
)
GROUP BY p.id, p.role, p.full_name;
