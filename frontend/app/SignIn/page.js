"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import ImageSlider from "./ImageSlider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async () => {
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("http://localhost:5000/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }
  
      console.log("Login Response:", data);
  
      if (data.userType === "vendor") {
        router.push(`/vendorDashboard/${data.user.id}`);
      } else if (data.userType === "customer") {
        
        localStorage.setItem("customer", JSON.stringify(data.user));
  
        router.push(`/customer/products`);
      } else {
        throw new Error("Invalid user type.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      <ImageSlider />
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 px-6 py-10">
        <Card className="w-full max-w-md shadow-lg p-6 bg-white">
          <CardHeader>
          
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-500 p-1">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center border border-gray-300 shadow-inner">
              <img
                src="/Logo.png"
                alt="M-Place Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
            </div>
          </div>
      
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mb-4">Log in to continue your journey.</p>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm text-gray-700">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm text-gray-700">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="mr-2"
                  />
                  Remember Me
                </label>
                <Link href="../ForgotPassword" className="text-blue-500">Forgot password?</Link>
              </div>

              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md disabled:bg-gray-400"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>

            <p className="text-center text-sm mt-4">
              New here? <Link href="./Home" className="text-blue-500">Create an account</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
