import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// API endpoint to set up demo data for authenticated users
export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing userId or role" }, { status: 400 })
    }

    // Call the database function to set up demo data
    const { error } = await supabase.rpc("setup_demo_data_for_user", {
      user_id: userId,
      user_role: role,
    })

    if (error) {
      console.error("Error setting up demo data:", error)
      return NextResponse.json({ error: "Failed to set up demo data" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Demo data set up successfully" })
  } catch (error) {
    console.error("Error in demo setup:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Get demo data for display (when no real user is authenticated)
export async function GET() {
  try {
    // Fetch demo products
    const { data: demoProducts, error: productsError } = await supabase
      .from("demo_products")
      .select(`
        *,
        demo_packaging_suggestions (*),
        demo_routes (*),
        demo_packaging_blockchain:demo_packaging_suggestions (
          demo_packaging_blockchain (*)
        )
      `)
      .limit(5)

    if (productsError) {
      console.error("Error fetching demo products:", productsError)
      return NextResponse.json({ error: "Failed to fetch demo data" }, { status: 500 })
    }

    // Transform the data to match the expected format
    const transformedData = {
      products:
        demoProducts?.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          dimensions: `${product.length}x${product.width}x${product.height} cm`,
          weight: `${product.weight}g`,
          ecoScore: product.demo_packaging_suggestions?.[0]?.eco_score || 85,
          packaging: product.demo_packaging_suggestions?.[0]?.material || "Eco-friendly",
          co2Saved: `${product.demo_routes?.[0]?.co2_saved || 2.5} kg`,
          retailer: product.demo_retailer_name,
        })) || [],
      stats: {
        totalProducts: demoProducts?.length || 0,
        avgEcoScore: 87,
        totalCO2Saved: "156.5 kg",
        costSavings: "$2,340",
      },
    }

    return NextResponse.json({ success: true, data: transformedData })
  } catch (error) {
    console.error("Error fetching demo data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
