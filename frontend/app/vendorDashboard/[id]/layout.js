"use client";

import { useParams } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";

export default function VendorDashboardLayout({ children }) {
  const { id } = useParams();

  return <DashboardLayout id={id}>{children}</DashboardLayout>;
}
