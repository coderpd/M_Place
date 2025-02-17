"use client";

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
  const router=useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  
  const onSubmit = (data) => {
    router.push("./ForgotPassOtp")
    console.log(data); 
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      {/* Left Side - Image Slider */}
      <ImageSlider />

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <Card className="w-full max-w-md space-y-6 shadow-lg rounded-lg p-6">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center text-white text-3xl font-semibold">
                M
              </div>
              <span className="text-4xl font-sans font-semibold text-gray-900">M-Place</span>
            </div>
          </CardHeader>

          <CardContent>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Forgot Password</h2>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
