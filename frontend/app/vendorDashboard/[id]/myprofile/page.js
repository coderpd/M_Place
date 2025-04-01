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
  
      // Store updated vendor in localStorage
      localStorage.setItem("vendor", JSON.stringify(updatedVendor));
  
      // Trigger re-render
      window.dispatchEvent(new Event("storage"));
  
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
    <div className="bg-gray-50 -mt-14">
      <div className="max-w-3xl font-sans mx-auto p-6 pt-20">
        {/* Back Button and Title */}
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="mt-3">
            <ArrowBigLeftDash size={33} />
          </button>
          <h2 className="font-bold text-xl pt-3">My Profile</h2>
        </div>

        {/* Edit Button */}
        <div className="flex justify-end mt-6">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 font-semibold"
            >
              EDIT PROFILE
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          <img src="/User_Icon.jpg" alt="hi" className="items-center mx-auto w-40 h-30 "></img>
          <h1 className="font-semibold text-lg mt-4 text-left">Profile Details</h1>

          {/* Editable Fields */}
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-4">
              {[
                { label: "Company Name", name: "companyName", disabled: true },
                { label: "Registration Number", name: "registrationNumber" },
                { label: "Company Website", name: "companyWebsite" },
                { label: "GST Number", name: "gstNumber" },
                { label: "First Name", name: "firstName" },
                { label: "Last Name", name: "lastName" },
                { label: "Phone Number", name: "phoneNumber" },
                { label: "Email", name: "email", type: "email", disabled: true },
                { label: "Address", name: "address" },
                { label: "Country", name: "country" },
                { label: "State", name: "state" },
                { label: "City", name: "city" },
                { label: "Postal Code", name: "postalCode" },
              ].map(({ label, name, type = "text", disabled }) => (
                <div key={name} className="p-4 rounded-lg">
                  <label className="text-sm text-gray-400 uppercase font-semibold">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={updatedVendor?.[name] || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md mt-1 text-[16px] overflow-hidden text-ellipsis whitespace-nowrap"
                    disabled={disabled}
                  />
                </div>
              ))}
              <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setUpdatedVendor(vendor);
                    setIsEditing(false);
                  }}
                  className="ml-4 px-6 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-4">
              {Object.entries(vendor || {})
                .filter(([key]) => !["id", "password", "created_at"].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 uppercase font-semibold">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="text-[16px] font-semibold text-gray-900 mt-1 truncate">{value || "N/A"}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}