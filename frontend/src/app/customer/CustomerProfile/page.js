"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Get customer ID dynamically (assuming it's stored after login)
  const customerId = typeof window !== "undefined" ? localStorage.getItem("customerId") : null;

  useEffect(() => {
    if (!customerId) {
      console.error("No customer ID found.");
      setLoading(false);
      return;
    }

    const fetchCustomerDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/customer-profile/${customerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch customer details");
        }
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [customerId]);

  if (loading) return <p>Loading...</p>;
  if (!customer) return <p>No customer found.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="mt-4 space-y-2">
        <p><strong>Company Name:</strong> {customer.companyName}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.phoneNumber}</p>
        <p><strong>Address:</strong> {customer.address}</p>
      </div>
    </div>
  );
};

export default Profile;
