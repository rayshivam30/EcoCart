"use client"

import type React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, Upload, TrendingUp, Route, BarChart3, Plus, Eye, Settings, Bell, Shield } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import BlockchainTraceability from "@/components/BlockchainTraceability"
import { supabase } from "@/lib/supabase"
import { usePathname, useRouter } from "next/navigation";

export default function RetailerDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("overview")
  const [isUploading, setIsUploading] = useState(false)
  const [productForm, setProductForm] = useState({
    name: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    category: "",
    destination: "",
    description: "",
  })

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        !session?.user &&
        pathname !== "/auth" &&
        pathname !== "/auth?mode=signup"
      ) {
        router.push("/auth");
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router, pathname]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsUploading(false);
        throw new Error("User not authenticated");
      }
      // 1. Create the product in Supabase with retailer_id
      const { data: createdProduct, error: productError } = await supabase
        .from("products")
        .insert([
          {
            name: productForm.name,
            length: productForm.length,
            width: productForm.width,
            height: productForm.height,
            weight: productForm.weight,
            category: productForm.category,
            destination: productForm.destination,
            description: productForm.description,
            retailer_id: user.id, // <-- Pass the authenticated user's ID
          },
        ])
        .select()
        .single()
      if (productError || !createdProduct) {
        console.error("Supabase product insert error:", productError);
        setIsUploading(false)
        throw new Error("Failed to create product")
      }
      const productId = createdProduct.id

      // 2. Call the real ML packaging API
      const response = await fetch("/api/ai/packaging-ml", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          length: productForm.length,
          width: productForm.width,
          height: productForm.height,
          weight: productForm.weight,
          category: productForm.category,
          destination: productForm.destination,
        }),
      })
      const result = await response.json()

      if (result.success) {
        // 3. Store the packaging suggestion in Supabase with the real product ID
        const packagingResponse = await fetch("/api/packaging/suggestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            ...result.data,
          }),
        })

        // Add blockchain record for traceability
        if (packagingResponse.ok) {
          const packagingData = await packagingResponse.json()
          await fetch("/api/blockchain/traceability", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "add",
              packagingId: packagingData.id,
              materialOrigin: "Sustainable Forests, Oregon",
              certificationType: "FSC Certified",
              certificationNumber: `FSC-${Date.now()}`,
              sustainabilityScore: result.data.ecoScore,
            }),
          })
        }
      }

      setIsUploading(false)
      setActiveTab("suggestions")
    } catch (error) {
      console.error("Error processing product:", error)
      setIsUploading(false)
    }
  }

  const mockProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      dimensions: "20x15x8 cm",
      weight: "300g",
      ecoScore: 85,
      packaging: "Recycled Cardboard",
      co2Saved: "2.3 kg",
    },
    {
      id: 2,
      name: "Smartphone Case",
      dimensions: "16x8x2 cm",
      weight: "50g",
      ecoScore: 92,
      packaging: "Biodegradable Plastic",
      co2Saved: "1.1 kg",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Responsive Header */}
      <header className="bg-white border-b">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <span className="text-lg sm:text-xl font-bold">EcoCart</span>
              <span className="hidden sm:inline">Retailer</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              Pro Plan
            </Badge>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              R
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile-Responsive Sidebar */}
        <aside className="w-full lg:w-64 bg-white border-b lg:border-r lg:border-b-0 lg:min-h-screen">
          {/* Mobile: Horizontal scroll, Desktop: Vertical */}
          <nav className="p-4 flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-x-visible">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start text-sm whitespace-nowrap"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </Button>
            <Button
              variant={activeTab === "upload" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start text-sm whitespace-nowrap"
              onClick={() => setActiveTab("upload")}
            >
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
            <Button
              variant={activeTab === "suggestions" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start text-sm whitespace-nowrap"
              onClick={() => setActiveTab("suggestions")}
            >
              <Package className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">AI Suggestions</span>
            </Button>
            <Button
              variant={activeTab === "routes" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start text-sm whitespace-nowrap"
              onClick={() => setActiveTab("routes")}
            >
              <Route className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Routes</span>
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start text-sm whitespace-nowrap"
              onClick={() => setActiveTab("analytics")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
            <Button
              variant={activeTab === "blockchain" ? "default" : "ghost"}
              className="flex-shrink-0 lg:w-full justify-start text-sm whitespace-nowrap"
              onClick={() => setActiveTab("blockchain")}
            >
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Blockchain</span>
            </Button>
          </nav>
        </aside>

        {/* Main Content - Mobile Responsive */}
        <main className="flex-1 p-4 sm:p-6">
          {activeTab === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-2">Monitor your eco-logistics performance</p>
              </div>

              {/* Mobile-Responsive Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">1,247</div>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">CO2 Saved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">2.4 tons</div>
                    <p className="text-xs text-green-600">+28% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Avg Eco Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">87</div>
                    <p className="text-xs text-green-600">+5 points improved</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Cost Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">$12,450</div>
                    <p className="text-xs text-green-600">+18% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Mobile-Responsive Recent Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Products</CardTitle>
                  <CardDescription className="text-sm">Your latest product optimizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg space-y-3 sm:space-y-0"
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm sm:text-base truncate">{product.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {product.dimensions} • {product.weight}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-4">
                          <div className="text-right">
                            <div className="text-xs sm:text-sm font-medium">Eco Score: {product.ecoScore}</div>
                            <div className="text-xs text-green-600">CO2 Saved: {product.co2Saved}</div>
                          </div>
                          <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Upload Products</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-2">
                  Add new products for AI packaging optimization
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Product Details</CardTitle>
                  <CardDescription className="text-sm">
                    Enter product information to get AI-powered packaging and delivery recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    {/* Mobile-stacked form fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm">
                          Product Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="e.g., Wireless Headphones"
                          className="h-10"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm">
                          Category
                        </Label>
                        <Select
                          value={productForm.category}
                          onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="books">Books</SelectItem>
                            <SelectItem value="home">Home & Garden</SelectItem>
                            <SelectItem value="toys">Toys</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Responsive dimension inputs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="length" className="text-xs sm:text-sm">
                          Length (cm)
                        </Label>
                        <Input
                          id="length"
                          type="number"
                          placeholder="20"
                          className="h-10 text-sm"
                          value={productForm.length}
                          onChange={(e) => setProductForm({ ...productForm, length: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width" className="text-xs sm:text-sm">
                          Width (cm)
                        </Label>
                        <Input
                          id="width"
                          type="number"
                          placeholder="15"
                          className="h-10 text-sm"
                          value={productForm.width}
                          onChange={(e) => setProductForm({ ...productForm, width: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height" className="text-xs sm:text-sm">
                          Height (cm)
                        </Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="8"
                          className="h-10 text-sm"
                          value={productForm.height}
                          onChange={(e) => setProductForm({ ...productForm, height: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight" className="text-xs sm:text-sm">
                          Weight (g)
                        </Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="300"
                          className="h-10 text-sm"
                          value={productForm.weight}
                          onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination</Label>
                      <Input
                        id="destination"
                        placeholder="e.g., New York, NY"
                        value={productForm.destination}
                        onChange={(e) => setProductForm({ ...productForm, destination: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Additional product details..."
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 h-10 sm:h-11"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing with AI...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Get AI Recommendations
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "suggestions" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Packaging Suggestions</h1>
                <p className="text-gray-600 mt-2">Optimized packaging recommendations for your products</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-green-600" />
                      <span>Recommended Packaging</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-800">Optimal Size: 22x17x10 cm</h3>
                      <p className="text-sm text-green-600 mt-1">15% smaller than standard packaging</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-800">Material: Recycled Cardboard</h3>
                      <p className="text-sm text-blue-600 mt-1">100% recyclable, FSC certified</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Eco Score</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={88} className="w-20" />
                        <span className="text-sm font-medium">88/100</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Route className="h-5 w-5 text-blue-600" />
                      <span>Delivery Optimization</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-800">Route: EV Priority</h3>
                      <p className="text-sm text-blue-600 mt-1">Electric vehicle recommended</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-800">CO2 Savings: 2.3 kg</h3>
                      <p className="text-sm text-green-600 mt-1">65% reduction vs standard delivery</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Efficiency Score</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={92} className="w-20" />
                        <span className="text-sm font-medium">92/100</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Cost-Benefit Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">$3.20</div>
                      <div className="text-sm text-gray-600">Packaging Cost</div>
                      <div className="text-xs text-green-600 mt-1">-15% vs standard</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">$8.50</div>
                      <div className="text-sm text-gray-600">Delivery Cost</div>
                      <div className="text-xs text-green-600 mt-1">-8% vs standard</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-800">$11.70</div>
                      <div className="text-sm text-green-600">Total Cost</div>
                      <div className="text-xs text-green-600 mt-1">-12% savings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "routes" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Route Optimization</h1>
                <p className="text-gray-600 mt-2">Carbon-optimized delivery routes</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Route Map</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Route className="h-12 w-12 mx-auto mb-2" />
                        <p>Interactive route map would be displayed here</p>
                        <p className="text-sm">Integration with Google Maps API</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Route Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-green-800">Vehicle Type</div>
                      <div className="text-lg font-bold text-green-900">Electric Van</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Distance</div>
                      <div className="text-lg font-bold text-blue-900">24.5 km</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm font-medium text-purple-800">Est. Time</div>
                      <div className="text-lg font-bold text-purple-900">35 min</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-green-800">CO2 Saved</div>
                      <div className="text-lg font-bold text-green-900">4.2 kg</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-2">Track your sustainability impact</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Monthly CO2 Saved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">156 kg</div>
                    <Progress value={78} className="mt-2" />
                    <p className="text-xs text-green-600 mt-1">+23% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Packaging Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">89%</div>
                    <Progress value={89} className="mt-2" />
                    <p className="text-xs text-green-600 mt-1">+5% improvement</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">EV Deliveries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">67%</div>
                    <Progress value={67} className="mt-2" />
                    <p className="text-xs text-green-600 mt-1">+12% increase</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Cost Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2,340</div>
                    <Progress value={85} className="mt-2" />
                    <p className="text-xs text-green-600 mt-1">+18% this month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sustainability Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                        <p>Chart showing CO2 savings over time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Eco-Friendly Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-600">Score: {product.ecoScore}</div>
                            </div>
                          </div>
                          <Badge variant="secondary">{product.co2Saved} saved</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "blockchain" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Blockchain Traceability</h1>
                <p className="text-gray-600 mt-2">Verify packaging material authenticity and sustainability</p>
              </div>
              <BlockchainTraceability packagingId="temp-packaging-id" />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
