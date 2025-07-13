import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  full_name?: string
  company_name?: string
  role: "retailer" | "customer" | "admin"
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  category: string
  length: number
  width: number
  height: number
  weight: number
  description?: string
  destination: string
  retailer_id: string
  created_at: string
  updated_at: string
}

export interface PackagingSuggestion {
  id: string
  product_id: string
  optimal_length: number
  optimal_width: number
  optimal_height: number
  material: string
  eco_score: number
  cost_estimate: number
  co2_reduction: number
  packaging_efficiency: number
  created_at: string
}

export interface Route {
  id: string
  product_id: string
  origin_address: string
  destination_address: string
  vehicle_type: "electric" | "hybrid" | "standard"
  distance: number
  duration: number
  co2_emissions: number
  co2_saved: number
  delivery_cost: number
  optimized_route: any
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_id: string
  product_id: string
  packaging_id?: string
  route_id?: string
  status: "pending" | "processing" | "in_transit" | "delivered" | "cancelled"
  delivery_type: string
  eco_score: number
  total_co2_saved: number
  points_earned: number
  estimated_delivery?: string
  actual_delivery?: string
  created_at: string
  updated_at: string
}

export interface Reward {
  id: string
  user_id: string
  order_id?: string
  points: number
  action_type: string
  description?: string
  created_at: string
}

// Helper functions for database operations
export const dbHelpers = {
  // Get user profile
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    return data
  },

  // Update user profile (for preferences/settings)
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single()
    if (error) {
      console.error("Error updating profile:", error)
      return null
    }
    return data
  },

  // Get products for retailer
  async getRetailerProducts(retailerId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("retailer_id", retailerId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return []
    }

    return data || []
  },

  // Get orders for customer
  async getCustomerOrders(customerId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        products:product_id (name, category),
        packaging_suggestions:packaging_id (material, eco_score),
        routes:route_id (vehicle_type, co2_saved)
      `)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      return []
    }

    return data || []
  },

  // Get rewards for user
  async getUserRewards(userId: string): Promise<Reward[]> {
    const { data, error } = await supabase
      .from("rewards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching rewards:", error)
      return []
    }

    return data || []
  },

  // Create new product
  async createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product | null> {
    const { data, error } = await supabase.from("products").insert([product]).select().single()

    if (error) {
      console.error("Error creating product:", error)
      return null
    }

    return data
  },

  // Create packaging suggestion
  async createPackagingSuggestion(
    suggestion: Omit<PackagingSuggestion, "id" | "created_at">,
  ): Promise<PackagingSuggestion | null> {
    const { data, error } = await supabase.from("packaging_suggestions").insert([suggestion]).select().single()

    if (error) {
      console.error("Error creating packaging suggestion:", error)
      return null
    }

    return data
  },

  // Get analytics data
  async getAnalytics(userId: string, metricType?: string) {
    let query = supabase.from("analytics").select("*").eq("user_id", userId)

    if (metricType) {
      query = query.eq("metric_type", metricType)
    }

    const { data, error } = await query.order("period_start", { ascending: false })

    if (error) {
      console.error("Error fetching analytics:", error)
      return []
    }

    return data || []
  },
}
