import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let q = searchParams.get("q") || ""
    if (!q) {
      return NextResponse.json({ success: false, error: "Missing query" }, { status: 400 })
    }
    // Prefer India if not specified
    if (!q.toLowerCase().includes("india")) {
      q = q + ", India"
    }
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=5`
    const response = await fetch(url)
    const data = await response.json()
    const suggestions = data.map((item: any) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }))
    return NextResponse.json({ success: true, suggestions })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch suggestions" }, { status: 500 })
  }
} 