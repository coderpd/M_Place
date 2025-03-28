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
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

// Define validation schema using Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

export default function ForgotPassword() {
  const [otpMessage, setOtpMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/forgotpassword/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setOtpMessage(errorData.error || errorData.message || "Unknown error.");
        return;
      }

      const result = await response.json();
      if (result.success) {
        setOtpSent(true);
        setOtpMessage("OTP sent successfully!");
        localStorage.setItem("userEmail", data.email);
        router.push("./ForgotPassOtp");
      } else {
        setOtpMessage(result.message || "Failed to send OTP");
      }
    } catch (error) {
      setOtpMessage("Error sending OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      {/* Left Side - Image Slider (hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 h-full overflow-hidden">
        <ImageSlider />
      </div>

      {/* Right Side - Forgot Password Form */}
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
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-2 sm:mb-3">
              Forgot Password
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg text-center">
              Please enter your registered email ID to receive an OTP.
            </p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 md:space-y-5">
              <div>
                <label htmlFor="email" className="text-xs sm:text-sm md:text-base text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="mt-1 h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 sm:h-11 md:h-12 rounded-md disabled:bg-gray-400 flex items-center justify-center text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    Sending...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>

            {/* OTP Message */}
            {otpMessage && (
              <p className={`mt-3 sm:mt-4 text-xs sm:text-sm md:text-base ${
                otpSent ? "text-green-500" : "text-red-500"
              }`}>
                {otpMessage}
              </p>
            )}

            <Link
              href="/SignIn"
              className="flex items-start justify-start text-gray-600 mt-4 sm:mt-6 hover:text-gray-800 text-xs sm:text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
              <span>Back </span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}