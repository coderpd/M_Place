"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowBigLeftDash } from "lucide-react";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedVendor, setUpdatedVendor] = useState(null);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/vendor/get-vendor/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch vendor: ${response.statusText}`);
        }
        const data = await response.json();
        setVendor(data.vendor);
        setUpdatedVendor(data.vendor);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVendorDetails();
  }, [id]);

  const handleInputChange = (e) => {
    setUpdatedVendor({ ...updatedVendor, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/auth/update-vendor/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVendor),
      });

      if (!response.ok) {
        throw new Error("Failed to update vendor");
      }

      setVendor(updatedVendor);
      setIsEditing(false);

      Swal.fire({
        title: "Success!",
        text: "Vendor details updated successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: `Update failed: ${err.message}`,
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
  };

  if (loading) return <p className="text-center text-lg">Loading vendor details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto p-6 sm:p-8 lg:pt-20">
        {/* Back Button and Title */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="hover:opacity-80">
            <ArrowBigLeftDash size={35} className="text-gray-700" />
          </button>
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800">My Profile</h2>
        </div>

        {/* Edit Button */}
        <div className="flex justify-end mt-6">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-6 sm:px-8 md:px-10 py-2 md:py-3 rounded-lg shadow-md hover:bg-blue-800 transition-all"
            >
              EDIT PROFILE
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg mt-8">
          <div className="flex flex-col items-center">
            <img src="/User_Icon.jpg" alt="Profile" className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover" />
            <h1 className="font-semibold text-base sm:text-lg md:text-xl mt-4">Profile Details</h1>
          </div>

          {/* Editable Fields */}
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 sm:gap-8 mt-6">
              {[
                { label: "Company Name", name: "companyName", disabled: true },
                { label: "Registration Number", name: "registrationNumber" },
                { label: "Company Website", name: "companyWebsite" },
                { label: "GST Number", name: "gstNumber" },
                { label: "First Name", name: "firstName" },
                { label: "Last Name", name: "lastName" },
                { label: "Phone Number", name: "phoneNumber" },
                { label: "Email", name: "officialEmail", type: "email", disabled: true },
                { label: "Address", name: "address" },
                { label: "Country", name: "country" },
                { label: "State", name: "state" },
                { label: "City", name: "city" },
                { label: "Postal Code", name: "postalCode" },
              ].map(({ label, name, type = "text", disabled }) => (
                <div key={name} className="p-3">
                  <label className="block text-gray-500 text-xs sm:text-sm font-semibold uppercase">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={updatedVendor?.[name] || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 border rounded-md mt-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={disabled}
                  />
                </div>
              ))}
              <div className="col-span-2 flex justify-end mt-6">
                <button
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-800 transition-all"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setUpdatedVendor(vendor);
                    setIsEditing(false);
                  }}
                  className="ml-4 px-6 sm:px-8 py-2 sm:py-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 sm:gap-8 mt-6">
              {Object.entries(vendor || {})
                .filter(([key]) => !["id", "password", "created_at"].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-sm">
                    <p className="text-xs sm:text-sm text-gray-500 uppercase font-semibold">{key.replace(/([A-Z])/g, " $1")}</p>
                    <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mt-1">{value || "N/A"}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
