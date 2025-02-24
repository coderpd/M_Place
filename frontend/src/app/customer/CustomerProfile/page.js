"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CustomerProfile = () => {
  const [customer, setCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");

    if (!storedCustomer) {
      router.push("/login");
    } else {
      const customerData = JSON.parse(storedCustomer);
      setCustomer(customerData);
      setFormData(customerData); // Initialize form data
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedFormData = { ...formData, id: customer.id };

      const response = await fetch("http://localhost:5000/customer-edit/update-profile", {
        method: "POST", // Changed to POST for profile update
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        const updatedCustomer = await response.json();
        console.log("Profile updated:", updatedCustomer);

        // Update localStorage with the updated form data
        localStorage.setItem("customer", JSON.stringify(formData));
        setCustomer(formData); // This triggers a re-render with the updated data

        setIsEditing(false); // Switch to non-edit mode
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        console.log("Error details:", errorData);
        alert(errorData.message || "Failed to update profile. Try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong. Try again later.");
    }
  };

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Customer Profile</h1>

      <div className="bg-white shadow-lg p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {isEditing ? (
          // Editable form
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          // Display profile info (exclude id, password, created_at)
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(customer)
              .filter(
                ([key]) => !["id", "password", "createdAt", "created_at"].includes(key)
              )
              .map(([key, value]) => (
                <div key={key}>
                  <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p>{value}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
