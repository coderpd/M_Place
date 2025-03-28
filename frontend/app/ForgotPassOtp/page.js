"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ImageSlider from "../SignIn/ImageSlider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

// Validation schema for OTP
const schema = yup.object().shape({
  otp: yup
    .string()
    .length(4, "OTP must be 4 digits long")
    .matches(/^\d+$/, "OTP must only contain numbers")
    .required("OTP is required"),
});

export default function ForgotPassOtp() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      otp: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const email = localStorage.getItem("userEmail");

      if (!email) {
        setErrorMessage("Email is missing. Please request a new OTP.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/forgotpassword/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: data.otp,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Invalid OTP");
      }

      const result = await response.json();
      setSuccessMessage(result.message || "OTP validated successfully.");
      router.push("/ResetPassword");
    } catch (error) {
      setErrorMessage(error.message || "Failed to validate OTP");
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

      {/* Right Side - OTP Form */}
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
              Please enter the 4-digit OTP sent to your email
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 md:space-y-5">
              <div className="flex justify-between space-x-2 sm:space-x-3 md:space-x-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex-1">
                    <Controller
                      name="otp"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          maxLength={1}
                          type="text"
                          className="w-full text-center border border-gray-300 rounded-md p-2 sm:p-3 text-lg sm:text-xl"
                          placeholder="0"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              const newOtp = field.value.split("");
                              newOtp[index] = value;
                              field.onChange(newOtp.join(""));
                              
                              if (value && index < 3) {
                                const nextInput = document.querySelector(
                                  `input[name="otp-${index + 1}"]`
                                );
                                if (nextInput) nextInput.focus();
                              }
                            }
                          }}
                          value={field.value[index] || ""}
                          name={`otp-${index}`}
                        />
                      )}
                    />
                  </div>
                ))}
              </div>
              
              {errors.otp && (
                <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">
                  {errors.otp.message}
                </p>
              )}
              {errorMessage && (
                <p className="text-red-500 text-xs sm:text-sm md:text-base mt-2">
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p className="text-green-500 text-xs sm:text-sm md:text-base mt-2">
                  {successMessage}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 sm:h-11 md:h-12 rounded-md disabled:bg-gray-400 flex items-center justify-center text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    Verifying...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>

            <Link
              href="/ForgotPassword"
              className="flex items-start justify-start text-gray-600 mt-4 sm:mt-6 hover:text-gray-800 text-xs sm:text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
              <span>back</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}