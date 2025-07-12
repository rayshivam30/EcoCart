-- Safe demo data seed for EcoCart platform with valid UUIDs and fixed column order
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

-- Insert demo products with valid UUIDs
INSERT INTO public.demo_products (id, name, category, length, width, height, weight, description, destination, demo_retailer_name) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Eco Wireless Headphones', 'electronics', 20.0, 15.0, 8.0, 300.0, 'Premium wireless headphones with sustainable materials', 'New York, NY', 'EcoTech Solutions'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Recycled Smartphone Case', 'electronics', 16.0, 8.0, 2.0, 50.0, 'Phone case made from 100% recycled ocean plastic', 'Los Angeles, CA', 'EcoTech Solutions'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Solar Bluetooth Speaker', 'electronics', 25.0, 12.0, 10.0, 800.0, 'Solar-powered waterproof Bluetooth speaker', 'Chicago, IL', 'EcoTech Solutions'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Bamboo Laptop Stand', 'electronics', 30.0, 25.0, 5.0, 1200.0, 'Adjustable bamboo laptop stand', 'Miami, FL', 'Green Electronics Co'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Organic Cotton USB Cable Set', 'electronics', 15.0, 10.0, 3.0, 150.0, 'USB cables with organic cotton braiding', 'Seattle, WA', 'Green Electronics Co')
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

-- Insert demo packaging suggestions with valid UUIDs
INSERT INTO public.demo_packaging_suggestions (id, demo_product_id, optimal_length, optimal_width, optimal_height, material, eco_score, cost_estimate, co2_reduction, packaging_efficiency) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 22.0, 17.0, 10.0, 'Recycled Cardboard', 88, 3.20, 2.3, 85.5),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 18.0, 10.0, 3.0, 'Biodegradable Plastic', 92, 2.10, 1.1, 90.2),
    ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 27.0, 14.0, 12.0, 'Hemp Fiber Composite', 95, 4.50, 3.2, 88.7),
    ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 32.0, 27.0, 7.0, 'Recycled Cardboard', 85, 5.80, 2.8, 82.3),
    ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 17.0, 12.0, 4.0, 'Biodegradable Plastic', 90, 1.80, 0.9, 88.9)
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

-- Insert demo routes with valid UUIDs
INSERT INTO public.demo_routes (id, demo_product_id, origin_address, destination_address, vehicle_type, distance, duration, co2_emissions, co2_saved, delivery_cost, optimized_route) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'EcoCart Warehouse, Newark, NJ', 'New York, NY', 'electric', 24.5, 35, 0.0, 4.2, 8.50, '{"waypoints": [{"lat": 40.7128, "lng": -74.0060}, {"lat": 40.7589, "lng": -73.9851}]}'),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'EcoCart Warehouse, Ontario, CA', 'Los Angeles, CA', 'hybrid', 28.3, 42, 1.8, 2.4, 7.20, '{"waypoints": [{"lat": 34.0522, "lng": -118.2437}, {"lat": 34.0639, "lng": -118.1467}]}'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'EcoCart Warehouse, Schaumburg, IL', 'Chicago, IL', 'electric', 32.1, 48, 0.0, 5.1, 9.20, '{"waypoints": [{"lat": 41.8781, "lng": -87.6298}, {"lat": 42.0333, "lng": -88.0834}]}'),
    ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'EcoCart Warehouse, Doral, FL', 'Miami, FL', 'electric', 18.7, 28, 0.0, 3.1, 6.80, '{"waypoints": [{"lat": 25.7617, "lng": -80.1918}, {"lat": 25.8197, "lng": -80.3242}]}'),
    ('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'EcoCart Warehouse, Bellevue, WA', 'Seattle, WA', 'hybrid', 22.4, 35, 1.2, 2.8, 7.50, '{"waypoints": [{"lat": 47.6062, "lng": -122.3321}, {"lat": 47.6101, "lng": -122.2015}]}')
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

-- Insert demo blockchain data with valid UUIDs
INSERT INTO public.demo_packaging_blockchain (id, demo_packaging_id, material_origin, certification_type, certification_number, sustainability_score, verification_hash) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Sustainable Forests, Oregon', 'FSC Certified', 'FSC-C123456', 95, 'hash_demo_abc123def456'),
    ('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Recycled Ocean Plastic, California', 'Ocean Positive', 'OP-789012', 98, 'hash_demo_def456ghi789'),
    ('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'Hemp Farms, Colorado', 'Organic Certified', 'USDA-345678', 97, 'hash_demo_ghi789jkl012'),
    ('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'Recycled Paper Mills, Wisconsin', 'FSC Recycled', 'FSC-R987654', 92, 'hash_demo_jkl012mno345'),
    ('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'Bioplastic Facility, Texas', 'Biodegradable Certified', 'BPI-567890', 94, 'hash_demo_mno345pqr678')
ON CONFLICT (id) DO NOTHING;

-- Create some sample demo orders and rewards (these don't need to reference real users)
CREATE TABLE IF NOT EXISTS public.demo_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    demo_product_id UUID REFERENCES public.demo_products(id) ON DELETE CASCADE,
    demo_packaging_id UUID REFERENCES public.demo_packaging_suggestions(id),
    demo_route_id UUID REFERENCES public.demo_routes(id),
    status TEXT CHECK (status IN ('pending', 'processing', 'in_transit', 'delivered', 'cancelled')) DEFAULT 'pending',
    delivery_type TEXT NOT NULL,
    eco_score INTEGER CHECK (eco_score >= 0 AND eco_score <= 100),
    total_co2_saved DECIMAL(10,2),
    points_earned INTEGER DEFAULT 0,
    customer_name TEXT,
    estimated_delivery DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert demo orders with correct column order
INSERT INTO public.demo_orders (
    id, 
    order_number, 
    demo_product_id, 
    demo_packaging_id, 
    demo_route_id, 
    status, 
    delivery_type, 
    eco_score, 
    total_co2_saved, 
    points_earned, 
    customer_name, 
    estimated_delivery
) VALUES
    ('990e8400-e29b-41d4-a716-446655440001', 'DEMO-001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'in_transit', 'EV Delivery', 88, 6.5, 150, 'Demo Customer', CURRENT_DATE + INTERVAL '2 days'),
    ('990e8400-e29b-41d4-a716-446655440002', 'DEMO-002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'delivered', 'Green Packaging', 92, 3.5, 75, 'Demo Customer', CURRENT_DATE - INTERVAL '3 days'),
    ('990e8400-e29b-41d4-a716-446655440003', 'DEMO-003', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 'processing', 'EV + Eco Packaging', 95, 8.3, 200, 'Demo Customer', CURRENT_DATE + INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

-- Create demo rewards table
CREATE TABLE IF NOT EXISTS public.demo_rewards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    demo_order_id UUID REFERENCES public.demo_orders(id) ON DELETE SET NULL,
    points INTEGER NOT NULL,
    action_type TEXT NOT NULL,
    description TEXT,
    customer_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert demo rewards
INSERT INTO public.demo_rewards (id, demo_order_id, points, action_type, description, customer_name) VALUES
    ('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 150, 'ev_delivery', 'Chose electric vehicle delivery', 'Demo Customer'),
    ('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 75, 'eco_packaging', 'Selected biodegradable packaging', 'Demo Customer'),
    ('aa0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440003', 200, 'combo_green', 'EV delivery + eco packaging combo', 'Demo Customer'),
    ('aa0e8400-e29b-41d4-a716-446655440004', NULL, 100, 'carbon_offset', 'Purchased carbon offset credits', 'Demo Customer'),
    ('aa0e8400-e29b-41d4-a716-446655440005', NULL, 50, 'referral', 'Referred a friend to EcoCart', 'Demo Customer')
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
