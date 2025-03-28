"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import ImageSlider from "./ImageSlider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const[error,setError]=useState("")

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

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

      if (rememberMe) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      localStorage.setItem("userType", data.userType);
      localStorage.setItem("userId", data.user.id);

      if (data.userType === "vendor") {
        router.push(`/vendorDashboard/${data.user.id}`);
      } else if (data.userType === "customer") {
        localStorage.setItem("customer", JSON.stringify(data.user));
        router.push('/customer/products');
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
      {/* Image Slider - Hidden on mobile, shows on lg screens */}
      <div className="hidden lg:block lg:w-1/2 h-full overflow-hidden">
        <ImageSlider />
      </div>
      
      {/* Login Form Container - Full width on mobile, half on desktop */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg 2xl:max-w-xl shadow-sm sm:shadow-md p-4 sm:p-6 md:p-8 bg-white rounded-lg sm:rounded-xl">
          <CardHeader className="p-0 pb-4 sm:pb-6">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto rounded-lg sm:rounded-xl shadow-md bg-gradient-to-br from-blue-600 to-indigo-500 p-0.5">
              <div className="w-full h-full bg-white rounded-lg sm:rounded-xl flex items-center justify-center border border-gray-200 shadow-inner">
                <img
                  src="/Logo.png"
                  alt="M-Place Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 text-center">
              Welcome Back
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg text-center">
              Log in to continue your journey.
            </p>

            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <div>
                <label htmlFor="email" className="text-xs sm:text-sm md:text-base text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-xs sm:text-sm md:text-base text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs sm:text-sm md:text-base">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="mr-2 w-3 h-3 sm:w-4 sm:h-4"
                  />
                  Remember Me
                </label>
                <Link href="../ForgotPassword" className="text-blue-500 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>

              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 sm:h-11 md:h-12 rounded-md disabled:bg-gray-400 flex items-center justify-center text-sm sm:text-base"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  "Login"
                )}
              </Button>
            </div>

            <p className="text-center text-xs sm:text-sm md:text-base mt-4 sm:mt-6">
              New here?{" "}
              <Link href="/LandingPage" className="text-blue-500 hover:text-blue-700">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}