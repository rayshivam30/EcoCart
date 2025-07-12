-- Safe demo data seed for EcoCart platform
-- This script creates demo data without violating foreign key constraints

-- First, let's create a temporary demo data structure that doesn't depend on auth.users
-- We'll create demo products and other data that can work independently

-- Create demo products (without retailer_id initially)
CREATE TABLE IF NOT EXISTS public.demo_products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    length DECIMAL(10,2) NOT NULL,
    width DECIMAL(10,2) NOT NULL,
    height DECIMAL(10,2) NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    description TEXT,
    destination TEXT NOT NULL,
    demo_retailer_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert demo products
INSERT INTO public.demo_products (id, name, category, length, width, height, weight, description, destination, demo_retailer_name) VALUES
    ('33333333-3333-3333-3333-333333333333', 'Eco Wireless Headphones', 'electronics', 20.0, 15.0, 8.0, 300.0, 'Premium wireless headphones with sustainable materials', 'New York, NY', 'EcoTech Solutions'),
    ('44444444-4444-4444-4444-444444444444', 'Recycled Smartphone Case', 'electronics', 16.0, 8.0, 2.0, 50.0, 'Phone case made from 100% recycled ocean plastic', 'Los Angeles, CA', 'EcoTech Solutions'),
    ('55555555-5555-5555-5555-555555555555', 'Solar Bluetooth Speaker', 'electronics', 25.0, 12.0, 10.0, 800.0, 'Solar-powered waterproof Bluetooth speaker', 'Chicago, IL', 'EcoTech Solutions'),
    ('66666666-6666-6666-6666-666666666666', 'Bamboo Laptop Stand', 'electronics', 30.0, 25.0, 5.0, 1200.0, 'Adjustable bamboo laptop stand', 'Miami, FL', 'Green Electronics Co'),
    ('77777777-7777-7777-7777-777777777777', 'Organic Cotton USB Cable Set', 'electronics', 15.0, 10.0, 3.0, 150.0, 'USB cables with organic cotton braiding', 'Seattle, WA', 'Green Electronics Co')
ON CONFLICT (id) DO NOTHING;

-- Create demo packaging suggestions (referencing demo_products)
CREATE TABLE IF NOT EXISTS public.demo_packaging_suggestions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    demo_product_id UUID REFERENCES public.demo_products(id) ON DELETE CASCADE,
    optimal_length DECIMAL(10,2) NOT NULL,
    optimal_width DECIMAL(10,2) NOT NULL,
    optimal_height DECIMAL(10,2) NOT NULL,
    material TEXT NOT NULL,
    eco_score INTEGER CHECK (eco_score >= 0 AND eco_score <= 100),
    cost_estimate DECIMAL(10,2),
    co2_reduction DECIMAL(10,2),
    packaging_efficiency DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert demo packaging suggestions
INSERT INTO public.demo_packaging_suggestions (id, demo_product_id, optimal_length, optimal_width, optimal_height, material, eco_score, cost_estimate, co2_reduction, packaging_efficiency) VALUES
    ('88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 22.0, 17.0, 10.0, 'Recycled Cardboard', 88, 3.20, 2.3, 85.5),
    ('99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 18.0, 10.0, 3.0, 'Biodegradable Plastic', 92, 2.10, 1.1, 90.2),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 27.0, 14.0, 12.0, 'Hemp Fiber Composite', 95, 4.50, 3.2, 88.7),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '66666666-6666-6666-6666-666666666666', 32.0, 27.0, 7.0, 'Recycled Cardboard', 85, 5.80, 2.8, 82.3),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '77777777-7777-7777-7777-777777777777', 17.0, 12.0, 4.0, 'Biodegradable Plastic', 90, 1.80, 0.9, 88.9)
ON CONFLICT (id) DO NOTHING;

-- Create demo routes
CREATE TABLE IF NOT EXISTS public.demo_routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    demo_product_id UUID REFERENCES public.demo_products(id) ON DELETE CASCADE,
    origin_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    vehicle_type TEXT CHECK (vehicle_type IN ('electric', 'hybrid', 'standard')) NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL,
    co2_emissions DECIMAL(10,2) NOT NULL,
    co2_saved DECIMAL(10,2) NOT NULL,
    delivery_cost DECIMAL(10,2) NOT NULL,
    optimized_route JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert demo routes
INSERT INTO public.demo_routes (id, demo_product_id, origin_address, destination_address, vehicle_type, distance, duration, co2_emissions, co2_saved, delivery_cost, optimized_route) VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'EcoCart Warehouse, Newark, NJ', 'New York, NY', 'electric', 24.5, 35, 0.0, 4.2, 8.50, '{"waypoints": [{"lat": 40.7128, "lng": -74.0060}, {"lat": 40.7589, "lng": -73.9851}]}'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'EcoCart Warehouse, Ontario, CA', 'Los Angeles, CA', 'hybrid', 28.3, 42, 1.8, 2.4, 7.20, '{"waypoints": [{"lat": 34.0522, "lng": -118.2437}, {"lat": 34.0639, "lng": -118.1467}]}'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', 'EcoCart Warehouse, Schaumburg, IL', 'Chicago, IL', 'electric', 32.1, 48, 0.0, 5.1, 9.20, '{"waypoints": [{"lat": 41.8781, "lng": -87.6298}, {"lat": 42.0333, "lng": -88.0834}]}'),
    ('gggggggg-gggg-gggg-gggg-gggggggggggg', '66666666-6666-6666-6666-666666666666', 'EcoCart Warehouse, Doral, FL', 'Miami, FL', 'electric', 18.7, 28, 0.0, 3.1, 6.80, '{"waypoints": [{"lat": 25.7617, "lng": -80.1918}, {"lat": 25.8197, "lng": -80.3242}]}'),
    ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '77777777-7777-7777-7777-777777777777', 'EcoCart Warehouse, Bellevue, WA', 'Seattle, WA', 'hybrid', 22.4, 35, 1.2, 2.8, 7.50, '{"waypoints": [{"lat": 47.6062, "lng": -122.3321}, {"lat": 47.6101, "lng": -122.2015}]}')
ON CONFLICT (id) DO NOTHING;

-- Create demo blockchain tracking
CREATE TABLE IF NOT EXISTS public.demo_packaging_blockchain (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    demo_packaging_id UUID REFERENCES public.demo_packaging_suggestions(id) ON DELETE CASCADE,
    material_origin TEXT NOT NULL,
    certification_type TEXT NOT NULL,
    certification_number TEXT NOT NULL,
    sustainability_score INTEGER CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
    verification_hash TEXT NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert demo blockchain data
INSERT INTO public.demo_packaging_blockchain (id, demo_packaging_id, material_origin, certification_type, certification_number, sustainability_score, verification_hash) VALUES
    ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '88888888-8888-8888-8888-888888888888', 'Sustainable Forests, Oregon', 'FSC Certified', 'FSC-C123456', 95, 'hash_demo_abc123def456'),
    ('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '99999999-9999-9999-9999-999999999999', 'Recycled Ocean Plastic, California', 'Ocean Positive', 'OP-789012', 98, 'hash_demo_def456ghi789'),
    ('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hemp Farms, Colorado', 'Organic Certified', 'USDA-345678', 97, 'hash_demo_ghi789jkl012'),
    ('llllllll-llll-llll-llll-llllllllllll', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Recycled Paper Mills, Wisconsin', 'FSC Recycled', 'FSC-R987654', 92, 'hash_demo_jkl012mno345'),
    ('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Bioplastic Facility, Texas', 'Biodegradable Certified', 'BPI-567890', 94, 'hash_demo_mno345pqr678')
ON CONFLICT (id) DO NOTHING;

-- Create a function to migrate demo data to real tables when a user signs up
CREATE OR REPLACE FUNCTION public.setup_demo_data_for_user(user_id UUID, user_role TEXT)
RETURNS VOID AS $$
DECLARE
    demo_product RECORD;
    new_product_id UUID;
    demo_packaging RECORD;
    demo_route RECORD;
BEGIN
    -- Only set up demo data for retailers
    IF user_role = 'retailer' THEN
        -- Copy demo products to real products table
        FOR demo_product IN SELECT * FROM public.demo_products LIMIT 3 LOOP
            INSERT INTO public.products (
                name, category, length, width, height, weight, 
                description, destination, retailer_id
            ) VALUES (
                demo_product.name, demo_product.category, demo_product.length, 
                demo_product.width, demo_product.height, demo_product.weight,
                demo_product.description, demo_product.destination, user_id
            ) RETURNING id INTO new_product_id;
            
            -- Copy corresponding packaging suggestions
            FOR demo_packaging IN 
                SELECT * FROM public.demo_packaging_suggestions 
                WHERE demo_product_id = demo_product.id 
            LOOP
                INSERT INTO public.packaging_suggestions (
                    product_id, optimal_length, optimal_width, optimal_height,
                    material, eco_score, cost_estimate, co2_reduction, packaging_efficiency
                ) VALUES (
                    new_product_id, demo_packaging.optimal_length, demo_packaging.optimal_width,
                    demo_packaging.optimal_height, demo_packaging.material, demo_packaging.eco_score,
                    demo_packaging.cost_estimate, demo_packaging.co2_reduction, demo_packaging.packaging_efficiency
                );
            END LOOP;
            
            -- Copy corresponding routes
            FOR demo_route IN 
                SELECT * FROM public.demo_routes 
                WHERE demo_product_id = demo_product.id 
            LOOP
                INSERT INTO public.routes (
                    product_id, origin_address, destination_address, vehicle_type,
                    distance, duration, co2_emissions, co2_saved, delivery_cost, optimized_route
                ) VALUES (
                    new_product_id, demo_route.origin_address, demo_route.destination_address,
                    demo_route.vehicle_type, demo_route.distance, demo_route.duration,
                    demo_route.co2_emissions, demo_route.co2_saved, demo_route.delivery_cost,
                    demo_route.optimized_route
                );
            END LOOP;
        END LOOP;
        
        -- Add some analytics data
        INSERT INTO public.analytics (user_id, metric_type, metric_value, period_start, period_end) VALUES
            (user_id, 'co2_saved', 156.5, '2024-01-01', '2024-01-31'),
            (user_id, 'cost_savings', 2340.00, '2024-01-01', '2024-01-31'),
            (user_id, 'packaging_efficiency', 89.2, '2024-01-01', '2024-01-31');
            
    ELSIF user_role = 'customer' THEN
        -- Add some reward points and analytics for customers
        INSERT INTO public.rewards (user_id, points, action_type, description) VALUES
            (user_id, 150, 'welcome_bonus', 'Welcome to EcoCart! Here are your starter points.'),
            (user_id, 100, 'demo_action', 'Demo reward for choosing eco-friendly options');
            
        INSERT INTO public.analytics (user_id, metric_type, metric_value, period_start, period_end) VALUES
            (user_id, 'co2_saved', 45.2, '2024-01-01', '2024-01-31'),
            (user_id, 'points_earned', 250, '2024-01-01', '2024-01-31');
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Update the handle_new_user function to include demo data setup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
BEGIN
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
    
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        user_role
    );
    
    -- Set up demo data for the new user
    PERFORM public.setup_demo_data_for_user(NEW.id, user_role);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
