"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  Package,
  Route,
  Award,
  TrendingUp,
  Users,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

  const handleBack = () => {
    window.location.reload();
  };

  if (showContact) {
    return (
      <section id="contact" className="section-spaced bg-white min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <button
            onClick={handleBack}
            className="mb-8 flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors button-enhanced"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center mb-16">
            <h2 className="section-title">Contact Us</h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto">
              Get in touch with our team for support, partnerships, or any
              questions about EcoCart.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">
                  Get in Touch
                </h3>
                <p className="text-foreground">
                  Have questions about our platform? We're here to help you get
                  started with sustainable logistics.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">📧</span>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Email</p>
                    <p className="text-foreground">hello@ecocart.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">📞</span>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Phone</p>
                    <p className="text-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">📍</span>
                  </div>
                  <div>
                    <p className="font-medium text-primary">Address</p>
                    <p className="text-foreground">
                      123 Green Street, Eco City, EC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-accent/40 p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">
                Send us a Message
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>
                <Button className="w-full button-enhanced button-green">
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
      <section id="help" className="section-spaced bg-accent/20 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <button
            onClick={handleBack}
            className="mb-8 flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors button-enhanced"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center mb-16">
            <h2 className="section-title">Help Center</h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto">
              Find answers to common questions and learn how to make the most of
              EcoCart.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">🚀</span>
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• How to create your account</li>
                  <li>• Setting up your first product</li>
                  <li>• Understanding the dashboard</li>
                  <li>• Basic navigation guide</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">📦</span>
                  Packaging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• AI packaging recommendations</li>
                  <li>• Eco-friendly materials</li>
                  <li>• Cost optimization tips</li>
                  <li>• Sustainability scoring</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">🚚</span>
                  Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Route optimization</li>
                  <li>• Carbon tracking</li>
                  <li>• Delivery scheduling</li>
                  <li>• Customer notifications</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">💰</span>
                  Billing & Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Understanding pricing</li>
                  <li>• Payment methods</li>
                  <li>• Invoice management</li>
                  <li>• Refund policies</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">🔧</span>
                  Technical Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• API documentation</li>
                  <li>• Integration guides</li>
                  <li>• Troubleshooting</li>
                  <li>• System requirements</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-3">📞</span>
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
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
      <section id="features" className="section-spaced bg-white min-h-screen">
        <div className="container mx-auto px-4">
          <button
            onClick={handleBack}
            className="mb-8 flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors button-enhanced"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center mb-16">
            <h2 className="section-title">Revolutionizing Eco-Logistics</h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto">
              Our AI-powered platform combines smart packaging, green delivery
              optimization, and blockchain traceability for sustainable
              commerce.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-enhanced">
              <CardHeader>
                <Package className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI Packaging Optimization</CardTitle>
                <CardDescription>
                  Get AI-suggested eco-friendly packaging based on product
                  dimensions, weight, and sustainability goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Right-size packaging recommendations</li>
                  <li>• Biodegradable material selection</li>
                  <li>• Cost and eco-score analysis</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="card-enhanced">
              <CardHeader>
                <Route className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Carbon-Optimized Routes</CardTitle>
                <CardDescription>
                  Smart delivery route planning that prioritizes EVs and
                  low-emission paths for maximum CO2 savings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• EV-first route optimization</li>
                  <li>• Real-time traffic integration</li>
                  <li>• CO2 emission tracking</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="card-enhanced">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Blockchain Traceability</CardTitle>
                <CardDescription>
                  Track packaging materials from origin to delivery with
                  blockchain-verified sustainability certificates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Material origin verification</li>
                  <li>• Sustainability certification</li>
                  <li>• Supply chain transparency</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="card-enhanced">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Retailer Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive analytics and insights for retailers to optimize
                  their eco-logistics operations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Product upload and analysis</li>
                  <li>• Packaging recommendations</li>
                  <li>• Delivery optimization tools</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="card-enhanced">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Customer Rewards</CardTitle>
                <CardDescription>
                  Customers earn points for choosing green delivery options and
                  can track their environmental impact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Green delivery selection</li>
                  <li>• Reward points system</li>
                  <li>• Impact tracking dashboard</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="card-enhanced">
              <CardHeader>
                <Leaf className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Monitor CO2 savings, packaging efficiency, and delivery
                  performance with real-time analytics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
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
      <section
        id="how-it-works"
        className="section-spaced bg-accent/20 min-h-screen"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <button
            onClick={handleBack}
            className="mb-8 flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors button-enhanced"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center mb-16">
            <h2 className="section-title">How EcoCart Works</h2>
            <p className="text-xl text-foreground">
              Simple steps to sustainable logistics
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary">
                Upload Products
              </h3>
              <p className="text-foreground">
                Retailers upload product details including dimensions, weight,
                and destination.
              </p>
            </div>
            <div className="text-center bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary">
                AI Optimization
              </h3>
              <p className="text-foreground">
                Our AI suggests optimal packaging and calculates
                carbon-efficient delivery routes.
              </p>
            </div>
            <div className="text-center bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary">
                Green Delivery
              </h3>
              <p className="text-foreground">
                Customers choose eco-friendly options, earn rewards, and track
                their environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-2xl font-bold text-primary">
              EcoCart
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={handleFeaturesClick}
              className="text-foreground hover:text-primary transition-colors"
            >
              Features
            </button>
            <button
              onClick={handleHowItWorksClick}
              className="text-foreground hover:text-primary transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={handleContactClick}
              className="text-foreground hover:text-primary transition-colors"
            >
              Contact
            </button>
            <button
              onClick={handleHelpClick}
              className="text-foreground hover:text-primary transition-colors"
            >
              Help Center
            </button>
          </nav>

          {/* Mobile & Desktop Buttons */}
          <div className="flex items-center space-x-2">
            <Link href="/auth" className="hidden sm:block">
              <Button variant="outline" size="sm" className="button-enhanced">
                Login
              </Button>
            </Link>
            <Link href="/auth?mode=signup">
              <Button className="button-enhanced button-green text-xs sm:text-sm px-3 py-2 sm:px-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="hero-gradient section-spaced px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-accent text-primary hover:bg-accent text-xs sm:text-sm">
            AI-Powered Eco-Logistics Platform
          </Badge>
          <h1 className="section-title hero-title">
            Smart Packaging &<br />
            <span className="text-primary">Green Delivery</span>
          </h1>
          <p className="text-base sm:text-xl text-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            AI-driven packaging, green routes, and blockchain materials—save
            costs and cut your carbon footprint.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/auth?mode=signup&role=retailer">
              <Button
                size="lg"
                className="button-enhanced button-green w-full sm:w-auto"
              >
                Start as Retailer
              </Button>
            </Link>
            <Link href="/auth?mode=signup&role=customer">
              <Button
                size="lg"
                variant="outline"
                className="button-enhanced w-full sm:w-auto bg-transparent border-primary text-primary"
              >
                Join as Customer
              </Button>
            </Link>
          </div>
        </div>
      </section>
      *
      <section className="w-full py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-10 tracking-tight">
            Why Choose EcoCart?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
            {/* Card 1 */}
            <div className="relative rounded-2xl bg-white/80 border border-green-200 shadow-lg p-8 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-green-200/60">
              <span className="text-4xl mb-3">🌿</span>
              <h3 className="text-xl font-bold text-primary mb-1">
                Eco-Friendly AI
              </h3>
              <div className="text-xs text-green-700 mb-2 font-semibold">
                Avg. 30% less packaging waste
              </div>
              <p className="text-foreground text-base mb-4">
                Sustainable packaging & delivery recommendations powered by
                advanced AI for a greener tomorrow.
              </p>
              <span className="absolute right-4 bottom-4 opacity-10 text-6xl pointer-events-none select-none">
                🌱
              </span>
            </div>
            {/* Card 2 */}
            <div className="relative rounded-2xl bg-white/80 border border-green-200 shadow-lg p-8 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-green-200/60">
              <span className="text-4xl mb-3">🚚</span>
              <h3 className="text-xl font-bold text-primary mb-1">
                Smart Logistics
              </h3>
              <div className="text-xs text-green-700 mb-2 font-semibold">
                Up to 25% CO₂ savings
              </div>
              <p className="text-foreground text-base mb-4">
                Carbon-aware, real-time route optimization for faster, more
                efficient, and eco-friendly deliveries.
              </p>
              <span className="absolute right-4 bottom-4 opacity-10 text-6xl pointer-events-none select-none">
                🛣
              </span>
            </div>
            {/* Card 3 */}
            <div className="relative rounded-2xl bg-white/80 border border-green-200 shadow-lg p-8 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-green-200/60">
              <span className="text-4xl mb-3">🔗</span>
              <h3 className="text-xl font-bold text-primary mb-1">
                Blockchain Traceability
              </h3>
              <div className="text-xs text-green-700 mb-2 font-semibold">
                100% supply chain transparency
              </div>
              <p className="text-foreground text-base mb-4">
                Transparent, blockchain-verified material tracking from source
                to delivery for trust and compliance.
              </p>
              <span className="absolute right-4 bottom-4 opacity-10 text-6xl pointer-events-none select-none">
                🔒
              </span>
            </div>
          </div>
        </div>
      </section>
      *{/* Features Section (always visible on homepage) */}
      <section id="features" className="section-spaced px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Revolutionizing Eco-Logistics</h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto">
              Our AI-powered platform combines smart packaging, green delivery
              optimization, and blockchain traceability for sustainable
              commerce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-enhanced">
              <CardHeader>
                <Package className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI Packaging Optimization</CardTitle>
                <CardDescription>
                  Get AI-suggested eco-friendly packaging based on product
                  dimensions, weight, and sustainability goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Right-size packaging recommendations</li>
                  <li>• Biodegradable material selection</li>
                  <li>• Cost and eco-score analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardHeader>
                <Route className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Carbon-Optimized Routes</CardTitle>
                <CardDescription>
                  Smart delivery route planning that prioritizes EVs and
                  low-emission paths for maximum CO2 savings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• EV-first route optimization</li>
                  <li>• Real-time traffic integration</li>
                  <li>• CO2 emission tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Blockchain Traceability</CardTitle>
                <CardDescription>
                  Track packaging materials from origin to delivery with
                  blockchain-verified sustainability certificates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Material origin verification</li>
                  <li>• Sustainability certification</li>
                  <li>• Supply chain transparency</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Retailer Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive analytics and insights for retailers to optimize
                  their eco-logistics operations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Product upload and analysis</li>
                  <li>• Packaging recommendations</li>
                  <li>• Delivery optimization tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Customer Rewards</CardTitle>
                <CardDescription>
                  Customers earn points for choosing green delivery options and
                  can track their environmental impact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Green delivery selection</li>
                  <li>• Reward points system</li>
                  <li>• Impact tracking dashboard</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardHeader>
                <Leaf className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Monitor CO2 savings, packaging efficiency, and delivery
                  performance with real-time analytics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
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
      <section className="section-spaced bg-green-300 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title text-white">Ready to Go Green?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of retailers and customers making a difference with
            sustainable logistics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?mode=signup&role=retailer">
              <Button
                size="lg"
                variant="secondary"
                className="button-enhanced button-green"
              >
                Start Your Green Journey
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="button-enhanced border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-foreground text-background py-12 footer-top-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-accent" />
                <span className="text-xl font-bold">EcoCart</span>
              </div>
              <p className="text-accent">
                AI-powered eco-logistics platform for sustainable commerce.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-accent">
                <li>
                  <Link href="#features" className="footer-link">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="footer-link">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#api" className="footer-link">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-accent">
                <li>
                  <Link href="#about" className="footer-link">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#blog" className="footer-link">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#careers" className="footer-link">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-accent">
                <li>
                  <button
                    onClick={handleHelpClick}
                    className="footer-link text-left"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleContactClick}
                    className="footer-link text-left"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <Link href="#privacy" className="footer-link">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-accent mt-8 pt-8 text-center text-accent">
            <p>&copy; 2024 EcoCart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
