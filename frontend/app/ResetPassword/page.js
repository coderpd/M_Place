"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ImageSlider from "../SignIn/ImageSlider";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  newPassword: yup.string().min(6, "New password must be at least 6 characters").required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function LoginPage() {
  const router=useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    router.push("./SignIn")
    console.log(data);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      {/* Left Side - Image Slider */}
      <ImageSlider />

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 px-6 py-10">
        <Card className="w-full max-w-md shadow-lg p-6 bg-white">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center text-white text-3xl font-semibold">
                M
              </div>
              <CardTitle className="text-4xl font-sans font-semibold text-gray-900">M-Place</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mb-4 text-[16px]">A fresh start is one click away—reset your password now!</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
             
              <div>
                <label htmlFor="newPassword" className="text-sm text-gray-700">New Password</label>
                <Input id="newPassword" type="password" placeholder="Enter new password" {...register("newPassword")} />
                <p className="text-red-500 text-sm">{errors.newPassword?.message}</p>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="text-sm text-gray-700">Confirm Password</label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" {...register("confirmPassword")} />
                <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
