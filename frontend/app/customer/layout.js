"use client"; // Ensure it's a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerLayout({ children }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customerUser");

    if (!storedCustomer) {
      // console.warn("Customer not found in local storage. Redirecting...");
      router.replace("/SignIn"); // Redirect to SignIn page
    } else {
      setIsVerified(true); // Allow rendering if customer exists
    }
  }, []);

  // Show nothing until verification is complete
  if (!isVerified) {
    return null;
  }

  return <>{children}</>;
}
