"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/app/Components/DashboardLayout";

export default function VendorDashboardLayout({ children }) {
  const router = useRouter();
  const params = useParams();
  const [vendorId, setVendorId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
  
    if (!params.id) {
      if (process.env.NODE_ENV === "development") {
        console.warn("🚨 params.id is undefined! Redirecting...");
      }
      router.replace("/SignIn");
      return;
    }
  
    const storedVendorId = localStorage.getItem("vendorId");
  
    if (!storedVendorId) {
      if (process.env.NODE_ENV === "development") {
        console.warn("🚨 Vendor ID not found in localStorage. Redirecting to SignIn...");
      }
      router.replace("/SignIn");
      return;
    }
  
    if (storedVendorId.toString() !== params.id.toString()) {
      if (process.env.NODE_ENV === "development") {
        console.warn("❌ ID Mismatch! Redirecting to SignIn...");
      }
      router.replace("/SignIn");
      return;
    }
  
    setVendorId(storedVendorId);
    setIsLoading(false);
  }, [params.id, router]);
    if (isLoading) {
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  }

  return <DashboardLayout id={vendorId}>{children}</DashboardLayout>;
}
