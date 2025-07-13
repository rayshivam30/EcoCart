"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, XCircle, Hash, Clock, MapPin } from "lucide-react"

interface BlockchainRecord {
  id: string
  packagingId: string
  materialOrigin: string
  certificationType: string
  certificationNumber: string
  sustainabilityScore: number
  verificationHash: string
  previousHash: string
  timestamp: number
  nonce: number
}

interface BlockchainTraceabilityProps {
  packagingId?: string
}

export default function BlockchainTraceability({ packagingId }: BlockchainTraceabilityProps) {
  const [verification, setVerification] = useState<{
    isValid: boolean
    record?: BlockchainRecord
    chainLength: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [chain, setChain] = useState<BlockchainRecord[]>([])

  const verifyRecord = async () => {
    if (!packagingId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/blockchain/traceability?packagingId=${packagingId}`)
      const result = await response.json()

      if (result.success) {
        setVerification(result.data)
      }
    } catch (error) {
      console.error("Error verifying blockchain record:", error)
    } finally {
      setLoading(false)
    }
  }

  const getChain = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/blockchain/traceability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "get_chain",
        }),
      })
      const result = await response.json()

      if (result.success) {
        setChain(result.data.chain)
      }
    } catch (error) {
      console.error("Error fetching blockchain chain:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (packagingId) {
      verifyRecord()
    }
    getChain()
  }, [packagingId])

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            Blockchain Traceability
          </CardTitle>
          <CardDescription>
            Verify packaging material authenticity and sustainability certifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {packagingId && verification ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {verification.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {verification.isValid ? "Verified" : "Verification Failed"}
                  </span>
                </div>
                <Badge variant={verification.isValid ? "default" : "destructive"}>
                  {verification.isValid ? "Valid" : "Invalid"}
                </Badge>
              </div>

              {verification.record && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Material Origin</label>
                      <p className="text-sm">{verification.record.materialOrigin}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Certification Type</label>
                      <p className="text-sm">{verification.record.certificationType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Certification Number</label>
                      <p className="text-sm font-mono">{verification.record.certificationNumber}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Sustainability Score</label>
                      <p className="text-sm">{verification.record.sustainabilityScore}/100</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Verification Hash</label>
                      <p className="text-sm font-mono">{truncateHash(verification.record.verificationHash)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Timestamp</label>
                      <p className="text-sm">{formatTimestamp(verification.record.timestamp)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {packagingId ? "Verifying blockchain record..." : "No packaging ID provided"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hash className="h-5 w-5" />
            Blockchain Chain
          </CardTitle>
          <CardDescription>
            View the complete blockchain ledger ({chain.length} blocks)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {chain.map((block, index) => (
              <div
                key={block.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Block #{index}</span>
                    <Badge variant="outline" className="text-xs">
                      {block.packagingId === "00000000-0000-0000-0000-000000000000" ? "Genesis" : "Data"}
                    </Badge>
                  </div>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Hash:</span>
                    <p className="font-mono">{truncateHash(block.verificationHash)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Previous:</span>
                    <p className="font-mono">{truncateHash(block.previousHash)}</p>
                  </div>
                  {block.packagingId !== "00000000-0000-0000-0000-000000000000" && (
                    <>
                      <div>
                        <span className="text-gray-600">Origin:</span>
                        <p className="truncate">{block.materialOrigin}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Certification:</span>
                        <p className="truncate">{block.certificationType}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={getChain}
          disabled={loading}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Blockchain</span>
        </Button>
      </div>
    </div>
  )
}

function RefreshCw({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
} 