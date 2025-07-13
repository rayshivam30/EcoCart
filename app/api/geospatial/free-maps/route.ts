import { type NextRequest, NextResponse } from "next/server"

// Free routing service using OpenRouteService (no API key required for basic usage)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destination, vehicleType, priority } = body

    // Use OpenRouteService for free routing
    const coordinates = await getCoordinates(origin, destination)
    
    if (!coordinates) {
      return NextResponse.json(
        { success: false, error: "Could not get coordinates for locations" },
        { status: 400 }
      )
    }

    // Get route from OpenRouteService
    const routeResponse = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car/json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.OPENROUTE_API_KEY || "", // Optional, works without key for basic usage
        },
        body: JSON.stringify({
          coordinates: [
            [coordinates.origin.lng, coordinates.origin.lat],
            [coordinates.destination.lng, coordinates.destination.lat]
          ],
          format: "geojson",
          preference: priority === "eco" ? "green" : "fastest",
          units: "km"
        })
      }
    )

    const routeData = await routeResponse.json()

    if (!routeData.features || routeData.features.length === 0) {
      return NextResponse.json(
        { success: false, error: "No route found" },
        { status: 400 }
      )
    }

    const route = routeData.features[0]
    const properties = route.properties
    const distanceKm = properties.segments[0].distance / 1000
    const durationMinutes = properties.segments[0].duration / 60

    // Calculate emissions and costs
    const emissions = calculateEmissions(distanceKm, vehicleType)
    const co2Saved = calculateCO2Savings(distanceKm, vehicleType)
    const deliveryCost = calculateDeliveryCost(distanceKm, vehicleType)

    // Get alternative routes
    const alternatives = await getAlternativeRoutes(coordinates, vehicleType)

    const result = {
      optimizedRoute: {
        distance: distanceKm,
        duration: Math.round(durationMinutes),
        vehicleType: determineOptimalVehicle(vehicleType, priority),
        co2Emissions: emissions,
        co2Saved: co2Saved,
        cost: deliveryCost,
        polyline: route.geometry.coordinates.map((coord: number[]) => ({
          lat: coord[1],
          lng: coord[0]
        })),
        waypoints: generateWaypoints(route.geometry.coordinates),
      },
      alternatives: alternatives,
      trafficConditions: await getTrafficConditions(coordinates),
      weatherImpact: await getWeatherImpact(coordinates),
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Free maps routing error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to optimize route" },
      { status: 500 }
    )
  }
}

async function getCoordinates(origin: string, destination: string) {
  try {
    // Use Nominatim (OpenStreetMap geocoding) - completely free
    const originResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(origin)}&limit=1`
    )
    const originData = await originResponse.json()

    const destResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`
    )
    const destData = await destResponse.json()

    if (originData.length === 0 || destData.length === 0) {
      return null
    }

    return {
      origin: {
        lat: parseFloat(originData[0].lat),
        lng: parseFloat(originData[0].lon)
      },
      destination: {
        lat: parseFloat(destData[0].lat),
        lng: parseFloat(destData[0].lon)
      }
    }
  } catch (error) {
    console.error("Geocoding error:", error)
    return null
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

async function getAlternativeRoutes(coordinates: any, vehicleType: string) {
  try {
    const alternatives = []
    const vehicleTypes = ["electric", "hybrid", "standard"]

    for (const type of vehicleTypes) {
      if (type !== vehicleType) {
        const altResponse = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car/json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": process.env.OPENROUTE_API_KEY || "",
            },
            body: JSON.stringify({
              coordinates: [
                [coordinates.origin.lng, coordinates.origin.lat],
                [coordinates.destination.lng, coordinates.destination.lat]
              ],
              format: "geojson",
              preference: type === "electric" ? "green" : "fastest",
              units: "km"
            })
          }
        )
        const altData = await altResponse.json()

        if (altData.features && altData.features.length > 0) {
          const altRoute = altData.features[0]
          const altDistance = altRoute.properties.segments[0].distance / 1000

          alternatives.push({
            vehicleType: type.charAt(0).toUpperCase() + type.slice(1) + " Vehicle",
            distance: altDistance,
            duration: Math.round(altRoute.properties.segments[0].duration / 60),
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

function generateWaypoints(coordinates: number[][]) {
  return coordinates.map((coord, index) => ({
    lat: coord[1],
    lng: coord[0],
    name: index === 0 ? "Origin" : index === coordinates.length - 1 ? "Destination" : `Waypoint ${index}`,
  }))
}

async function getTrafficConditions(coordinates: any) {
  try {
    // Use free traffic data from OpenRouteService
    const trafficResponse = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car/json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": process.env.OPENROUTE_API_KEY || "",
        },
        body: JSON.stringify({
          coordinates: [
            [coordinates.origin.lng, coordinates.origin.lat],
            [coordinates.destination.lng, coordinates.destination.lat]
          ],
          format: "geojson",
          preference: "fastest",
          units: "km"
        })
      }
    )
    
    const trafficData = await trafficResponse.json()
    
    // Analyze route properties to estimate traffic
    if (trafficData.features && trafficData.features.length > 0) {
      const route = trafficData.features[0]
      const duration = route.properties.segments[0].duration / 60
      const distance = route.properties.segments[0].distance / 1000
      
      // Estimate traffic based on speed
      const avgSpeed = distance / (duration / 60) // km/h
      if (avgSpeed < 20) return "heavy"
      if (avgSpeed < 40) return "moderate"
      return "light"
    }
    
    return "moderate"
  } catch (error) {
    return "unknown"
  }
}

async function getWeatherImpact(coordinates: any) {
  try {
    // Use free OpenWeatherMap API
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.origin.lat}&lon=${coordinates.origin.lng}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    )
    
    const weatherData = await weatherResponse.json()
    
    if (weatherData.main && weatherData.weather) {
      const temp = weatherData.main.temp
      const conditions = weatherData.weather[0].main.toLowerCase()
      
      if (conditions.includes("rain") || conditions.includes("snow")) {
        return "significant"
      } else if (temp < 0 || temp > 35) {
        return "moderate"
      } else {
        return "minimal"
      }
    }
    
    return "minimal"
  } catch (error) {
    return "unknown"
  }
} 