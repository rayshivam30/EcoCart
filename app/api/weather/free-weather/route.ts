import { type NextRequest, NextResponse } from "next/server"

// Free weather service using OpenWeatherMap API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const city = searchParams.get("city")

    if (!lat && !lng && !city) {
      return NextResponse.json(
        { success: false, error: "Location parameters required" },
        { status: 400 }
      )
    }

    let weatherUrl = ""
    
    if (lat && lng) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    } else if (city) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    }

    const weatherResponse = await fetch(weatherUrl)
    const weatherData = await weatherResponse.json()

    if (weatherData.cod !== 200) {
      return NextResponse.json(
        { success: false, error: "Weather data not found" },
        { status: 404 }
      )
    }

    // Calculate delivery impact based on weather
    const deliveryImpact = calculateDeliveryImpact(weatherData)
    const ecoRecommendations = generateEcoRecommendations(weatherData)

    const result = {
      location: {
        city: weatherData.name,
        country: weatherData.sys.country,
        lat: weatherData.coord.lat,
        lng: weatherData.coord.lon,
      },
      current: {
        temperature: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        wind_speed: weatherData.wind.speed,
        visibility: weatherData.visibility / 1000, // Convert to km
      },
      delivery_impact: deliveryImpact,
      eco_recommendations: ecoRecommendations,
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get weather data" },
      { status: 500 }
    )
  }
}

function calculateDeliveryImpact(weatherData: any) {
  const temp = weatherData.main.temp
  const conditions = weatherData.weather[0].main.toLowerCase()
  const windSpeed = weatherData.wind.speed
  const visibility = weatherData.visibility / 1000

  let impact = {
    level: "minimal",
    factors: [] as string[],
    delay_minutes: 0,
    eco_impact: "low",
  }

  // Temperature impact
  if (temp < -10 || temp > 40) {
    impact.level = "significant"
    impact.delay_minutes += 30
    impact.factors.push("extreme_temperature")
    impact.eco_impact = "high"
  } else if (temp < 0 || temp > 35) {
    impact.level = "moderate"
    impact.delay_minutes += 15
    impact.factors.push("temperature")
    impact.eco_impact = "medium"
  }

  // Weather conditions impact
  if (conditions.includes("rain") || conditions.includes("drizzle")) {
    impact.level = impact.level === "minimal" ? "moderate" : impact.level
    impact.delay_minutes += 10
    impact.factors.push("rain")
    impact.eco_impact = impact.eco_impact === "low" ? "medium" : impact.eco_impact
  } else if (conditions.includes("snow")) {
    impact.level = "significant"
    impact.delay_minutes += 45
    impact.factors.push("snow")
    impact.eco_impact = "high"
  } else if (conditions.includes("storm") || conditions.includes("thunderstorm")) {
    impact.level = "significant"
    impact.delay_minutes += 60
    impact.factors.push("storm")
    impact.eco_impact = "high"
  }

  // Wind impact
  if (windSpeed > 20) {
    impact.level = impact.level === "minimal" ? "moderate" : impact.level
    impact.delay_minutes += 5
    impact.factors.push("high_wind")
  }

  // Visibility impact
  if (visibility < 5) {
    impact.level = impact.level === "minimal" ? "moderate" : impact.level
    impact.delay_minutes += 10
    impact.factors.push("low_visibility")
  }

  return impact
}

function generateEcoRecommendations(weatherData: any) {
  const temp = weatherData.main.temp
  const conditions = weatherData.weather[0].main.toLowerCase()
  const recommendations = []

  // Temperature-based recommendations
  if (temp > 30) {
    recommendations.push({
      type: "vehicle",
      message: "Consider electric vehicles to reduce heat-related emissions",
      priority: "high",
    })
  } else if (temp < 5) {
    recommendations.push({
      type: "packaging",
      message: "Use insulated packaging to maintain product temperature",
      priority: "medium",
    })
  }

  // Weather-based recommendations
  if (conditions.includes("rain") || conditions.includes("snow")) {
    recommendations.push({
      type: "route",
      message: "Optimize routes to avoid flooded or icy areas",
      priority: "high",
    })
    recommendations.push({
      type: "packaging",
      message: "Use water-resistant eco-friendly packaging",
      priority: "medium",
    })
  }

  if (conditions.includes("storm")) {
    recommendations.push({
      type: "delivery",
      message: "Consider delaying non-urgent deliveries during storms",
      priority: "high",
    })
  }

  // General eco recommendations
  recommendations.push({
    type: "general",
    message: "Use real-time weather data to optimize delivery routes",
    priority: "medium",
  })

  return recommendations
} 