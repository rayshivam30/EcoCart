export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import * as tf from "@tensorflow/tfjs"

// Use a global variable to persist the model across hot reloads
const getGlobal = () => {
  return typeof globalThis !== "undefined" ? globalThis : global;
};
const globalAny = getGlobal();

async function loadModel() {
  if (!globalAny.packagingModel) {
    try {
      globalAny.packagingModel = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [5], units: 64, activation: "relu" }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 32, activation: "relu" }),
          tf.layers.dense({ units: 16, activation: "relu" }),
          tf.layers.dense({ units: 4, activation: "sigmoid" }),
        ],
      });
      globalAny.packagingModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: "meanSquaredError",
        metrics: ["accuracy"],
      });
      await trainModel(globalAny.packagingModel);
    } catch (error) {
      console.error("Error loading model:", error);
      // Fallback: try to use the existing model if available
      if (globalAny.packagingModel) {
        return globalAny.packagingModel;
      }
      return null;
    }
  }
  return globalAny.packagingModel;
}

async function trainModel(model: tf.LayersModel) {
  // Sample training data: [length, width, height, weight, category_encoded]
  const trainingData = [
    [10, 5, 3, 500, 1], // electronics
    [20, 15, 8, 300, 1], // electronics
    [16, 8, 2, 50, 1], // electronics
    [30, 25, 10, 1000, 2], // clothing
    [25, 20, 5, 800, 2], // clothing
    [15, 10, 4, 200, 3], // books
    [12, 8, 3, 150, 3], // books
    [40, 30, 15, 2000, 4], // furniture
    [35, 25, 12, 1800, 4], // furniture
    [8, 6, 2, 100, 5], // accessories
  ]

  // Corresponding outputs: [optimal_length, optimal_width, optimal_height, eco_score]
  const trainingLabels = [
    [12, 7, 5, 0.85], // 85% eco score
    [22, 17, 10, 0.88],
    [18, 10, 3, 0.92],
    [32, 27, 12, 0.82],
    [27, 22, 7, 0.85],
    [17, 12, 5, 0.90],
    [14, 10, 4, 0.88],
    [42, 32, 17, 0.78],
    [37, 27, 14, 0.80],
    [10, 8, 3, 0.95],
  ]

  const xs = tf.tensor2d(trainingData)
  const ys = tf.tensor2d(trainingLabels)

  await model.fit(xs, ys, {
    epochs: 100,
    batchSize: 4,
    validationSplit: 0.2,
    verbose: 0,
  })

  xs.dispose()
  ys.dispose()
}

function encodeCategory(category: string): number {
  const categoryMap: { [key: string]: number } = {
    electronics: 1,
    clothing: 2,
    books: 3,
    furniture: 4,
    accessories: 5,
    food: 6,
    beauty: 7,
    sports: 8,
    toys: 9,
    other: 10,
  }
  return categoryMap[category.toLowerCase()] || 10
}

function determineMaterial(category: string, weight: number, ecoScore: number): string {
  const materials = [
    { name: "Biodegradable Plastic", minEcoScore: 0.8, maxWeight: 200 },
    { name: "Recycled Cardboard", minEcoScore: 0.75, maxWeight: 1000 },
    { name: "Hemp Fiber Composite", minEcoScore: 0.9, maxWeight: 500 },
    { name: "Anti-Static Recycled Foam", minEcoScore: 0.7, maxWeight: 300 },
    { name: "Reinforced Recycled Cardboard", minEcoScore: 0.6, maxWeight: 2000 },
  ]

  // Filter materials based on eco score and weight
  const suitableMaterials = materials.filter(
    (material) => ecoScore >= material.minEcoScore && weight <= material.maxWeight
  )

  if (suitableMaterials.length === 0) {
    return "Recycled Cardboard" // Default fallback
  }

  // Return the material with the highest eco score
  return suitableMaterials.reduce((best, current) =>
    current.minEcoScore > best.minEcoScore ? current : best
  ).name
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { length, width, height, weight, category, destination } = body

    // Load the ML model
    const model = await loadModel()
    if (!model) {
      return NextResponse.json(
        { success: false, error: "Failed to load ML model" },
        { status: 500 }
      )
    }

    // Prepare input data for the model
    const inputData = [
      Number.parseFloat(length),
      Number.parseFloat(width),
      Number.parseFloat(height),
      Number.parseFloat(weight),
      encodeCategory(category),
    ]

    // Make prediction
    const inputTensor = tf.tensor2d([inputData])
    const prediction = model.predict(inputTensor) as tf.Tensor
    const predictionArray = await prediction.array()

    inputTensor.dispose()
    prediction.dispose()

    const [optimalLength, optimalWidth, optimalHeight, ecoScore] = predictionArray[0]

    // Calculate additional metrics
    const volume = Number.parseFloat(length) * Number.parseFloat(width) * Number.parseFloat(height)
    const weightNum = Number.parseFloat(weight)
    const material = determineMaterial(category, weightNum, ecoScore)

    // Calculate cost savings and CO2 reduction
    const costSavings = calculateCostSavings(volume, weightNum, ecoScore)
    const co2Reduction = calculateCO2Reduction(volume, weightNum, ecoScore)

    // Generate alternative materials
    const alternatives = generateAlternatives(category, weightNum, ecoScore)

    const suggestions = {
      optimalSize: {
        length: Math.ceil(optimalLength),
        width: Math.ceil(optimalWidth),
        height: Math.ceil(optimalHeight),
      },
      material: material,
      ecoScore: Math.round(ecoScore * 100),
      costSavings: costSavings,
      co2Reduction: co2Reduction,
      alternatives: alternatives,
      confidence: calculateConfidence(ecoScore, volume, weightNum),
    }

    return NextResponse.json({
      success: true,
      data: suggestions,
    })
  } catch (error) {
    console.error("ML packaging optimization error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process packaging optimization" },
      { status: 500 }
    )
  }
}

function calculateCostSavings(volume: number, weight: number, ecoScore: number): number {
  const baseCost = 5.0
  const volumeReduction = Math.max(0, (5000 - volume) / 5000)
  const weightReduction = Math.max(0, (1000 - weight) / 1000)
  const ecoBonus = ecoScore * 0.3

  return baseCost * (volumeReduction * 0.3 + weightReduction * 0.2 + ecoBonus)
}

function calculateCO2Reduction(volume: number, weight: number, ecoScore: number): number {
  const baseEmission = 3.5 // kg CO2
  const volumeReduction = Math.max(0, (5000 - volume) / 5000)
  const weightReduction = Math.max(0, (1000 - weight) / 1000)
  const ecoMultiplier = ecoScore

  return baseEmission * (volumeReduction * 0.4 + weightReduction * 0.3) * ecoMultiplier
}

function generateAlternatives(category: string, weight: number, primaryEcoScore: number) {
  const alternatives = [
    {
      material: "Recycled Cardboard",
      ecoScore: Math.round((primaryEcoScore * 0.9) * 100),
      cost: 3.2,
      co2Saved: 2.1,
    },
    {
      material: "Biodegradable Plastic",
      ecoScore: Math.round((primaryEcoScore * 0.85) * 100),
      cost: 3.8,
      co2Saved: 1.8,
    },
    {
      material: "Hemp Fiber",
      ecoScore: Math.round((primaryEcoScore * 1.05) * 100),
      cost: 4.5,
      co2Saved: 2.8,
    },
  ]

  return alternatives.filter((alt) => alt.ecoScore > 70) // Only show viable alternatives
}

function calculateConfidence(ecoScore: number, volume: number, weight: number): number {
  // Calculate confidence based on how well the model's prediction aligns with expected patterns
  const volumeConfidence = volume < 1000 ? 0.9 : volume < 5000 ? 0.8 : 0.7
  const weightConfidence = weight < 200 ? 0.9 : weight < 500 ? 0.8 : 0.7
  const ecoConfidence = ecoScore > 0.8 ? 0.9 : ecoScore > 0.6 ? 0.8 : 0.7

  return Math.round(((volumeConfidence + weightConfidence + ecoConfidence) / 3) * 100)
} 