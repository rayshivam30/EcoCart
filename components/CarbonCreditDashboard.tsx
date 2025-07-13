"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

interface CarbonCredit {
  id: string
  co2_saved: number
  source: string
  timestamp: string
  verified: boolean
}

export default function CarbonCreditDashboard({ userId }: { userId: string }) {
  const [credits, setCredits] = useState<CarbonCredit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) fetchCredits()
    // eslint-disable-next-line
  }, [userId])

  async function fetchCredits() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/carbon-credits?userId=${userId}`)
      const result = await res.json()
      if (result.success) {
        setCredits(result.data)
      } else {
        setError(result.error || "Failed to fetch carbon credits")
      }
    } catch (e) {
      setError("Failed to fetch carbon credits")
    } finally {
      setLoading(false)
    }
  }

  const totalCO2 = credits.reduce((sum, c) => sum + (c.verified ? c.co2_saved : 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carbon Credit Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-4">
              <span className="text-lg font-semibold">Total CO₂ Saved:</span>
              <span className="text-2xl font-bold text-green-700">{totalCO2.toFixed(2)} kg</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-1 text-left">Date</th>
                    <th className="px-2 py-1 text-left">Source</th>
                    <th className="px-2 py-1 text-right">CO₂ Saved (kg)</th>
                    <th className="px-2 py-1 text-center">Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {credits.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="px-2 py-1">{new Date(c.timestamp).toLocaleString()}</td>
                      <td className="px-2 py-1">{c.source}</td>
                      <td className="px-2 py-1 text-right">{c.co2_saved.toFixed(2)}</td>
                      <td className="px-2 py-1 text-center">
                        {c.verified ? (
                          <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Verified</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="h-4 w-4" /> Unverified</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {credits.length === 0 && <div className="text-center text-gray-500 mt-4">No carbon credits yet.</div>}
          </>
        )}
      </CardContent>
    </Card>
  )
} 