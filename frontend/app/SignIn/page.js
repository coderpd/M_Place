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

  // ✅ Prevent Back Navigation After Login
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const handleLogin = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Invalid email or password. Please try again."
            : data.message || "Login failed. Please try again."
        );
      }

      console.log("✅ Login Successful:", data);

      // Store authentication token
      if (rememberMe) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      localStorage.setItem("userType", data.userType);
      localStorage.setItem("userId", data.user.id.toString());

      // ✅ Rounded Border for SweetAlert
      Swal.fire({
        title: "Login Successful!",
        text: "You are now logged in.",
        imageUrl: "/login.gif",
        imageWidth: 127,
        imageHeight: 151,
        imageAlt: "Login Success",
        confirmButtonColor: "#3085D6",
        customClass: {
          popup: "rounded-lg shadow-md", // Added rounded borders & shadow
          confirmButton: "px-6 py-2 bg-blue-600 text-white rounded-md",
        },
      }).then(() => {
        // Redirect based on user type
        if (data.userType === "vendor") {
          localStorage.setItem("vendorId", data.user.id);
          router.push(`/vendorDashboard/${data.user.id}`);
        } else if (data.userType === "customer") {
          localStorage.setItem("customer", JSON.stringify(data.user));
          router.push(`/customer/products`);
        }
      });
    } catch (err) {
      Swal.fire({
        title: "Login Failed!",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#D33",
      });
    } finally {
      setLoading(false);
    }
  }, [email, password, rememberMe, router]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      {/* Image Slider - Fixed solution to ensure visibility */}
      <div className="hidden lg:block lg:w-1/2 2xl:w-3/5 h-full overflow-hidden">
        <div className="h-full w-full">
          <ImageSlider />
        </div>
      </div>
      
      {/* Login Form Container */}
      <div className="w-full lg:w-1/2 2xl:w-2/5 flex items-center justify-center bg-gray-100 px-6 py-10 2xl:py-16">
        <Card className="w-full max-w-md 2xl:max-w-lg shadow-lg p-6 2xl:p-8 bg-white rounded-lg">
          <CardHeader>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 2xl:w-24 2xl:h-24 rounded-xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-500 p-1">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center border border-gray-300 shadow-inner">
                <img
                  src="/Logo.png"
                  alt="M-Place Logo"
                  className="w-12 h-12 sm:w-16 sm:h-16 2xl:w-20 2xl:h-20 object-contain"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl 2xl:text-3xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mb-4 2xl:mb-6 2xl:text-lg">Log in to continue your journey.</p>

            <div className="space-y-4 2xl:space-y-6">
              <div>
                <label htmlFor="email" className="text-sm 2xl:text-base text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="2xl:h-12 2xl:text-base"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm 2xl:text-base text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="2xl:h-12 2xl:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} className="2xl:w-6 2xl:h-6" /> : <Eye size={20} className="2xl:w-6 2xl:h-6" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm 2xl:text-base">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="mr-2 w-4 h-4 2xl:w-5 2xl:h-5"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 2xl:py-3 rounded-md disabled:bg-gray-400 flex items-center justify-center text-base 2xl:text-lg"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : "Login"}
              </Button>
            </div>

            <p className="text-center text-sm 2xl:text-base mt-4 2xl:mt-6">
              New here? <Link href="/LandingPage" className="text-blue-500 hover:text-blue-700">Create an account</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}