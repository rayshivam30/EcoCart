import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      productId,
      optimalSize,
      material,
      ecoScore,
      costSavings,
      co2Reduction,
      alternatives,
      confidence,
    } = body

    // Insert packaging suggestion into database
    const { data, error } = await supabase
      .from("packaging_suggestions")
      .insert([
        {
          product_id: productId,
          optimal_length: optimalSize.length,
          optimal_width: optimalSize.width,
          optimal_height: optimalSize.height,
          material: material,
          eco_score: ecoScore,
          cost_estimate: costSavings,
          co2_reduction: co2Reduction,
          packaging_efficiency: confidence,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating packaging suggestion:", error)
      return NextResponse.json(
        { success: false, error: "Failed to create packaging suggestion" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error("Packaging suggestion error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create packaging suggestion" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("packaging_suggestions")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching packaging suggestions:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch packaging suggestions" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data,
    })
  } catch (error) {
    console.error("Packaging suggestions fetch error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch packaging suggestions" },
      { status: 500 }
    )
  }
} 