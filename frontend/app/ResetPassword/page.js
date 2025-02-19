"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ImageSlider from "../SignIn/ImageSlider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

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
        confirmButtonText: "Go to Home",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Home");
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
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      <ImageSlider />

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 px-6 py-10">
        <Card className="w-full max-w-md shadow-lg p-6 bg-white">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center text-white text-3xl font-semibold">M</div>
              <CardTitle className="text-4xl font-sans font-semibold text-gray-900">M-Place</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-semibold text-gray-800">Reset Your Password</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* New Password Field */}
              <div className="relative">
                <label htmlFor="newPassword" className="text-sm text-gray-700">New Password</label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...register("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={toggleNewPasswordVisibility}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-red-500 text-sm">{errors.newPassword?.message}</p>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="text-sm text-gray-700">Confirm Password</label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              >
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
