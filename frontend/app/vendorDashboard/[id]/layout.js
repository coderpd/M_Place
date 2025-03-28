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

    const storedVendorId = localStorage.getItem("vendorId");
    
    console.log("📌 Stored Vendor ID:", storedVendorId);
    console.log("📌 URL Params ID:", params.id);

    if (!storedVendorId) {
      console.warn("🚨 Vendor ID missing in localStorage. Redirecting to SignIn...");
      router.replace("/SignIn");
      return;
    }

    // Convert both to strings before comparison
    if (storedVendorId.toString().trim() !== params.id.toString().trim()) {
      console.warn("❌ ID Mismatch! Redirecting...");
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
