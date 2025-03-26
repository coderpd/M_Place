"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";

export default function VendorDashboardLayout({ children }) {
  const router = useRouter();
  const params = useParams();
  const [vendorId, setVendorId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
  
    console.log("✅ Running on the client");
  
    if (!params.id) {
      console.error("🚨 params.id is undefined! Redirecting...");
      router.replace("/not-found");
      return;
    }
  
    const storedVendorId = localStorage.getItem("vendorId"); // Ensure correct retrieval
  
    console.log("🔍 Stored Vendor ID:", storedVendorId);
    console.log("🔍 Params ID:", params.id);
  
    if (!storedVendorId) {
      console.warn("🚨 Vendor ID not found in localStorage. Retrying...");
      setTimeout(() => {
        const retryStoredId = localStorage.getItem("vendorId");
        if (!retryStoredId || retryStoredId.toString() !== params.id.toString()) {
          console.error("❌ No match found. Redirecting...");
          router.replace("/not-found");
        } else {
          console.log("✅ Match found! Staying on the dashboard.");
          setVendorId(retryStoredId);
        }
        setIsLoading(false);
      }, 300);
    } else if (storedVendorId.toString() !== params.id.toString()) {
      console.error("❌ ID Mismatch! Redirecting...");
      router.replace("/not-found");
    } else {
      console.log("✅ Vendor ID matches. Loading dashboard...");
      setVendorId(storedVendorId);
      setIsLoading(false);
    }
  }, [params.id, router]);
  
  if (isLoading) {
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  }

  return <DashboardLayout id={vendorId}>{children}</DashboardLayout>;
}
