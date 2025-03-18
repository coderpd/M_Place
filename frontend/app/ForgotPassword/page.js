"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { yupResolver } from "@hookform/resolvers/yup";
import ImageSlider from "../SignIn/ImageSlider";
import * as yup from "yup";
import { useRouter } from "next/navigation";

// Define validation schema using Yup
const schema = yup.object().shape({
  email: yup.string().email("Please enter a valid email address").required("Email is required"),
});

export default function ForgotPassword() {
  const [otpMessage, setOtpMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false); // Flag to track OTP sent status
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/forgotpassword/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setOtpMessage(errorData.error || errorData.message || "Unknown error.");
        return;
      }
  
      const result = await response.json();
      if (result.success) {
        setOtpSent(true);
        setOtpMessage("OTP sent successfully!");
  
        // ✅ Store the email in localStorage before redirecting
        localStorage.setItem("userEmail", data.email);
  
        router.push("./ForgotPassOtp");
      } else {
        setOtpMessage(result.message || "Failed to send OTP");
      }
    } catch (error) {
      setOtpMessage("Error sending OTP. Try again.");
    }
  };
  
  
   
  
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      {/* Left Side - Image Slider */}
      <ImageSlider />

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <Card className="w-full max-w-md space-y-6 shadow-lg rounded-lg p-6">
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Forgot Password</h2>
            <p className="text-gray-600 mb-6">Please enter your registered email ID to receive an OTP.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm text-gray-700">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")} 
                  className="mt-2"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <Button  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-4">
                Submit
              </Button>
            </form>

            {/* OTP Message */}
            {otpMessage && (
              <p className={`mt-4 ${otpSent ? 'text-green-500' : 'text-red-500'}`}>{otpMessage}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
