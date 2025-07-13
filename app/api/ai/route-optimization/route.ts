import { type NextRequest, NextResponse } from "next/server"

// Free route optimization service using OpenRouteService
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destination, vehicleType, priority } = body

    // Call the free maps API (OpenRouteService)
    const response = await fetch("/api/geospatial/free-maps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin,
        destination,
        vehicleType,
        priority,
      }),
    })

    const result = await response.json()

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to optimize route" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("Route optimization error:", error)
    return NextResponse.json({ success: false, error: "Failed to optimize route" }, { status: 500 })
  }
}

function calculateDistance(origin: string, destination: string): number {
  // Mock distance calculation
  return Math.random() * 30 + 15 // 15-45 km
}

function calculateDuration(origin: string, destination: string, vehicleType: string): number {
  const baseTime = Math.random() * 20 + 25 // 25-45 minutes

  // EV might take slightly longer due to charging considerations
  if (vehicleType === "electric") return Math.ceil(baseTime * 1.1)

  return Math.ceil(baseTime)
}

function determineOptimalVehicle(requested: string, priority: string): string {
  if (priority === "eco") return "Electric Van"
  if (priority === "speed") return "Hybrid Truck"
  if (priority === "cost") return "Standard Van"

  return "Electric Van" // Default to eco-friendly
}

function calculateEmissions(origin: string, destination: string, vehicleType: string): number {
  const distance = calculateDistance(origin, destination)

  switch (vehicleType) {
    case "electric":
      return 0
    case "hybrid":
      return distance * 0.08 // kg CO2 per km
    case "standard":
      return distance * 0.18 // kg CO2 per km
    default:
      return distance * 0.15
  }
}

function calculateCO2Savings(origin: string, destination: string, vehicleType: string): number {
  const distance = calculateDistance(origin, destination)
  const standardEmissions = distance * 0.18
  const actualEmissions = calculateEmissions(origin, destination, vehicleType)

  return Math.max(0, standardEmissions - actualEmissions)
}

function calculateDeliveryCost(origin: string, destination: string, vehicleType: string): number {
  const distance = calculateDistance(origin, destination)
  const baseCost = 5.0

  switch (vehicleType) {
    case "electric":
      return baseCost + distance * 0.15
    case "hybrid":
      return baseCost + distance * 0.12
    case "standard":
      return baseCost + distance * 0.1
    default:
      return baseCost + distance * 0.12
  }
}

function generateWaypoints(origin: string, destination: string): Array<{ lat: number; lng: number; name: string }> {
  // Mock waypoints for route visualization
  return [
    { lat: 40.7128, lng: -74.006, name: "Origin" },
    { lat: 40.7589, lng: -73.9851, name: "Waypoint 1" },
    { lat: 40.7831, lng: -73.9712, name: "Destination" },
  ]
}
