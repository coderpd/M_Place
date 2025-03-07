"use client";

import { useParams } from "next/navigation";
import DashboardLayout from "@/app/Components/DashboardLayout";

export default function VendorDashboardLayout({ children }) {
  const { id } = useParams();

  return <DashboardLayout id={id}>{children}</DashboardLayout>;
}
