import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Package, Route, Award, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            <span className="text-lg sm:text-2xl font-bold text-gray-900">EcoCart</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-green-600">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-green-600">
              How it Works
            </Link>
            <Link href="/auth" className="text-gray-600 hover:text-green-600">
              Login
            </Link>
          </nav>

          {/* Mobile & Desktop Buttons */}
          <div className="flex items-center space-x-2">
            <Link href="/auth" className="hidden sm:block">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth?mode=signup">
              <Button className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-3 py-2 sm:px-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100 text-xs sm:text-sm">
            AI-Powered Eco-Logistics Platform
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Smart Packaging &<br />
            <span className="text-green-600">Green Delivery</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Optimize your logistics with AI-suggested eco-friendly packaging, carbon-optimized delivery routes, and
            blockchain-verified sustainable materials. Reduce your carbon footprint while saving costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/auth?mode=signup&role=retailer">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                Start as Retailer
              </Button>
            </Link>
            <Link href="/auth?mode=signup&role=customer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Join as Customer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-sm sm:text-base text-gray-600">CO2 Reduction</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">40%</div>
              <div className="text-sm sm:text-base text-gray-600">Packaging Waste Saved</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">1000+</div>
              <div className="text-sm sm:text-base text-gray-600">Active Retailers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-sm sm:text-base text-gray-600">Green Deliveries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Revolutionizing Eco-Logistics</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform combines smart packaging, green delivery optimization, and blockchain traceability
              for sustainable commerce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Package className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>AI Packaging Optimization</CardTitle>
                <CardDescription>
                  Get AI-suggested eco-friendly packaging based on product dimensions, weight, and sustainability goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Right-size packaging recommendations</li>
                  <li>• Biodegradable material selection</li>
                  <li>• Cost and eco-score analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Route className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Carbon-Optimized Routes</CardTitle>
                <CardDescription>
                  Smart delivery route planning that prioritizes EVs and low-emission paths for maximum CO2 savings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• EV-first route optimization</li>
                  <li>• Real-time traffic integration</li>
                  <li>• CO2 emission tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Blockchain Traceability</CardTitle>
                <CardDescription>
                  Track packaging materials from origin to delivery with blockchain-verified sustainability
                  certificates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Material origin verification</li>
                  <li>• Sustainability certification</li>
                  <li>• Supply chain transparency</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Retailer Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive analytics and insights for retailers to optimize their eco-logistics operations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Product upload and analysis</li>
                  <li>• Packaging recommendations</li>
                  <li>• Delivery optimization tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Customer Rewards</CardTitle>
                <CardDescription>
                  Customers earn points for choosing green delivery options and can track their environmental impact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Green delivery selection</li>
                  <li>• Reward points system</li>
                  <li>• Impact tracking dashboard</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Leaf className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Monitor CO2 savings, packaging efficiency, and delivery performance with real-time analytics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Live CO2 tracking</li>
                  <li>• Performance metrics</li>
                  <li>• Sustainability reports</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How EcoCart Works</h2>
            <p className="text-xl text-gray-600">Simple steps to sustainable logistics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Products</h3>
              <p className="text-gray-600">
                Retailers upload product details including dimensions, weight, and destination.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Optimization</h3>
              <p className="text-gray-600">
                Our AI suggests optimal packaging and calculates carbon-efficient delivery routes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Green Delivery</h3>
              <p className="text-gray-600">
                Customers choose eco-friendly options, earn rewards, and track their environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Go Green?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of retailers and customers making a difference with sustainable logistics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?mode=signup&role=retailer">
              <Button size="lg" variant="secondary">
                Start Your Green Journey
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-green-600 bg-transparent"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold">EcoCart</span>
              </div>
              <p className="text-gray-400">AI-powered eco-logistics platform for sustainable commerce.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EcoCart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
