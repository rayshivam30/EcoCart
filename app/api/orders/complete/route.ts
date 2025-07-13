import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// POST /api/orders/complete
// Body: { orderId: string, userId: string }
export async function POST(request: NextRequest) {
  try {
    const { orderId, userId } = await request.json()
    if (!orderId || !userId) {
      return NextResponse.json({ success: false, error: "Missing orderId or userId" }, { status: 400 })
    }

    // 1. Mark order as completed
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single()
    if (orderError || !order) {
      return NextResponse.json({ success: false, error: "Order not found or update failed" }, { status: 404 })
    }

    // 2. Check if delivery was green (eco/EV/low-emission)
    const { data: route, error: routeError } = await supabase
      .from("routes")
      .select("id, vehicle_type, co2_estimate, co2_saved")
      .eq("id", order.route_id)
      .single()
    if (routeError || !route) {
      return NextResponse.json({ success: false, error: "Route not found for order" }, { status: 404 })
    }

    const isGreen = route.vehicle_type === "electric" || route.vehicle_type === "hybrid" || (route.co2_saved && route.co2_saved > 0)
    if (!isGreen) {
      return NextResponse.json({ success: true, message: "Order completed, but not a green delivery. No carbon credit awarded." })
    }

    // 3. Insert carbon credit for user (real CO2 saved)
    const co2Saved = route.co2_saved || 0
    if (co2Saved > 0) {
      const { error: creditError } = await supabase
        .from("carbon_credits")
        .insert([
          {
            user_id: userId,
            co2_saved: co2Saved,
            source: "Green Delivery",
            verified: true,
          },
        ])
      if (creditError) {
        return NextResponse.json({ success: false, error: "Failed to award carbon credit" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: `Order completed. Carbon credit awarded: ${co2Saved} kg CO2 saved.` })
  } catch (error) {
    console.error("Order completion error:", error)
    return NextResponse.json({ success: false, error: "Failed to complete order" }, { status: 500 })
  }
} 