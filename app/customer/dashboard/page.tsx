"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Leaf, Award, TrendingUp, MapPin, Star, Gift, Truck, CheckCircle } from "lucide-react"

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("orders")

  const mockOrders = [
    {
      id: "ORD-001",
      product: "Wireless Headphones",
      status: "In Transit",
      deliveryType: "EV Delivery",
      co2Saved: "2.3 kg",
      points: 150,
      estimatedDelivery: "2 days",
      ecoScore: 88,
    },
    {
      id: "ORD-002",
      product: "Smartphone Case",
      status: "Delivered",
      deliveryType: "Green Packaging",
      co2Saved: "1.1 kg",
      points: 75,
      estimatedDelivery: "Delivered",
      ecoScore: 92,
    },
  ]

  const rewardHistory = [
    { date: "2024-01-15", action: "EV Delivery Choice", points: 150 },
    { date: "2024-01-12", action: "Eco Packaging Option", points: 75 },
    { date: "2024-01-08", action: "Carbon Offset Purchase", points: 200 },
    { date: "2024-01-05", action: "Green Delivery Selection", points: 100 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Responsive Header */}
      <header className="bg-white border-b">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <span className="text-lg sm:text-xl font-bold">EcoCart</span>
              <span className="hidden sm:inline">Customer</span>
            </div>
            <Badge className="bg-green-100 text-green-800 text-xs">Eco Warrior</Badge>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2 bg-green-50 px-2 sm:px-3 py-1 rounded-full">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <span className="text-xs sm:text-sm font-medium text-green-800">1,250 Points</span>
            </div>
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              C
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Track your orders and environmental impact</p>
        </div>

        {/* Mobile-Responsive Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">24</div>
              <p className="text-xs text-green-600">+3 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">CO2 Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">45.2 kg</div>
              <p className="text-xs text-green-600">Lifetime savings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Reward Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">1,250</div>
              <p className="text-xs text-green-600">+325 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Eco Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">89</div>
              <p className="text-xs text-green-600">Excellent rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile-Responsive Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="orders" className="text-xs sm:text-sm py-2">
              My Orders
            </TabsTrigger>
            <TabsTrigger value="rewards" className="text-xs sm:text-sm py-2">
              Rewards
            </TabsTrigger>
            <TabsTrigger value="impact" className="text-xs sm:text-sm py-2">
              Impact
            </TabsTrigger>
            <TabsTrigger value="preferences" className="text-xs sm:text-sm py-2">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
                <CardDescription className="text-sm">Track your eco-friendly deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm sm:text-base">{order.product}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Order #{order.id}</p>
                          </div>
                        </div>
                        <Badge
                          variant={order.status === "Delivered" ? "default" : "secondary"}
                          className="text-xs self-start sm:self-center"
                        >
                          {order.status}
                        </Badge>
                      </div>

                      {/* Mobile-stacked order details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                        <div>
                          <div className="text-gray-600">Delivery Type</div>
                          <div className="font-medium flex items-center">
                            <Truck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-green-600" />
                            <span className="truncate">{order.deliveryType}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">CO2 Saved</div>
                          <div className="font-medium text-green-600">{order.co2Saved}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Points Earned</div>
                          <div className="font-medium text-purple-600">+{order.points}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Delivery</div>
                          <div className="font-medium">{order.estimatedDelivery}</div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs sm:text-sm text-gray-600">Eco Score:</span>
                          <Progress value={order.ecoScore} className="w-16 sm:w-20" />
                          <span className="text-xs sm:text-sm font-medium">{order.ecoScore}/100</span>
                        </div>
                        <Button variant="outline" size="sm" className="self-start sm:self-center bg-transparent">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Track
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span>Your Rewards</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-purple-600 mb-2">1,250</div>
                    <div className="text-gray-600">Available Points</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">$5 Discount</span>
                      </div>
                      <div className="text-sm text-purple-600">500 pts</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Carbon Offset</span>
                      </div>
                      <div className="text-sm text-green-600">300 pts</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Premium Delivery</span>
                      </div>
                      <div className="text-sm text-blue-600">800 pts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reward History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {rewardHistory.map((reward, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{reward.action}</div>
                          <div className="text-xs text-gray-600">{reward.date}</div>
                        </div>
                        <div className="text-green-600 font-medium">+{reward.points}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <span>Environmental Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-1">45.2 kg</div>
                      <div className="text-sm text-green-800">Total CO2 Saved</div>
                      <div className="text-xs text-gray-600 mt-1">Equivalent to planting 2 trees</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">18</div>
                        <div className="text-xs text-blue-800">EV Deliveries</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">24</div>
                        <div className="text-xs text-purple-800">Eco Packages</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CO2 Reduction Goal</span>
                        <span>8.5/10 kg</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Green Deliveries</span>
                        <span>7/10 orders</span>
                      </div>
                      <Progress value={70} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Eco Score Target</span>
                        <span>89/90</span>
                      </div>
                      <Progress value={98} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Impact Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <p>Environmental impact chart over time</p>
                    <p className="text-sm">CO2 savings, deliveries, and eco score trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Preferences</CardTitle>
                <CardDescription>Set your eco-friendly delivery options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Prioritize EV Delivery</h3>
                    <p className="text-sm text-gray-600">Choose electric vehicles when available</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    Enabled
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Eco-Friendly Packaging</h3>
                    <p className="text-sm text-gray-600">Use biodegradable and recycled materials</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    Enabled
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Carbon Offset</h3>
                    <p className="text-sm text-gray-600">Automatically offset delivery emissions</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Consolidated Delivery</h3>
                    <p className="text-sm text-gray-600">Group orders to reduce trips</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    Enabled
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Eco Impact Updates</h3>
                    <p className="text-sm text-gray-600">Weekly sustainability reports</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    On
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Reward Notifications</h3>
                    <p className="text-sm text-gray-600">Points earned and available rewards</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    On
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Green Delivery Options</h3>
                    <p className="text-sm text-gray-600">Notify when eco options are available</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    On
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
