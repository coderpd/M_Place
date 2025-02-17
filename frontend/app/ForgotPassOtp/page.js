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

// Validation schema for OTP
const schema = yup.object().shape({
  otp: yup
    .string()
    .length(4, "OTP must be 4 digits long")
    .matches(/^\d+$/, "OTP must only contain numbers")
    .required("OTP is required"),
});

export default function ForgotPassOtp() {
  const router=useRouter();
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
      // Simulate OTP validation API request
      const response = await validateOtp(data.otp); 

      setSuccessMessage(response); 
    } catch (error) {
      setErrorMessage(error.message || "Failed to validate OTP"); 
    } finally {
      setLoading(false); 
    }
  };

  // Simulated OTP validation API call
  const validateOtp = (otp) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === "1234") {
          router.push("./ResetPassword")
          resolve("OTP is valid. You can now reset your password.");
        } else {
          reject(new Error("Invalid OTP"));
        }
      }, 2000);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      <ImageSlider />

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <Card className="w-full max-w-md space-y-6 shadow-lg rounded-lg p-6">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center text-white text-3xl font-semibold">
                M
              </div>
              <span className="text-4xl font-sans font-semibold text-gray-900">
                M-Place
              </span>
            </div>
          </CardHeader>

          <CardContent>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Forgot Password
            </h2>
            <p className="text-gray-600 mb-6">Please Enter Your OTP</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex space-x-2">
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
                          className="w-full text-center border border-gray-300 rounded-md p-3"
                          placeholder="0"
                          onChange={(e) => {
                            const value = e.target.value;
                            const newOtp = field.value.split("");
                            newOtp[index] = value;
                            field.onChange(newOtp.join(""));
                          }}
                          value={field.value[index] || ""} // Handle the individual value per input box
                        />
                      )}
                    />
                  </div>
                ))}
              </div>
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
              )}

              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-sm mt-2">{successMessage}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-4"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
