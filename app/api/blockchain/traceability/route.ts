import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// In a real implementation, this would connect to a blockchain service like Hyperledger Fabric
// For demonstration, we'll simulate blockchain operations with cryptographic hashing

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

class BlockchainService {
  private chain: BlockchainRecord[] = []
  private difficulty = 4 // Number of leading zeros required

  constructor() {
    // Initialize with genesis block
    this.createGenesisBlock()
  }

  private createGenesisBlock() {
    const genesisBlock: BlockchainRecord = {
      id: "genesis",
      packagingId: "00000000-0000-0000-0000-000000000000",
      materialOrigin: "Genesis Block",
      certificationType: "GENESIS",
      certificationNumber: "GEN-000000",
      sustainabilityScore: 100,
      verificationHash: "0000000000000000000000000000000000000000000000000000000000000000",
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      timestamp: Date.now(),
      nonce: 0,
    }
    this.chain.push(genesisBlock)
  }

  private calculateHash(record: Omit<BlockchainRecord, "verificationHash">): string {
    const data = `${record.packagingId}${record.materialOrigin}${record.certificationType}${record.certificationNumber}${record.sustainabilityScore}${record.previousHash}${record.timestamp}${record.nonce}`
    return crypto.createHash("sha256").update(data).digest("hex")
  }

  private mineBlock(record: Omit<BlockchainRecord, "verificationHash">): BlockchainRecord {
    let nonce = 0
    let hash: string

    do {
      hash = this.calculateHash({ ...record, nonce })
      nonce++
    } while (!hash.startsWith("0".repeat(this.difficulty)))

    return {
      ...record,
      verificationHash: hash,
      nonce: nonce - 1,
    }
  }

  async addRecord(record: Omit<BlockchainRecord, "id" | "verificationHash" | "previousHash" | "timestamp" | "nonce">): Promise<BlockchainRecord> {
    const previousBlock = this.chain[this.chain.length - 1]
    
    const newRecord: Omit<BlockchainRecord, "verificationHash"> = {
      id: crypto.randomUUID(),
      ...record,
      previousHash: previousBlock.verificationHash,
      timestamp: Date.now(),
      nonce: 0,
    }

    const minedRecord = this.mineBlock(newRecord)
    this.chain.push(minedRecord)

    return minedRecord
  }

  async verifyRecord(packagingId: string): Promise<{ isValid: boolean; record?: BlockchainRecord; chain: BlockchainRecord[] }> {
    const record = this.chain.find(r => r.packagingId === packagingId)
    
    if (!record) {
      return { isValid: false, chain: this.chain }
    }

    // Verify the hash
    const calculatedHash = this.calculateHash({
      packagingId: record.packagingId,
      materialOrigin: record.materialOrigin,
      certificationType: record.certificationType,
      certificationNumber: record.certificationNumber,
      sustainabilityScore: record.sustainabilityScore,
      previousHash: record.previousHash,
      timestamp: record.timestamp,
      nonce: record.nonce,
    })

    const isValid = calculatedHash === record.verificationHash && 
                   calculatedHash.startsWith("0".repeat(this.difficulty))

    return { isValid, record, chain: this.chain }
  }

  async getChain(): Promise<BlockchainRecord[]> {
    return this.chain
  }
}

// Initialize blockchain service
const blockchainService = new BlockchainService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, packagingId, materialOrigin, certificationType, certificationNumber, sustainabilityScore } = body

    switch (action) {
      case "add":
        const newRecord = await blockchainService.addRecord({
          packagingId,
          materialOrigin,
          certificationType,
          certificationNumber,
          sustainabilityScore,
        })

        return NextResponse.json({
          success: true,
          data: {
            record: newRecord,
            message: "Record added to blockchain successfully",
          },
        })

      case "verify":
        const verification = await blockchainService.verifyRecord(packagingId)
        
        return NextResponse.json({
          success: true,
          data: {
            isValid: verification.isValid,
            record: verification.record,
            message: verification.isValid ? "Record verified successfully" : "Record verification failed",
          },
        })

      case "get_chain":
        const chain = await blockchainService.getChain()
        
        return NextResponse.json({
          success: true,
          data: {
            chain,
            length: chain.length,
          },
        })

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Blockchain operation error:", error)
    return NextResponse.json(
      { success: false, error: "Blockchain operation failed" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const packagingId = searchParams.get("packagingId")

    if (!packagingId) {
      return NextResponse.json(
        { success: false, error: "Packaging ID is required" },
        { status: 400 }
      )
    }

    const verification = await blockchainService.verifyRecord(packagingId)

    return NextResponse.json({
      success: true,
      data: {
        isValid: verification.isValid,
        record: verification.record,
        chainLength: verification.chain.length,
      },
    })
  } catch (error) {
    console.error("Blockchain verification error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to verify blockchain record" },
      { status: 500 }
    )
  }
} 