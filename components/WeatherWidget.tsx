"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Eye } from "lucide-react"

interface WeatherData {
  location: {
    city: string
    country: string
    lat: number
    lng: number
  }
  current: {
    temperature: number
    feels_like: number
    humidity: number
    pressure: number
    description: string
    icon: string
    wind_speed: number
    visibility: number
  }
  delivery_impact: {
    level: string
    factors: string[]
    delay_minutes: number
    eco_impact: string
  }
  eco_recommendations: Array<{
    type: string
    message: string
    priority: string
  }>
}

interface WeatherWidgetProps {
  location?: string
  lat?: number
  lng?: number
}

export default function WeatherWidget({ location, lat, lng }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (location || (lat && lng)) {
      fetchWeatherData()
    }
  }, [location, lat, lng])

  const fetchWeatherData = async () => {
    setLoading(true)
    setError(null)

    try {
      let url = "/api/weather/free-weather?"
      if (lat && lng) {
        url += `lat=${lat}&lng=${lng}`
      } else if (location) {
        url += `city=${encodeURIComponent(location)}`
      }

      const response = await fetch(url)
      const result = await response.json()

      if (result.success) {
        setWeatherData(result.data)
      } else {
        setError(result.error || "Failed to fetch weather data")
      }
    } catch (err) {
      setError("Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase()
    if (desc.includes("rain") || desc.includes("drizzle")) return <CloudRain className="h-6 w-6" />
    if (desc.includes("snow")) return <CloudSnow className="h-6 w-6" />
    if (desc.includes("cloud")) return <Cloud className="h-6 w-6" />
    return <Sun className="h-6 w-6" />
  }

  const getImpactColor = (level: string) => {
    switch (level) {
      case "significant":
        return "bg-red-100 text-red-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const getEcoImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={fetchWeatherData}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            <p>Enter a location to see weather data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getWeatherIcon(weatherData.current.description)}
          Weather Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location */}
        <div className="text-sm text-gray-600">
          {weatherData.location.city}, {weatherData.location.country}
        </div>

        {/* Current Weather */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(weatherData.current.temperature)}°C
            </div>
            <div className="text-sm text-gray-600">
              Feels like {Math.round(weatherData.current.feels_like)}°C
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Wind className="h-4 w-4" />
              {weatherData.current.wind_speed} m/s
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4" />
              {weatherData.current.visibility} km visibility
            </div>
            <div className="text-sm">
              Humidity: {weatherData.current.humidity}%
            </div>
          </div>
        </div>

        {/* Delivery Impact */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Delivery Impact</h4>
          <div className="flex items-center gap-2">
            <Badge className={getImpactColor(weatherData.delivery_impact.level)}>
              {weatherData.delivery_impact.level}
            </Badge>
            {weatherData.delivery_impact.delay_minutes > 0 && (
              <span className="text-sm text-gray-600">
                +{weatherData.delivery_impact.delay_minutes} min delay
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getEcoImpactColor(weatherData.delivery_impact.eco_impact)}>
              Eco Impact: {weatherData.delivery_impact.eco_impact}
            </Badge>
          </div>
        </div>

        {/* Eco Recommendations */}
        {weatherData.eco_recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Eco Recommendations</h4>
            <div className="space-y-1">
              {weatherData.eco_recommendations.slice(0, 2).map((rec, index) => (
                <div key={index} className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                  {rec.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 