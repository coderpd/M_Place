"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User, Building, Phone, Mail, Globe, MapPin, UserCircle, Lock } from "lucide-react";
import Swal from "sweetalert2";


export default function ProfilePage() {
  const { id } = useParams();
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
  
      // ✅ Show SweetAlert on success
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-xl shadow-md flex flex-col items-center">
        <div className="w-24 h-24 flex items-center justify-center bg-white rounded-full border-4 border-white shadow-lg">
          <UserCircle className="w-20 h-20 text-gray-500" />
        </div>
        {isEditing ? (
          <input
            type="text"
            name="companyName"
            value={updatedVendor?.companyName || ""}
            onChange={handleInputChange}
            className="mt-4 text-3xl font-semibold text-black p-1 border rounded"
          />
        ) : (
          <h2 className="text-3xl font-semibold mt-4">{vendor?.companyName || "N/A"}</h2>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
  {Object.entries(vendor || {})
    .filter(([key]) => key !== "password" && key !== "createdAt" && key !== "created_at") // Check both variations
    .map(([key, value]) => (
      <div key={key} className="flex items-center space-x-3 p-4 border rounded-lg shadow-sm">
        <div>
          <p className="text-gray-600 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
          {isEditing ? (
            <input
              type="text"
              name={key}
              value={updatedVendor?.[key] || ""}
              onChange={handleInputChange}
              className="text-gray-900 font-semibold border p-1 rounded w-full"
            />
          ) : (
            <p className="text-gray-900 font-semibold">{value || "N/A"}</p>
          )}
        </div>
      </div>
    ))}
</div>



<div className="flex justify-center mt-6 space-x-4">
  {isEditing ? (
    <>
      <button
        onClick={handleSave}
        className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600"
      >
        Save
      </button>
      <button
        onClick={() => {
          setUpdatedVendor(vendor); // Reset changes
          setIsEditing(false); // Exit edit mode
        }}
        className="bg-gray-400 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-500"
      >
        Cancel
      </button>
    </>
  ) : (
    <button
      onClick={() => setIsEditing(true)}
      className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600"
    >
      Edit
    </button>
  )}
</div>

    </div>
  );
}
