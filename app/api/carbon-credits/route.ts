import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET /api/carbon-credits?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 })
    }
    const { data, error } = await supabase
      .from("carbon_credits")
      .select("id, co2_saved, source, timestamp, verified")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
    if (error) {
      return NextResponse.json({ success: false, error: "Failed to fetch carbon credits" }, { status: 500 })
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch carbon credits" }, { status: 500 })
  }
} 