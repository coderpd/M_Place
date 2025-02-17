"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";

export default function ContactSection() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div id="contact-us" className="bg-[#F7F7F7] py-16 px-6 md:px-10 lg:px-16 flex flex-col gap-16 md:flex-row justify-center space-y-8 md:space-y-0">
      
      {/* Left Side Contact Info */}
      <div className="md:w-[500px] space-y-8">
        <h1 className="font-serif text-4xl font-extrabold text-[#2D3748] leading-tight">Contact Us</h1>
        <p className="font-sans text-lg text-gray-600">
          Let’s start something great together. Reach out to our team today!
        </p>

        <ul className="space-y-6">
          <li className="flex items-center text-lg font-semibold text-gray-800">
            <Mail size={32} color="#BA4F50" className="mr-4 p-2 bg-gray-100 rounded-full hover:bg-blue-500 transition ease-in-out duration-300" /> 
            <span className="flex-1">Email Address</span>
          </li>
          <p className="text-sm text-gray-700 pl-12">info@teckost.com</p>

          <li className="flex items-center text-lg font-semibold text-gray-800">
            <Phone size={32} color="#BA4F50" className="mr-4 p-2 bg-gray-100 rounded-full hover:bg-blue-500 transition ease-in-out duration-300" /> 
            <span className="flex-1">Contact Number</span>
          </li>
          <p className="text-sm text-gray-700 pl-12">(044) 477-03399</p>

          <li className="flex items-center text-lg font-semibold text-gray-800">
            <MapPin size={32} color="#BA4F50" className="mr-4 p-2 bg-gray-100 rounded-full hover:bg-blue-500 transition ease-in-out duration-300" /> 
            <span className="flex-1">Contact Address</span>
          </li>
          <p className="text-sm text-gray-700 pl-12">
            53, North Boag Road, Fourth Floor, Mandira Block B, Behind Residency Towers, Chennai, Tamil Nadu 600017.
          </p>
        </ul>
      </div>

      {/* Right Side Contact Form */}
      <div className="bg-white p-8 rounded-lg shadow-xl md:w-[450px] mx-auto space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300"
            />
            {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300"
            />
            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              id="comment"
              {...register("comment", { required: "Comment is required" })}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300"
              rows="4"
            ></textarea>
            {errors.comment && <p className="text-red-500 text-xs mt-2">{errors.comment.message}</p>}
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-[200px] py-2 px-4 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition duration-300 transform hover:scale-105"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
