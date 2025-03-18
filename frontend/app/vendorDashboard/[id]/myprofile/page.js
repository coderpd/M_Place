"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UserCircle } from "lucide-react";
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
    <div className="max-w-3xl mx-auto p-8">
      {/* Profile Card */}
      <div className="relative bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-white p-10 rounded-2xl shadow-xl flex flex-col items-center">
  <div className="w-28 h-28 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-md rounded-full border-4 border-white shadow-md">
    <UserCircle className="w-24 h-24 text-white opacity-80" />
  </div>
  {isEditing ? (
    <input
      type="text"
      name="companyName"
      value={updatedVendor?.companyName || ""}
      onChange={handleInputChange}
      className="mt-4 text-2xl font-semibold text-black p-2 border rounded-md w-60 text-center bg-white shadow-md"
    />
  ) : (
    <h2 className="text-2xl font-semibold mt-4">{vendor?.companyName || "N/A"}</h2>
  )}
</div>


      {/* Vendor Details */}
      <div className="mt-6 p-6 bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-2xl">
        <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Vendor Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(vendor || {})
            .filter(([key]) => key !== "password" && key !== "createdAt" && key !== "created_at" && key !== "id") // Exclude "id"
            .map(([key, value]) => (
              <div key={key} className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-md">
                <p className="text-gray-600 text-sm uppercase">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={updatedVendor?.[key] || ""}
                    onChange={handleInputChange}
                    className="text-gray-900 font-semibold border p-2 rounded w-full mt-1"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold mt-1">{value || "N/A"}</p>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center mt-6 space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => {
                setUpdatedVendor(vendor); 
                setIsEditing(false); 
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}