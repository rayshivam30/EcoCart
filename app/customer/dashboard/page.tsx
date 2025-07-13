"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Leaf, Award, TrendingUp, MapPin, Star, Gift, Truck, CheckCircle, Info } from "lucide-react"
import { supabase, dbHelpers, Order } from "@/lib/supabase"
import { Switch } from "@/components/ui/switch"

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("orders")
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)
  const [rewards, setRewards] = useState([])
  const [rewardsLoading, setRewardsLoading] = useState(false)
  const [rewardsError, setRewardsError] = useState<string | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)
  const [impactLoading, setImpactLoading] = useState(false)
  const [impactError, setImpactError] = useState<string | null>(null)
  const [totalCO2, setTotalCO2] = useState(0)
  const [evDeliveries, setEvDeliveries] = useState(0)
  const [ecoPackages, setEcoPackages] = useState(0)
  const [co2Goal, setCo2Goal] = useState(10)
  const [co2ThisMonth, setCo2ThisMonth] = useState(0)
  const [greenDeliveriesGoal, setGreenDeliveriesGoal] = useState(10)
  const [greenDeliveriesThisMonth, setGreenDeliveriesThisMonth] = useState(0)
  const [ecoScoreTarget, setEcoScoreTarget] = useState(90)
  const [ecoScore, setEcoScore] = useState(0)
  const [impactTimeline, setImpactTimeline] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [savingPref, setSavingPref] = useState(false)
  const [showDemoBanner, setShowDemoBanner] = useState(true)

  const defaultPrefs = {
    prioritizeEvDelivery: false,
    ecoPackaging: false,
    carbonOffset: false,
    consolidatedDelivery: false,
    ecoImpactUpdates: false,
    rewardNotifications: false,
    greenDeliveryOptions: false,
  }
  const [prefs, setPrefs] = useState(defaultPrefs)

  // Fetch orders for logged-in customer
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true)
    setOrdersError(null)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user || userError) {
      setOrdersError("Not authenticated.")
      setOrdersLoading(false)
      return
    }
    try {
      const ordersData = await dbHelpers.getCustomerOrders(user.id)
      setOrders(ordersData)
    } catch (err: any) {
      setOrdersError(err.message || "Failed to fetch orders.")
    }
    setOrdersLoading(false)
  }, [])

  // Fetch rewards for logged-in customer
  const fetchRewards = useCallback(async () => {
    setRewardsLoading(true)
    setRewardsError(null)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user || userError) {
      setRewardsError("Not authenticated.")
      setRewardsLoading(false)
      return
    }
    try {
      const rewardsData = await dbHelpers.getUserRewards(user.id)
      setRewards(rewardsData)
      setTotalPoints(rewardsData.reduce((sum, r) => sum + (r.points || 0), 0))
    } catch (err: any) {
      setRewardsError(err.message || "Failed to fetch rewards.")
    }
    setRewardsLoading(false)
  }, [])

  const fetchImpact = useCallback(async () => {
    setImpactLoading(true)
    setImpactError(null)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user || userError) {
      setImpactError("Not authenticated.")
      setImpactLoading(false)
      return
    }
    try {
      // Fetch analytics
      const analytics = await dbHelpers.getAnalytics(user.id)
      const co2SavedMetric = analytics.find(a => a.metric_type === 'co2_saved')
      setTotalCO2(co2SavedMetric ? Number(co2SavedMetric.metric_value) : 0)
      // Find this month's CO2 saved
      const now = new Date()
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
      const co2ThisMonthMetric = analytics.find(a => a.metric_type === 'co2_saved' && a.period_start === thisMonth)
      setCo2ThisMonth(co2ThisMonthMetric ? Number(co2ThisMonthMetric.metric_value) : 0)
      // Eco score
      const ecoScoreMetric = analytics.find(a => a.metric_type === 'eco_score')
      setEcoScore(ecoScoreMetric ? Math.round(Number(ecoScoreMetric.metric_value)) : 0)
      // Fetch orders for EV/eco stats
      const orders = await dbHelpers.getCustomerOrders(user.id)
      const evs = orders.filter(o => o.routes?.vehicle_type === 'electric').length
      setEvDeliveries(evs)
      setGreenDeliveriesThisMonth(evs) // For progress bar
      // Eco packages: count orders with eco/bio/recycled in packaging material
      const ecoPkgs = orders.filter(o => {
        const mat = o.packaging_suggestions?.material?.toLowerCase() || ''
        return mat.includes('eco') || mat.includes('bio') || mat.includes('recycled')
      }).length
      setEcoPackages(ecoPkgs)
      // Timeline: use analytics co2_saved by period_start
      const timeline = analytics.filter(a => a.metric_type === 'co2_saved').map(a => ({
        date: a.period_start,
        value: Number(a.metric_value)
      }))
      setImpactTimeline(timeline)
    } catch (err: any) {
      setImpactError(err.message || "Failed to fetch impact data.")
    }
    setImpactLoading(false)
  }, [])

  const fetchProfile = useCallback(async () => {
    setProfileLoading(true)
    setProfileError(null)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user || userError) {
      setProfileError("Not authenticated.")
      setProfileLoading(false)
      return
    }
    try {
      const prof = await dbHelpers.getProfile(user.id)
      setProfile(prof)
      setPrefs({
        prioritizeEvDelivery: !!prof?.prioritizeEvDelivery,
        ecoPackaging: !!prof?.ecoPackaging,
        carbonOffset: !!prof?.carbonOffset,
        consolidatedDelivery: !!prof?.consolidatedDelivery,
        ecoImpactUpdates: !!prof?.ecoImpactUpdates,
        rewardNotifications: !!prof?.rewardNotifications,
        greenDeliveryOptions: !!prof?.greenDeliveryOptions,
      })
    } catch (err: any) {
      setProfileError(err.message || "Failed to fetch profile.")
    }
    setProfileLoading(false)
  }, [])

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders()
    }
    if (activeTab === "rewards") {
      fetchRewards()
    }
    if (activeTab === "impact") {
      fetchImpact()
    }
    if (activeTab === "preferences") {
      fetchProfile()
    }
  }, [activeTab, fetchOrders, fetchRewards, fetchImpact, fetchProfile])

  const handlePrefChange = async (key: keyof typeof prefs, value: boolean) => {
    setSavingPref(true)
    setPrefs((prev) => ({ ...prev, [key]: value }))
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setProfileError("Not authenticated.")
      setSavingPref(false)
      return
    }
    const updates: any = {}
    updates[key] = value
    await dbHelpers.updateProfile(user.id, updates)
    setSavingPref(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showDemoBanner && (
        <div className="flex items-center justify-between bg-green-100 border-b border-green-300 px-4 py-2 text-green-900 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <Info className="h-4 w-4 text-green-700" />
            <span>Demo Mode: Starter points and impact stats are preloaded for a better first-time experience.</span>
          </div>
          <button onClick={() => setShowDemoBanner(false)} className="ml-4 text-green-700 hover:text-green-900">✕</button>
        </div>
      )}
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
              <span className="text-xs sm:text-sm font-medium text-green-800">
                {rewardsLoading ? 'Loading...' : rewardsError ? '0 Points' : `${totalPoints.toLocaleString()} Points`}
              </span>
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
              {ordersLoading ? (
                <div className="text-gray-600">Loading...</div>
              ) : ordersError ? (
                <div className="text-red-600 font-medium">—</div>
              ) : (
                <div className="text-lg sm:text-2xl font-bold">{orders.length}</div>
              )}
              <p className="text-xs text-green-600">{orders.length > 0 ? `+${orders.filter(o => new Date(o.created_at).getMonth() === new Date().getMonth()).length} this month` : ''}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">CO2 Saved</CardTitle>
            </CardHeader>
            <CardContent>
              {impactLoading ? (
                <div className="text-gray-600">Loading...</div>
              ) : impactError ? (
                <div className="text-red-600 font-medium">—</div>
              ) : (
                <div className="text-lg sm:text-2xl font-bold">{totalCO2} kg</div>
              )}
              <p className="text-xs text-green-600">Lifetime savings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Reward Points</CardTitle>
            </CardHeader>
            <CardContent>
              {rewardsLoading ? (
                <div className="text-gray-600">Loading...</div>
              ) : rewardsError ? (
                <div className="text-red-600 font-medium">—</div>
              ) : (
                <div className="text-lg sm:text-2xl font-bold">{totalPoints}</div>
              )}
              <p className="text-xs text-green-600">{rewards.length > 0 ? `+${rewards.filter(r => new Date(r.created_at).getMonth() === new Date().getMonth()).reduce((sum, r) => sum + (r.points || 0), 0)} this month` : ''}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Eco Score</CardTitle>
            </CardHeader>
            <CardContent>
              {impactLoading ? (
                <div className="text-gray-600">Loading...</div>
              ) : impactError ? (
                <div className="text-red-600 font-medium">—</div>
              ) : (
                <div className="text-lg sm:text-2xl font-bold">{ecoScore}</div>
              )}
              <p className="text-xs text-green-600">{ecoScore > 0 ? 'Excellent rating' : ''}</p>
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
                {ordersLoading ? (
                  <div className="text-gray-600">Loading orders...</div>
                ) : ordersError ? (
                  <div className="text-red-600 font-medium">{ordersError}</div>
                ) : (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-gray-500">No orders found.</div>
                    ) : (
                      orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-sm sm:text-base">{order.products?.name || "Product"}</h3>
                                <p className="text-xs sm:text-sm text-gray-600">Order #{order.order_number}</p>
                          </div>
                        </div>
                        <Badge
                              variant={order.status === "delivered" ? "default" : "secondary"}
                          className="text-xs self-start sm:self-center"
                        >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                        <div>
                          <div className="text-gray-600">Delivery Type</div>
                          <div className="font-medium flex items-center">
                            <Truck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-green-600" />
                                <span className="truncate">{order.delivery_type}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">CO2 Saved</div>
                              <div className="font-medium text-green-600">{order.routes?.co2_saved ? `${order.routes.co2_saved} kg` : "—"}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Points Earned</div>
                              <div className="font-medium text-purple-600">+{order.points_earned}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Delivery</div>
                              <div className="font-medium">{order.estimated_delivery ? order.estimated_delivery : "—"}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs sm:text-sm text-gray-600">Eco Score:</span>
                              <Progress value={order.packaging_suggestions?.eco_score || 0} className="w-16 sm:w-20" />
                              <span className="text-xs sm:text-sm font-medium">{order.packaging_suggestions?.eco_score || 0}/100</span>
                        </div>
                        <Button variant="outline" size="sm" className="self-start sm:self-center bg-transparent">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Track
                        </Button>
                      </div>
                    </div>
                      ))
                    )}
                </div>
                )}
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
                    {rewardsLoading ? (
                      <div className="text-gray-600">Loading points...</div>
                    ) : rewardsError ? (
                      <div className="text-red-600 font-medium">{rewardsError}</div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-purple-600 mb-2">{totalPoints}</div>
                    <div className="text-gray-600">Available Points</div>
                      </>
                    )}
                  </div>
                  {/* Static reward options remain for now */}
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
                  {rewardsLoading ? (
                    <div className="text-gray-600">Loading rewards...</div>
                  ) : rewardsError ? (
                    <div className="text-red-600 font-medium">{rewardsError}</div>
                  ) : (
                  <div className="space-y-3">
                      {rewards.length === 0 ? (
                        <div className="text-gray-500">No rewards found.</div>
                      ) : (
                        rewards.map((reward, index) => (
                          <div key={reward.id || index} className="flex items-center justify-between">
                        <div>
                              <div className="font-medium text-sm">{reward.action_type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</div>
                              <div className="text-xs text-gray-600">{reward.created_at ? new Date(reward.created_at).toLocaleDateString() : ""}</div>
                        </div>
                        <div className="text-green-600 font-medium">+{reward.points}</div>
                      </div>
                        ))
                      )}
                  </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            {impactLoading ? (
              <div className="text-gray-600">Loading impact...</div>
            ) : impactError ? (
              <div className="text-red-600 font-medium">{impactError}</div>
            ) : (
              <>
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
                          <div className="text-3xl font-bold text-green-600 mb-1">{totalCO2} kg</div>
                      <div className="text-sm text-green-800">Total CO2 Saved</div>
                          <div className="text-xs text-gray-600 mt-1">Equivalent to planting {Math.max(1, Math.round(totalCO2 / 21))} trees</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-xl font-bold text-blue-600">{evDeliveries}</div>
                        <div className="text-xs text-blue-800">EV Deliveries</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-xl font-bold text-purple-600">{ecoPackages}</div>
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
                            <span>{co2ThisMonth}/{co2Goal} kg</span>
                      </div>
                          <Progress value={Math.min(100, Math.round((co2ThisMonth / co2Goal) * 100))} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Green Deliveries</span>
                            <span>{greenDeliveriesThisMonth}/{greenDeliveriesGoal} orders</span>
                      </div>
                          <Progress value={Math.min(100, Math.round((greenDeliveriesThisMonth / greenDeliveriesGoal) * 100))} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Eco Score Target</span>
                            <span>{ecoScore}/{ecoScoreTarget}</span>
                      </div>
                          <Progress value={Math.min(100, Math.round((ecoScore / ecoScoreTarget) * 100))} />
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
                      {impactTimeline.length === 0 ? (
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                          <p>No impact data yet</p>
                    <p className="text-sm">CO2 savings, deliveries, and eco score trends</p>
                  </div>
                      ) : (
                        <div className="w-full">
                          {/* Simple timeline: list of dates and values */}
                          <ul className="text-xs text-gray-700">
                            {impactTimeline.map((point, idx) => (
                              <li key={idx}>{point.date}: {point.value} kg CO2 saved</li>
                            ))}
                          </ul>
                        </div>
                      )}
                </div>
              </CardContent>
            </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            {profileLoading ? (
              <div className="text-gray-600">Loading settings...</div>
            ) : profileError ? (
              <div className="text-red-600 font-medium">{profileError}</div>
            ) : (
              <>
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
                      <Switch checked={prefs.prioritizeEvDelivery} onCheckedChange={v => handlePrefChange('prioritizeEvDelivery', v)} disabled={savingPref} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Eco-Friendly Packaging</h3>
                    <p className="text-sm text-gray-600">Use biodegradable and recycled materials</p>
                  </div>
                      <Switch checked={prefs.ecoPackaging} onCheckedChange={v => handlePrefChange('ecoPackaging', v)} disabled={savingPref} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Carbon Offset</h3>
                    <p className="text-sm text-gray-600">Automatically offset delivery emissions</p>
                  </div>
                      <Switch checked={prefs.carbonOffset} onCheckedChange={v => handlePrefChange('carbonOffset', v)} disabled={savingPref} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Consolidated Delivery</h3>
                    <p className="text-sm text-gray-600">Group orders to reduce trips</p>
                  </div>
                      <Switch checked={prefs.consolidatedDelivery} onCheckedChange={v => handlePrefChange('consolidatedDelivery', v)} disabled={savingPref} />
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
                      <Switch checked={prefs.ecoImpactUpdates} onCheckedChange={v => handlePrefChange('ecoImpactUpdates', v)} disabled={savingPref} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Reward Notifications</h3>
                    <p className="text-sm text-gray-600">Points earned and available rewards</p>
                  </div>
                      <Switch checked={prefs.rewardNotifications} onCheckedChange={v => handlePrefChange('rewardNotifications', v)} disabled={savingPref} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Green Delivery Options</h3>
                    <p className="text-sm text-gray-600">Notify when eco options are available</p>
                  </div>
                      <Switch checked={prefs.greenDeliveryOptions} onCheckedChange={v => handlePrefChange('greenDeliveryOptions', v)} disabled={savingPref} />
                </div>
              </CardContent>
            </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
