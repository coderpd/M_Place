"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ImageSlider from "../SignIn/ImageSlider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

// Validation schema
const schema = yup.object().shape({
  newPassword: yup
    .string()
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/,
      "Password must have at least 1 uppercase letter, 1 special character, and 1 number"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ResetPassword() {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data) => {
    setLoading(true);
    const email = localStorage.getItem("userEmail");

    try {
      const response = await fetch("http://localhost:5000/forgotpassword/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to reset password");
      }

      Swal.fire({
        title: "Password Reset Successful!",
        text: "You can now log in with your new password.",
        icon: "success",
        confirmButtonColor: "#4BB543",
        confirmButtonText: "Go to Signin",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/SignIn");
        }
      });

    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#D9534F",
        confirmButtonText: "Try Again",
      });
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

      {/* Right Side - Reset Password Form */}
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
              Reset Your Password
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg text-center">
              Create a new secure password
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 md:space-y-5">
              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="text-xs sm:text-sm md:text-base text-gray-700">
                  New Password
                </label>
                <div className="relative mt-1">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...register("newPassword")}
                    className="h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={toggleNewPasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="text-xs sm:text-sm md:text-base text-gray-700">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...register("confirmPassword")}
                    className="h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs sm:text-sm md:text-base mt-1">
                    {errors.confirmPassword.message}
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
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <Link
              href="/SignIn"
              className="flex items-center justify-center text-gray-600 mt-4 sm:mt-6 hover:text-gray-800 text-xs sm:text-sm md:text-base"
            >
              <span>Back to Sign In</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}