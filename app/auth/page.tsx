"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Store, User } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const role = searchParams.get("role") || "customer";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    companyName: "",
    role: role,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let authResult;
    if (mode === "signup") {
      authResult = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName,
            role: formData.role,
          },
        },
      });
      setIsLoading(false);
      if (authResult.error) {
        alert(authResult.error.message);
        return;
      }
      if (!authResult.data.session) {
        alert("Signup successful! Please check your email and confirm your account before logging in.");
        return;
      }
    } else {
      authResult = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      setIsLoading(false);
      if (authResult.error) {
        alert(authResult.error.message);
        return;
      }
    }

    // Fetch the real user role from Supabase after login
    const { data: { user } } = await supabase.auth.getUser();
    const realRole = user?.user_metadata?.role || "customer";
    if (realRole === "retailer") {
      router.push("/retailer/dashboard");
    } else {
      router.push("/customer/dashboard");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">EcoCart</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 px-2">
            {mode === "signup" ? "Join the sustainable logistics revolution" : "Sign in to your EcoCart account"}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <Tabs value={mode} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="text-sm">
                  <Link href="/auth?mode=login" className="w-full">
                    Login
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-sm">
                  <Link href="/auth?mode=signup" className="w-full">
                    Sign Up
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            {/* Form content remains the same but with responsive spacing */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* All form fields with responsive text sizes */}
              {mode === "signup" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm">
                      Account Type
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Customer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="retailer">
                          <div className="flex items-center space-x-2">
                            <Store className="h-4 w-4" />
                            <span>Retailer</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">{formData.role === "retailer" ? "Contact Name" : "Full Name"}</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      required
                    />
                  </div>

                  {formData.role === "retailer" && (
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Enter company name"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        required
                      />
                    </div>
                  )}
                </>
              )}

              {/* Email and password fields with mobile-friendly sizing */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-10"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-10" disabled={isLoading}>
                {isLoading ? "Processing..." : mode === "signup" ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <Link href="/auth?mode=login" className="text-green-600 hover:underline">
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <Link href="/auth?mode=signup" className="text-green-600 hover:underline">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
