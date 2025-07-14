"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, Upload, TrendingUp, Route, BarChart3, Plus, Eye, Settings, Bell, Shield, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import BlockchainTraceability from "@/components/BlockchainTraceability"
import { supabase } from "@/lib/supabase"
import { usePathname, useRouter } from "next/navigation";
import { useRef, useEffect } from "react"
import { useMemo } from "react"
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
  const [latestProduct, setLatestProduct] = useState<any>(null)
  const [packagingSuggestion, setPackagingSuggestion] = useState<any>(null)
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false)
  const [suggestionError, setSuggestionError] = useState<string | null>(null)
  const [routeForm, setRouteForm] = useState({
    origin: "",
    destination: "",
    vehicleType: "electric",
    priority: "eco",
  })
  const [routeResult, setRouteResult] = useState<any>(null)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([])
  const [destSuggestions, setDestSuggestions] = useState<any[]>([])
  const [showOriginDropdown, setShowOriginDropdown] = useState(false)
  const [showDestDropdown, setShowDestDropdown] = useState(false)
  const originInputRef = useRef<HTMLInputElement>(null)
  const destInputRef = useRef<HTMLInputElement>(null)
  let originDebounce: NodeJS.Timeout
  let destDebounce: NodeJS.Timeout
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [overviewMetrics, setOverviewMetrics] = useState<any>({});
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [overviewDebug, setOverviewDebug] = useState<any>({});
  // Find the latest packaging suggestion ID for the current user
  const [latestPackagingId, setLatestPackagingId] = useState<string | null>(null);
  const [overviewEcoScores, setOverviewEcoScores] = useState<number[]>([]);
  const [overviewAvgEcoScore, setOverviewAvgEcoScore] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("");

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

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try to get full_name or email as fallback
        setUserName(user.user_metadata?.full_name || user.email || "");
      }
    };
    fetchUserName();
  }, []);

  const userInitial = useMemo(() => userName?.trim()?.charAt(0)?.toUpperCase() || "R", [userName]);

  // Fetch latest product and its packaging suggestion when suggestions tab is active
  useEffect(() => {
    const fetchLatestSuggestion = async () => {
      setIsLoadingSuggestion(true)
      setSuggestionError(null)
      setLatestProduct(null)
      setPackagingSuggestion(null)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setSuggestionError("Not authenticated.")
          setIsLoadingSuggestion(false)
          return
        }
        // Get latest product for this retailer
        const { data: products, error: prodErr } = await supabase
          .from("products")
          .select("*")
          .eq("retailer_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
        if (prodErr) throw prodErr
        if (!products || products.length === 0) {
          setSuggestionError("No products found. Upload a product to get AI suggestions.")
          setIsLoadingSuggestion(false)
          return
        }
        setLatestProduct(products[0])
        // Get packaging suggestion for this product
        const { data: suggestions, error: suggErr } = await supabase
          .from("packaging_suggestions")
          .select("*")
          .eq("product_id", products[0].id)
          .order("created_at", { ascending: false })
          .limit(1)
        if (suggErr) throw suggErr
        if (!suggestions || suggestions.length === 0) {
          setSuggestionError("No packaging suggestion found for your latest product. Try re-uploading.")
          setIsLoadingSuggestion(false)
          return
        }
        setPackagingSuggestion(suggestions[0])
      } catch (err: any) {
        setSuggestionError(err.message || "Failed to fetch suggestion.")
      }
      setIsLoadingSuggestion(false)
    }
    if (activeTab === "suggestions") {
      fetchLatestSuggestion()
    }
  }, [activeTab])

  // Autofill destination with latest product's destination if available
  useEffect(() => {
    if (activeTab === "routes" && latestProduct && latestProduct.destination) {
      setRouteForm((prev) => ({ ...prev, destination: latestProduct.destination }))
    }
  }, [activeTab, latestProduct])

  useEffect(() => {
    if (routeResult) {
      console.log('Route result:', routeResult);
    }
  }, [routeResult]);

  // Move fetchAnalytics and fetchOverview out of useEffect so they can be called manually
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAnalyticsError('Not authenticated.');
        setAnalyticsLoading(false);
        return;
      }
      // Fetch all analytics metrics for the user (no period filter)
      const { data: analyticsData, error: analyticsErr } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('period_start', { ascending: true });
      if (analyticsErr) throw analyticsErr;
      setAnalytics(analyticsData || []);
      // Fetch top eco-friendly products
      const { data: products, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .eq('retailer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (prodErr) throw prodErr;
      // For each product, get latest packaging suggestion
      const topProds = [];
      for (const product of products || []) {
        const { data: suggestions } = await supabase
          .from('packaging_suggestions')
          .select('*')
          .eq('product_id', product.id)
          .order('created_at', { ascending: false })
          .limit(1);
        if (suggestions && suggestions.length > 0) {
          topProds.push({
            ...product,
            ecoScore: suggestions[0].eco_score,
            co2Saved: suggestions[0].co2_reduction,
            packaging: suggestions[0].material,
          });
        }
      }
      // Sort by ecoScore desc
      setTopProducts(topProds.sort((a, b) => (b.ecoScore || 0) - (a.ecoScore || 0)));
    } catch (err: any) {
      setAnalyticsError(err.message || 'Failed to fetch analytics.');
    }
    setAnalyticsLoading(false);
  };

  const fetchOverview = async () => {
    setOverviewLoading(true);
    setOverviewError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setOverviewError('Not authenticated.');
        setOverviewLoading(false);
        return;
      }
      // Fetch analytics metrics
      const { data: analyticsData, error: analyticsErr } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('period_start', { ascending: true });
      if (analyticsErr) throw analyticsErr;
      // Filter for current month only
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const analyticsCurrentMonth = analyticsData.filter(a => a.period_start === currentMonth);
      // Get latest value for each metric
      const getLatest = (type: string) => {
        const filtered = analyticsCurrentMonth.filter(a => a.metric_type === type);
        if (filtered.length === 0) return null;
        return filtered[filtered.length - 1].metric_value;
      };
      // Fetch total product count for this user (no limit, just count)
      const { count: totalProducts, error: prodCountErr } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('retailer_id', user.id);
      if (prodCountErr) throw prodCountErr;
      // Fetch all products for this user (no limit)
      const { data: allProducts, error: allProdErr } = await supabase
        .from('products')
        .select('*')
        .eq('retailer_id', user.id)
        .order('created_at', { ascending: false });
      if (allProdErr) throw allProdErr;
      // For each product, get only the latest packaging suggestion's eco score (one per product)
      const allEcoScores = [];
      for (const product of allProducts || []) {
        const { data: suggestions } = await supabase
          .from('packaging_suggestions')
          .select('*')
          .eq('product_id', product.id)
          .order('created_at', { ascending: false })
          .limit(1);
        if (suggestions && suggestions.length > 0 && suggestions[0].eco_score != null) {
          allEcoScores.push(suggestions[0].eco_score);
        }
      }
      // Calculate average eco score from all products
      let avgEcoScore = null;
      if (allEcoScores.length > 0) {
        avgEcoScore = Math.round(
          allEcoScores.reduce((sum, score) => sum + score, 0) / allEcoScores.length
        );
      }
      setOverviewEcoScores(allEcoScores);
      setOverviewAvgEcoScore(avgEcoScore);
      console.log('DEBUG: setOverviewAvgEcoScore', avgEcoScore, allEcoScores);
      // Fetch latest 5 products for recent products section
      const { data: products, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .eq('retailer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (prodErr) throw prodErr;
      // For each product, get latest packaging suggestion for recent products section
      const recents = [];
      for (const product of products || []) {
        const { data: suggestions } = await supabase
          .from('packaging_suggestions')
          .select('*')
          .eq('product_id', product.id)
          .order('created_at', { ascending: false })
          .limit(1);
        if (suggestions && suggestions.length > 0) {
          recents.push({
            ...product,
            ecoScore: suggestions[0].eco_score,
            co2Saved: suggestions[0].co2_reduction,
            dimensions: `${product.length}x${product.width}x${product.height} cm`,
            weight: `${product.weight}g`,
          });
        }
      }
      setOverviewMetrics({
        totalProducts: totalProducts ?? 0,
        co2Saved: getLatest('co2_saved'),
        costSavings: getLatest('cost_savings'),
        avgEcoScore,
      });
      setRecentProducts(recents);
      setOverviewDebug({ analyticsData, products });
    } catch (err: any) {
      setOverviewError(err.message || 'Failed to fetch overview data.');
    }
    setOverviewLoading(false);
  };

  // Update useEffects to use the new fetchAnalytics/fetchOverview
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverview();
    }
  }, [activeTab]);

  // Update useEffects to use the new fetchAnalytics/fetchOverview
  useEffect(() => {
    const fetchLatestPackagingId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Get latest product for this retailer
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('retailer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (!products || products.length === 0) return;
      // Get latest packaging suggestion for this product
      const { data: suggestions } = await supabase
        .from('packaging_suggestions')
        .select('id')
        .eq('product_id', products[0].id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (suggestions && suggestions.length > 0) {
        setLatestPackagingId(suggestions[0].id);
      } else {
        setLatestPackagingId(null);
      }
    };
    if (activeTab === 'blockchain') {
      fetchLatestPackagingId();
    }
  }, [activeTab]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Current session user:', user);
      if (!user) {
        setIsUploading(false);
        throw new Error("User not authenticated");
      }
      // 1. Create the product in Supabase with retailer_id
      console.log('Inserting product with retailer_id:', user.id);
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

      // Double-check the product exists in the products table before inserting packaging suggestion
      const { data: checkProduct, error: checkError } = await supabase
        .from("products")
        .select("id")
        .eq("id", productId)
        .single();
      console.log('Checking product existence for productId:', productId, 'Result:', checkProduct, 'Error:', checkError);
      if (!checkProduct || checkError) {
        console.error('Product not found in products table after insert. Aborting packaging suggestion insert.');
        setIsUploading(false);
        return;
      }

      // 2. Call the real ML packaging API
      const mlPayload = {
        length: productForm.length,
        width: productForm.width,
        height: productForm.height,
        weight: productForm.weight,
        category: productForm.category,
        destination: productForm.destination,
      };
      console.log('ML API payload:', mlPayload);
      const response = await fetch("/api/ai/packaging-ml", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mlPayload),
      })
      const result = await response.json()

      if (result.success) {
        // 3. Store the packaging suggestion in Supabase with the real product ID
        // Get the user's access token
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        console.log('DEBUG: Using accessToken for user', user.id, accessToken);
        const packagingResponse = await fetch("/api/packaging/suggestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
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
      // Refresh analytics/overview if on those tabs
      if (activeTab === 'analytics') fetchAnalytics();
      if (activeTab === 'overview') fetchOverview();
      setActiveTab("suggestions")
    } catch (error) {
      console.error("Error processing product:", error)
      setIsUploading(false)
    }
  }

  const handleRouteSubmit = async (e: React.FormEvent) => {
    console.log('handleRouteSubmit called');
    e.preventDefault()
    setIsLoadingRoute(true)
    setRouteError(null)
    setRouteResult(null)
    try {
      const response = await fetch("/api/ai/route-optimization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: routeForm.origin,
          destination: routeForm.destination,
          vehicleType: routeForm.vehicleType,
          priority: routeForm.priority,
        }),
      })
      const result = await response.json()
      setRouteResult(result)
      if (!result.success) throw new Error(result.error || "Route optimization failed")
    } catch (err: any) {
      setRouteError(err.message || "Failed to optimize route.")
    }
    setIsLoadingRoute(false)
  }

  const fetchSuggestions = async (q: string, type: "origin" | "dest") => {
    if (!q) {
      if (type === "origin") setOriginSuggestions([])
      else setDestSuggestions([])
      return
    }
    const res = await fetch(`/api/geospatial/autocomplete?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    if (data.success) {
      if (type === "origin") setOriginSuggestions(data.suggestions)
      else setDestSuggestions(data.suggestions)
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

  // Helper: get latest value for a metric (no period filter)
  function getLatestMetric(metricType: string) {
    const filtered = analytics.filter(a => a.metric_type === metricType);
    if (filtered.length === 0) return null;
    return filtered[filtered.length - 1].metric_value;
  }
  // Helper: get time series for a metric
  function getMetricSeries(metricType: string) {
    return analytics.filter(a => a.metric_type === metricType).map(a => ({
      value: a.metric_value,
      period: a.period_start,
    }));
  }

  return (
    <>
      {/* Removed the upper route planner form as requested */}
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
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {userInitial}
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
              {overviewLoading ? (
                <div className="text-gray-600">Loading...</div>
              ) : overviewError ? (
                <div className="text-red-600 font-medium">{overviewError}</div>
              ) : (
              <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">{overviewMetrics.totalProducts ?? '—'}</div>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">CO2 Saved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">{overviewMetrics.co2Saved !== null ? `${overviewMetrics.co2Saved} kg` : '—'}</div>
                    <p className="text-xs text-green-600">+28% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Avg Eco Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">{overviewAvgEcoScore ?? '—'}</div>
                    <p className="text-xs text-green-600">+5 points improved</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Cost Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">{overviewMetrics.costSavings !== null ? `$${overviewMetrics.costSavings}` : '—'}</div>
                    <p className="text-xs text-green-600">+18% from last month</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Products</CardTitle>
                  <CardDescription className="text-sm">Your latest product optimizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentProducts.length === 0 ? (
                      <div className="text-gray-500">No products found.</div>
                    ) : (
                      recentProducts.map((product) => (
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
                          <div className="text-right">
                            <div className="text-xs sm:text-sm font-medium">Eco Score: {product.ecoScore}</div>
                            <div className="text-xs text-green-600">CO2 Saved: {product.co2Saved} kg</div>
                          </div>
                          <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
              </>
              )}
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

                {isLoadingSuggestion ? (
                  <div className="flex items-center space-x-2 text-gray-600"><Loader2 className="animate-spin" /> Loading suggestions...</div>
                ) : suggestionError ? (
                  <div className="text-red-600 font-medium">{suggestionError}</div>
                ) : latestProduct && packagingSuggestion ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-green-600" />
                      <span>Recommended Packaging</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg flex flex-col items-center justify-center">
                          <div className="bg-white shadow-md rounded-lg px-6 py-4 mb-2 flex flex-col items-center border-2 border-green-200">
                            <span className="text-2xl sm:text-3xl font-extrabold text-green-700 tracking-wide">
                              {packagingSuggestion.optimal_length} × {packagingSuggestion.optimal_width} × {packagingSuggestion.optimal_height} <span className="text-base font-semibold text-gray-500">cm</span>
                            </span>
                          </div>
                          <span className="text-sm text-green-700 font-medium mt-1">Optimal Packaging Size</span>
                          <p className="text-xs text-green-600 mt-1">AI-optimized for your product: <span className="font-semibold">{latestProduct.name}</span></p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-medium text-blue-800">Material: {packagingSuggestion.material}</h3>
                          <p className="text-sm text-blue-600 mt-1">Eco Score: {packagingSuggestion.eco_score}/100</p>
                    </div>
                    <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Packaging Efficiency</span>
                      <div className="flex items-center space-x-2">
                            <Progress value={packagingSuggestion.packaging_efficiency} className="w-20" />
                            <span className="text-sm font-medium">{packagingSuggestion.packaging_efficiency}%</span>
                      </div>
                    </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">CO2 Reduction</span>
                          <span className="text-sm font-medium text-green-700">{packagingSuggestion.co2_reduction} kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Estimated Cost</span>
                          <span className="text-sm font-medium text-blue-700">${packagingSuggestion.cost_estimate}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
                ) : null}
              </div>
            )}

            {activeTab === "routes" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Route Optimization</h1>
                  <p className="text-gray-600 mt-2">Carbon-optimized delivery routes</p>
                </div>
              <Card>
                <CardHeader>
                    <CardTitle>Route Planner</CardTitle>
                    <CardDescription>Enter origin and destination to optimize your delivery route</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Remove the debug block that shows raw JSON */}
                    {/* <pre className="bg-gray-100 text-xs p-2 rounded mb-2 max-w-full overflow-x-auto">{JSON.stringify(routeResult, null, 2)}</pre> */}
                    {/* Restore the real route planner form */}
                    <form onSubmit={handleRouteSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="relative">
                        <Label htmlFor="origin">Origin</Label>
                        <Input
                          id="origin"
                          ref={originInputRef}
                          placeholder="e.g., Delhi"
                          value={routeForm.origin}
                          onChange={e => {
                            setRouteForm({ ...routeForm, origin: e.target.value })
                            setShowOriginDropdown(true)
                            clearTimeout(originDebounce)
                            originDebounce = setTimeout(() => fetchSuggestions(e.target.value, "origin"), 300)
                          }}
                          onBlur={() => setTimeout(() => setShowOriginDropdown(false), 200)}
                          autoComplete="off"
                          required
                        />
                        {showOriginDropdown && originSuggestions.length > 0 && (
                          <ul className="absolute z-10 bg-white border border-gray-200 rounded shadow w-full max-h-48 overflow-y-auto mt-1">
                            {originSuggestions.map((s, i) => (
                              <li
                                key={i}
                                className="px-3 py-2 hover:bg-green-100 cursor-pointer text-sm"
                                onMouseDown={() => {
                                  setRouteForm({ ...routeForm, origin: s.display_name })
                                  setShowOriginDropdown(false)
                                }}
                              >
                                {s.display_name}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                      <div className="relative">
                        <Label htmlFor="destination">Destination</Label>
                        <Input
                          id="destination"
                          ref={destInputRef}
                          placeholder="e.g., Mumbai"
                          value={routeForm.destination}
                          onChange={e => {
                            setRouteForm({ ...routeForm, destination: e.target.value })
                            setShowDestDropdown(true)
                            clearTimeout(destDebounce)
                            destDebounce = setTimeout(() => fetchSuggestions(e.target.value, "dest"), 300)
                          }}
                          onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
                          autoComplete="off"
                          required
                        />
                        {showDestDropdown && destSuggestions.length > 0 && (
                          <ul className="absolute z-10 bg-white border border-gray-200 rounded shadow w-full max-h-48 overflow-y-auto mt-1">
                            {destSuggestions.map((s, i) => (
                              <li
                                key={i}
                                className="px-3 py-2 hover:bg-green-100 cursor-pointer text-sm"
                                onMouseDown={() => {
                                  setRouteForm({ ...routeForm, destination: s.display_name })
                                  setShowDestDropdown(false)
                                }}
                              >
                                {s.display_name}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                      <div>
                        <Label htmlFor="vehicleType">Vehicle Type</Label>
                        <Select
                          value={routeForm.vehicleType}
                          onValueChange={(value) => setRouteForm({ ...routeForm, vehicleType: value })}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electric">Electric Van</SelectItem>
                            <SelectItem value="hybrid">Hybrid Truck</SelectItem>
                            <SelectItem value="standard">Standard Van</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={routeForm.priority}
                          onValueChange={(value) => setRouteForm({ ...routeForm, priority: value })}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eco">Eco-Friendly</SelectItem>
                            <SelectItem value="speed">Fastest</SelectItem>
                            <SelectItem value="cost">Cheapest</SelectItem>
                          </SelectContent>
                        </Select>
                  </div>
                      <Button type="submit" className="col-span-1 sm:col-span-2 bg-green-600 hover:bg-green-700 mt-2" disabled={isLoadingRoute}>
                        {isLoadingRoute ? <Loader2 className="animate-spin mr-2" /> : null}
                        Optimize Route
                      </Button>
                    </form>
                    {/* Show user-friendly error if routeResult.success === false */}
                    {routeResult && routeResult.success === false && (
                      <div className="text-red-700 bg-red-100 border border-red-300 rounded p-3 mb-3 font-medium">
                        {routeResult.error || 'No route found. Try different or more specific locations.'}
            </div>
          )}
                    {routeResult?.data?.optimizedRoute && (
                      <div className="mt-4 space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                            <div className="text-sm text-green-800 font-medium">Vehicle Type</div>
                            <div className="text-lg font-bold text-green-900">{routeResult.data.optimizedRoute.vehicleType || 'N/A'}</div>
              </div>
                          <div>
                            <div className="text-sm text-blue-800 font-medium">Distance</div>
                            <div className="text-lg font-bold text-blue-900">{routeResult.data.optimizedRoute.distance ? `${routeResult.data.optimizedRoute.distance.toFixed(1)} km` : 'N/A'}</div>
                      </div>
                          <div>
                            <div className="text-sm text-purple-800 font-medium">Est. Time</div>
                            <div className="text-lg font-bold text-purple-900">{routeResult.data.optimizedRoute.duration ? `${routeResult.data.optimizedRoute.duration} min` : 'N/A'}</div>
                    </div>
                          <div>
                            <div className="text-sm text-green-800 font-medium">CO2 Saved</div>
                            <div className="text-lg font-bold text-green-900">{routeResult.data.optimizedRoute.co2Saved ? `${routeResult.data.optimizedRoute.co2Saved.toFixed(2)} kg` : 'N/A'}</div>
                    </div>
                          <div>
                            <div className="text-sm text-blue-800 font-medium">Estimated Cost</div>
                            <div className="text-lg font-bold text-blue-900">{routeResult.data.optimizedRoute.cost ? `$${routeResult.data.optimizedRoute.cost.toFixed(2)}` : 'N/A'}</div>
                    </div>
                    </div>
                        {routeResult.waypoints && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="font-medium text-gray-700 mb-2">Route Waypoints:</div>
                            <ol className="list-decimal list-inside space-y-1">
                              {routeResult.waypoints.map((wp: any, idx: number) => (
                                <li key={idx} className="text-sm text-gray-600">{wp.name} ({wp.lat}, {wp.lng})</li>
                              ))}
                            </ol>
                    </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
            </div>
          )}

          {activeTab === "blockchain" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Blockchain Traceability</h1>
                  <p className="text-gray-600 mt-2">Verify packaging material authenticity and sustainability</p>
                </div>
                {/* Pass the latest real packagingId if available */}
                <BlockchainTraceability packagingId={latestPackagingId || undefined} />
            </div>
          )}
        </main>
      </div>
    </div>
    </>
  )
}
