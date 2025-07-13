import { type NextRequest, NextResponse } from "next/server"

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destination, vehicleType, priority } = body

    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Google Maps API key not configured" },
        { status: 500 }
      )
    }

    // Get directions from Google Maps API
    const directionsResponse = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        origin
      )}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`
    )

    const directionsData = await directionsResponse.json()

    if (directionsData.status !== "OK") {
      return NextResponse.json(
        { success: false, error: `Google Maps API error: ${directionsData.status}` },
        { status: 400 }
      )
    }

    const route = directionsData.routes[0]
    const leg = route.legs[0]

    // Calculate CO2 emissions based on vehicle type and distance
    const distanceKm = leg.distance.value / 1000
    const durationMinutes = leg.duration.value / 60

    const emissions = calculateEmissions(distanceKm, vehicleType)
    const co2Saved = calculateCO2Savings(distanceKm, vehicleType)
    const deliveryCost = calculateDeliveryCost(distanceKm, vehicleType)

    // Get alternative routes
    const alternatives = await getAlternativeRoutes(origin, destination, vehicleType)

    const routeData = {
      optimizedRoute: {
        distance: distanceKm,
        duration: Math.round(durationMinutes),
        vehicleType: determineOptimalVehicle(vehicleType, priority),
        co2Emissions: emissions,
        co2Saved: co2Saved,
        cost: deliveryCost,
        polyline: route.overview_polyline.points,
        waypoints: route.legs[0].steps.map((step: any) => ({
          lat: step.start_location.lat,
          lng: step.start_location.lng,
          name: step.maneuver.instruction,
        })),
      },
      alternatives: alternatives,
      trafficConditions: await getTrafficConditions(origin, destination),
      weatherImpact: await getWeatherImpact(origin, destination),
    }

    return NextResponse.json({
      success: true,
      data: routeData,
    })
  } catch (error) {
    console.error("Route optimization error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to optimize route" },
      { status: 500 }
    )
  }
}

function calculateEmissions(distanceKm: number, vehicleType: string): number {
  const emissionFactors = {
    electric: 0, // kg CO2 per km
    hybrid: 0.08,
    standard: 0.18,
  }

  return distanceKm * (emissionFactors[vehicleType as keyof typeof emissionFactors] || 0.15)
}

function calculateCO2Savings(distanceKm: number, vehicleType: string): number {
  const standardEmissions = distanceKm * 0.18
  const actualEmissions = calculateEmissions(distanceKm, vehicleType)
  return Math.max(0, standardEmissions - actualEmissions)
}

function calculateDeliveryCost(distanceKm: number, vehicleType: string): number {
  const baseCost = 5.0
  const costFactors = {
    electric: 0.15,
    hybrid: 0.12,
    standard: 0.1,
  }

  return baseCost + distanceKm * (costFactors[vehicleType as keyof typeof costFactors] || 0.12)
}

function determineOptimalVehicle(requested: string, priority: string): string {
  if (priority === "eco") return "electric"
  if (priority === "speed") return "hybrid"
  if (priority === "cost") return "standard"
  return "electric" // Default to eco-friendly
}

async function getAlternativeRoutes(origin: string, destination: string, vehicleType: string) {
  try {
    const alternatives = []
    const vehicleTypes = ["electric", "hybrid", "standard"]

    for (const type of vehicleTypes) {
      if (type !== vehicleType) {
        const altResponse = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
            origin
          )}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`
        )
        const altData = await altResponse.json()

        if (altData.status === "OK" && altData.routes.length > 0) {
          const altRoute = altData.routes[0]
          const altLeg = altRoute.legs[0]
          const altDistance = altLeg.distance.value / 1000

          alternatives.push({
            vehicleType: type.charAt(0).toUpperCase() + type.slice(1) + " Vehicle",
            distance: altDistance,
            duration: Math.round(altLeg.duration.value / 60),
            co2Emissions: calculateEmissions(altDistance, type),
            co2Saved: calculateCO2Savings(altDistance, type),
            cost: calculateDeliveryCost(altDistance, type),
          })
        }
      }
    }

    return alternatives
  } catch (error) {
    console.error("Error getting alternative routes:", error)
    return []
  }
}

async function getTrafficConditions(origin: string, destination: string) {
  try {
    // This would require additional Google Maps API calls for traffic data
    // For now, return a mock response
    return "moderate"
  } catch (error) {
    return "unknown"
  }
}

async function getWeatherImpact(origin: string, destination: string) {
  try {
    // This would require weather API integration
    // For now, return a mock response
    return "minimal"
  } catch (error) {
    return "unknown"
  }
} 