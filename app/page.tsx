"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Package, Route, Award, TrendingUp, Users, Truck } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [showContact, setShowContact] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContact(true);
    setShowHelp(false);
    setShowFeatures(false);
    setShowHowItWorks(false);
  };

  const handleHelpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowHelp(true);
    setShowContact(false);
    setShowFeatures(false);
    setShowHowItWorks(false);
  };

  const handleFeaturesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowFeatures(true);
    setShowContact(false);
    setShowHelp(false);
    setShowHowItWorks(false);
  };

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowHowItWorks(true);
    setShowContact(false);
    setShowHelp(false);
    setShowFeatures(false);
  };

  if (showContact) {
    return (
      <section id="contact" className="py-20 bg-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get in touch with our team for support, partnerships, or any questions about EcoCart.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Get in Touch</h3>
                <p className="text-gray-600">
                  Have questions about our platform? We're here to help you get started with sustainable logistics.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 font-semibold">📧</span>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">hello@ecocart.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 font-semibold">📞</span>
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 font-semibold">📍</span>
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">123 Green Street, Eco City, EC 12345</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Send us a Message</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>
                <Button className="w-full bg-slate-800 hover:bg-slate-900">
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (showHelp) {
    return (
      <section id="help" className="py-20 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions and learn how to make the most of EcoCart.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">🚀</span>
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• How to create your account</li>
                  <li>• Setting up your first product</li>
                  <li>• Understanding the dashboard</li>
                  <li>• Basic navigation guide</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">📦</span>
                  Packaging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• AI packaging recommendations</li>
                  <li>• Eco-friendly materials</li>
                  <li>• Cost optimization tips</li>
                  <li>• Sustainability scoring</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">🚚</span>
                  Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Route optimization</li>
                  <li>• Carbon tracking</li>
                  <li>• Delivery scheduling</li>
                  <li>• Customer notifications</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">💰</span>
                  Billing & Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Understanding pricing</li>
                  <li>• Payment methods</li>
                  <li>• Invoice management</li>
                  <li>• Refund policies</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">🔧</span>
                  Technical Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• API documentation</li>
                  <li>• Integration guides</li>
                  <li>• Troubleshooting</li>
                  <li>• System requirements</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">📞</span>
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Live chat support</li>
                  <li>• Email support</li>
                  <li>• Phone support</li>
                  <li>• Response times</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (showFeatures) {
    return (
      <section id="features" className="py-20 px-4 min-h-screen">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Revolutionizing Eco-Logistics</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform combines smart packaging, green delivery optimization, and blockchain traceability
              for sustainable commerce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white/80 hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 ease-out transform cursor-pointer">
              <CardHeader>
                <Package className="h-12 w-12 text-slate-600 mb-4" />
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

            <Card className="border-0 shadow-lg bg-white/80 hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 ease-out transform cursor-pointer">
              <CardHeader>
                <Route className="h-12 w-12 text-slate-600 mb-4" />
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

            <Card className="border-0 shadow-lg bg-white/80 hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 ease-out transform cursor-pointer">
              <CardHeader>
                <Award className="h-12 w-12 text-slate-600 mb-4" />
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

            <Card className="border-0 shadow-lg bg-white/80 hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 ease-out transform cursor-pointer">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-slate-600 mb-4" />
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

            <Card className="border-0 shadow-lg bg-white/80 hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 ease-out transform cursor-pointer">
              <CardHeader>
                <Users className="h-12 w-12 text-slate-600 mb-4" />
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

            <Card className="border-0 shadow-lg bg-white/80 hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 ease-out transform cursor-pointer">
              <CardHeader>
                <Leaf className="h-12 w-12 text-slate-600 mb-4" />
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
    );
  }

  if (showHowItWorks) {
    return (
      <section id="how-it-works" className="py-20 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How EcoCart Works</h2>
            <p className="text-xl text-gray-600">Simple steps to sustainable logistics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Products</h3>
              <p className="text-gray-600">
                Retailers upload product details including dimensions, weight, and destination.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Optimization</h3>
              <p className="text-gray-600">
                Our AI suggests optimal packaging and calculates carbon-efficient delivery routes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-400 to-blue-900 relative overflow-hidden">
      {/* Subtle background image */}
      <img src="/placeholder.jpg" alt="EcoCart background" className="pointer-events-none select-none absolute top-0 right-0 w-2/3 max-w-2xl opacity-15 blur-sm z-0" style={{objectFit: 'cover'}} />
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/placeholder-logo.png" alt="EcoCart Logo" className="h-6 w-6 sm:h-8 sm:w-8 grayscale opacity-80 drop-shadow-md" />
            <span className="text-lg sm:text-2xl font-bold text-gray-900">EcoCart</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button onClick={handleFeaturesClick} className="text-gray-600 hover:text-slate-600">
              Features
            </button>
            <button onClick={handleHowItWorksClick} className="text-gray-600 hover:text-slate-600">
              How it Works
            </button>
            <button onClick={handleContactClick} className="text-gray-600 hover:text-slate-600">
              Contact
            </button>
            <button onClick={handleHelpClick} className="text-gray-600 hover:text-slate-600">
              Help Center
            </button>
          </nav>

          {/* Mobile & Desktop Buttons */}
          <div className="flex items-center space-x-2">
            <Link href="/auth" className="hidden sm:block">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth?mode=signup">
              <Button className="bg-slate-800 hover:bg-slate-900 text-xs sm:text-sm px-3 py-2 sm:px-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-slate-100 text-slate-800 hover:bg-slate-100 text-xs sm:text-sm">
            AI-Powered Eco-Logistics Platform
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
            Smart Packaging &<br />
            <span className="text-slate-700">Green Delivery</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            AI-optimized packaging and delivery. Lower costs and carbon footprint.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/auth?mode=signup&role=retailer">
              <Button size="lg" className="bg-slate-700 hover:bg-slate-800 w-full sm:w-auto">
                Start as Retailer
              </Button>
            </Link>
            <Link href="/auth?mode=signup&role=customer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/70 border-slate-300 text-slate-700 hover:bg-slate-100">
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
              <Leaf className="mx-auto mb-2 h-8 w-8 text-slate-400" />
              <div className="text-2xl sm:text-3xl font-bold text-slate-600 mb-2">85%</div>
              <div className="text-sm sm:text-base text-gray-600">CO2 Reduction</div>
            </div>
            <div>
              <Package className="mx-auto mb-2 h-8 w-8 text-slate-400" />
              <div className="text-2xl sm:text-3xl font-bold text-slate-600 mb-2">40%</div>
              <div className="text-sm sm:text-base text-gray-600">Packaging Waste Saved</div>
            </div>
            <div>
              <Users className="mx-auto mb-2 h-8 w-8 text-slate-400" />
              <div className="text-2xl sm:text-3xl font-bold text-slate-600 mb-2">1000+</div>
              <div className="text-sm sm:text-base text-gray-600">Active Retailers</div>
            </div>
            <div>
              <Route className="mx-auto mb-2 h-8 w-8 text-slate-400" />
              <div className="text-2xl sm:text-3xl font-bold text-slate-600 mb-2">50K+</div>
              <div className="text-sm sm:text-base text-gray-600">Green Deliveries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (always visible on homepage) */}
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
            <Card className="border-0 shadow-lg bg-white/80 hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 ease-out transform cursor-pointer">
              <CardHeader>
                <Package className="h-12 w-12 text-slate-600 mb-4" />
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

            <Card className="border-0 shadow-lg bg-white/80 hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 ease-out transform cursor-pointer">
              <CardHeader>
                <Route className="h-12 w-12 text-slate-600 mb-4" />
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

            <Card className="border-0 shadow-lg bg-white/80 hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 ease-out transform cursor-pointer">
              <CardHeader>
                <Award className="h-12 w-12 text-slate-600 mb-4" />
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

            <Card className="border-0 shadow-lg bg-white/80 hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 ease-out transform cursor-pointer">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-slate-600 mb-4" />
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

            <Card className="border-0 shadow-lg bg-white/80 hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 ease-out transform cursor-pointer">
              <CardHeader>
                <Users className="h-12 w-12 text-slate-600 mb-4" />
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

            <Card className="border-0 shadow-lg bg-white/80 hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 ease-out transform cursor-pointer">
              <CardHeader>
                <Leaf className="h-12 w-12 text-slate-600 mb-4" />
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
      {/* This section is now conditionally rendered */}

      {/* CTA Section */}
      <section className="py-20 bg-slate-800 text-white">
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
                className="text-white border-white hover:bg-white hover:text-slate-800 bg-transparent"
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
                <Leaf className="h-6 w-6 text-slate-400" />
                <span className="text-xl font-bold">EcoCart</span>
              </div>
              <p className="text-gray-400">AI-powered eco-logistics platform for sustainable commerce.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#api" className="hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={handleHelpClick} className="hover:text-white text-left">
                    Help Center
                  </button>
                </li>
                <li>
                  <button onClick={handleContactClick} className="hover:text-white text-left">
                    Contact
                  </button>
                </li>
                <li>
                  <Link href="#privacy" className="hover:text-white">
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
