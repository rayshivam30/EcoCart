-- Update EcoCart Database Schema
-- This script safely updates the existing database schema

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if profiles table exists and add missing columns if needed
DO $$ 
BEGIN
    -- Add company_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'company_name') THEN
        ALTER TABLE public.profiles ADD COLUMN company_name TEXT;
    END IF;
    
    -- Add role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT CHECK (role IN ('retailer', 'customer', 'admin')) DEFAULT 'customer';
    END IF;
END $$;

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    length DECIMAL(10,2) NOT NULL, -- in cm
    width DECIMAL(10,2) NOT NULL,  -- in cm
    height DECIMAL(10,2) NOT NULL, -- in cm
    weight DECIMAL(10,2) NOT NULL, -- in grams
    description TEXT,
    destination TEXT NOT NULL,
    retailer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create packaging suggestions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.packaging_suggestions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    optimal_length DECIMAL(10,2) NOT NULL,
    optimal_width DECIMAL(10,2) NOT NULL,
    optimal_height DECIMAL(10,2) NOT NULL,
    material TEXT NOT NULL,
    eco_score INTEGER CHECK (eco_score >= 0 AND eco_score <= 100),
    cost_estimate DECIMAL(10,2),
    co2_reduction DECIMAL(10,2), -- kg CO2 saved
    packaging_efficiency DECIMAL(5,2), -- percentage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create routes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    origin_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    vehicle_type TEXT CHECK (vehicle_type IN ('electric', 'hybrid', 'standard')) NOT NULL,
    distance DECIMAL(10,2) NOT NULL, -- in km
    duration INTEGER NOT NULL, -- in minutes
    co2_emissions DECIMAL(10,2) NOT NULL, -- kg CO2
    co2_saved DECIMAL(10,2) NOT NULL, -- kg CO2 saved vs standard
    delivery_cost DECIMAL(10,2) NOT NULL,
    optimized_route JSONB, -- Store route waypoints
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    packaging_id UUID REFERENCES public.packaging_suggestions(id),
    route_id UUID REFERENCES public.routes(id),
    status TEXT CHECK (status IN ('pending', 'processing', 'in_transit', 'delivered', 'cancelled')) DEFAULT 'pending',
    delivery_type TEXT NOT NULL,
    eco_score INTEGER CHECK (eco_score >= 0 AND eco_score <= 100),
    total_co2_saved DECIMAL(10,2),
    points_earned INTEGER DEFAULT 0,
    estimated_delivery DATE,
    actual_delivery DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rewards table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    points INTEGER NOT NULL,
    action_type TEXT NOT NULL, -- 'ev_delivery', 'eco_packaging', 'carbon_offset', etc.
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blockchain tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.packaging_blockchain (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    packaging_id UUID REFERENCES public.packaging_suggestions(id) ON DELETE CASCADE,
    material_origin TEXT NOT NULL,
    certification_type TEXT NOT NULL,
    certification_number TEXT NOT NULL,
    sustainability_score INTEGER CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
    verification_hash TEXT NOT NULL, -- Simulated blockchain hash
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL, -- 'co2_saved', 'cost_savings', 'eco_score', etc.
    metric_value DECIMAL(10,2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_products_retailer_id ON public.products(retailer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_type ON public.analytics(metric_type);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packaging_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packaging_blockchain ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Retailers can manage own products" ON public.products;
DROP POLICY IF EXISTS "Customers can view products" ON public.products;
DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Retailers can view orders for their products" ON public.orders;
DROP POLICY IF EXISTS "Users can view own rewards" ON public.rewards;

-- Recreate policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Retailers can manage own products" ON public.products
    FOR ALL USING (auth.uid() = retailer_id);

CREATE POLICY "Customers can view products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Customers can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Retailers can view orders for their products" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.products 
            WHERE products.id = orders.product_id 
            AND products.retailer_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own rewards" ON public.rewards
    FOR SELECT USING (auth.uid() = user_id);

-- Create or replace functions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist and recreate them
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS handle_products_updated_at ON public.products;
DROP TRIGGER IF EXISTS handle_orders_updated_at ON public.orders;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate triggers
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Only create the auth trigger if we have access to auth.users
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
EXCEPTION
    WHEN insufficient_privilege THEN
        -- Ignore if we don't have access to auth schema
        NULL;
END $$;
