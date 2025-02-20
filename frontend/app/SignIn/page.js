"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageSlider from "./ImageSlider";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
  
      if (data.userType === "vendor") {
        router.push(`/vendorDashboard/${data.user.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
       <ImageSlider/>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 px-6 py-10">

     

        <Card className="w-full max-w-md shadow-lg p-6 bg-white">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center text-white text-3xl font-semibold">M</div>
              <CardTitle className="text-4xl font-sans font-semibold text-gray-900">M-Place</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mb-4">Log in to continue your journey.</p>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm text-gray-700">Email Address</label>
                <Input id="email" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <label htmlFor="password" className="text-sm text-gray-700">Password</label>
                <Input id="password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <Button onClick={handleLogin} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md disabled:bg-gray-400">
                {loading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-center text-sm mt-4">
                New here? <Link href="./signup" className="text-blue-500">Create an account</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
