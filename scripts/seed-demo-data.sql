-- Seed demo data for EcoCart platform
-- This script safely inserts demo data without conflicting with existing records

-- First, let's create some demo profiles (these will simulate authenticated users)
-- In production, these would be created via Supabase Auth
INSERT INTO public.profiles (id, email, full_name, company_name, role) 
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'demo.retailer@ecocart.com', 'Demo Retailer', 'EcoTech Solutions', 'retailer'),
    ('22222222-2222-2222-2222-222222222222', 'demo.customer@ecocart.com', 'Demo Customer', NULL, 'customer')
ON CONFLICT (id) DO NOTHING;

-- Insert demo products
INSERT INTO public.products (id, name, category, length, width, height, weight, description, destination, retailer_id) VALUES
    ('33333333-3333-3333-3333-333333333333', 'Eco Wireless Headphones', 'electronics', 20.0, 15.0, 8.0, 300.0, 'Premium wireless headphones with sustainable materials', 'New York, NY', '11111111-1111-1111-1111-111111111111'),
    ('44444444-4444-4444-4444-444444444444', 'Recycled Smartphone Case', 'electronics', 16.0, 8.0, 2.0, 50.0, 'Phone case made from 100% recycled ocean plastic', 'Los Angeles, CA', '11111111-1111-1111-1111-111111111111'),
    ('55555555-5555-5555-5555-555555555555', 'Solar Bluetooth Speaker', 'electronics', 25.0, 12.0, 10.0, 800.0, 'Solar-powered waterproof Bluetooth speaker', 'Chicago, IL', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- Insert packaging suggestions
INSERT INTO public.packaging_suggestions (id, product_id, optimal_length, optimal_width, optimal_height, material, eco_score, cost_estimate, co2_reduction, packaging_efficiency) VALUES
    ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 22.0, 17.0, 10.0, 'Recycled Cardboard', 88, 3.20, 2.3, 85.5),
    ('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 18.0, 10.0, 3.0, 'Biodegradable Plastic', 92, 2.10, 1.1, 90.2),
    ('88888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555', 27.0, 14.0, 12.0, 'Hemp Fiber Composite', 95, 4.50, 3.2, 88.7)
ON CONFLICT (id) DO NOTHING;

-- Insert route optimizations
INSERT INTO public.routes (id, product_id, origin_address, destination_address, vehicle_type, distance, duration, co2_emissions, co2_saved, delivery_cost, optimized_route) VALUES
    ('99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 'EcoCart Warehouse, Newark, NJ', 'New York, NY', 'electric', 24.5, 35, 0.0, 4.2, 8.50, '{"waypoints": [{"lat": 40.7128, "lng": -74.0060}, {"lat": 40.7589, "lng": -73.9851}]}'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'EcoCart Warehouse, Ontario, CA', 'Los Angeles, CA', 'hybrid', 28.3, 42, 1.8, 2.4, 7.20, '{"waypoints": [{"lat": 34.0522, "lng": -118.2437}, {"lat": 34.0639, "lng": -118.1467}]}'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'EcoCart Warehouse, Schaumburg, IL', 'Chicago, IL', 'electric', 32.1, 48, 0.0, 5.1, 9.20, '{"waypoints": [{"lat": 41.8781, "lng": -87.6298}, {"lat": 42.0333, "lng": -88.0834}]}')
ON CONFLICT (id) DO NOTHING;

-- Insert demo orders
INSERT INTO public.orders (id, order_number, customer_id, product_id, packaging_id, route_id, status, delivery_type, eco_score, total_co2_saved, points_earned, estimated_delivery) VALUES
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'DEMO-001', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', '99999999-9999-9999-9999-999999999999', 'in_transit', 'EV Delivery', 88, 6.5, 150, CURRENT_DATE + INTERVAL '2 days'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'DEMO-002', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'delivered', 'Green Packaging', 92, 3.5, 75, CURRENT_DATE - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- Insert reward history
INSERT INTO public.rewards (id, user_id, order_id, points, action_type, description) VALUES
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 150, 'ev_delivery', 'Chose electric vehicle delivery'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 75, 'eco_packaging', 'Selected biodegradable packaging'),
    ('gggggggg-gggg-gggg-gggg-gggggggggggg', '22222222-2222-2222-2222-222222222222', NULL, 100, 'carbon_offset', 'Purchased carbon offset credits')
ON CONFLICT (id) DO NOTHING;

-- Insert blockchain tracking data
INSERT INTO public.packaging_blockchain (id, packaging_id, material_origin, certification_type, certification_number, sustainability_score, verification_hash) VALUES
    ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '66666666-6666-6666-6666-666666666666', 'Sustainable Forests, Oregon', 'FSC Certified', 'FSC-C123456', 95, 'hash_demo_abc123def456'),
    ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '77777777-7777-7777-7777-777777777777', 'Recycled Ocean Plastic, California', 'Ocean Positive', 'OP-789012', 98, 'hash_demo_def456ghi789'),
    ('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '88888888-8888-8888-8888-888888888888', 'Hemp Farms, Colorado', 'Organic Certified', 'USDA-345678', 97, 'hash_demo_ghi789jkl012')
ON CONFLICT (id) DO NOTHING;

-- Insert analytics data
INSERT INTO public.analytics (id, user_id, metric_type, metric_value, period_start, period_end) VALUES
    ('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '11111111-1111-1111-1111-111111111111', 'co2_saved', 156.5, '2024-01-01', '2024-01-31'),
    ('llllllll-llll-llll-llll-llllllllllll', '11111111-1111-1111-1111-111111111111', 'cost_savings', 2340.00, '2024-01-01', '2024-01-31'),
    ('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '11111111-1111-1111-1111-111111111111', 'packaging_efficiency', 89.2, '2024-01-01', '2024-01-31'),
    ('nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '22222222-2222-2222-2222-222222222222', 'co2_saved', 45.2, '2024-01-01', '2024-01-31'),
    ('oooooooo-oooo-oooo-oooo-oooooooooooo', '22222222-2222-2222-2222-222222222222', 'points_earned', 1250, '2024-01-01', '2024-01-31')
ON CONFLICT (id) DO NOTHING;

-- Create a view for dashboard stats if it doesn't exist
CREATE OR REPLACE VIEW public.dashboard_stats AS
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
