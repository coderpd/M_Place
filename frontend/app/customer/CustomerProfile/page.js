"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle } from "lucide-react";
import Navbar from "../components/Navbar";

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
      setFormData(customerData);
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        const updatedCustomer = await response.json();
        console.log("Profile updated:", updatedCustomer);

        localStorage.setItem("customer", JSON.stringify(formData));
        setCustomer(formData);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
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
    <>
      <Navbar disableFilters={true} disableSearch={true} />
      <div className="max-w-4xl mx-auto p-6 md:p-6 pt-20 lg:pt-20">
        {/* Profile Card */}
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-xl shadow-md flex flex-col items-center">
          <div className="w-24 h-24 flex items-center justify-center bg-white rounded-full border-4 border-white shadow-lg">
            <UserCircle className="w-20 h-20 text-gray-500" />
          </div>
          {isEditing ? (
            <input
              type="text"
              name="companyName"
              value={formData.companyName || ""}
              onChange={handleChange}
              className="mt-4 text-3xl font-semibold text-black p-1 border rounded w-full text-center"
            />
          ) : (
            <h2 className="text-3xl font-semibold mt-4">{customer?.companyName || "N/A"}</h2>
          )}
        </div>

        {/* Profile Details Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          {isEditing ? (
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {[
                { label: "Company Name", name: "companyName" },
                { label: "Registration Number", name: "registrationNumber" },
                { label: "GST Number", name: "gstNumber" },
                { label: "First Name", name: "firstName" },
                { label: "Last Name", name: "lastName" },
                { label: "Phone Number", name: "phoneNumber" },
                { label: "Email", name: "email", type: "email" },
                { label: "Address", name: "address" },
                { label: "Country", name: "country" },
                { label: "State", name: "state" },
                { label: "City", name: "city" },
                { label: "Postal Code", name: "postalCode" },
              ].map(({ label, name, type = "text" }) => (
                <div key={name} className="bg-gray-100 p-4 rounded-lg">
                  <label className="text-xs text-gray-600 uppercase font-semibold">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md mt-1"
                  />
                </div>
              ))}
              <div className="col-span-2 flex justify-end mt-4">
                <button
                  className="px-6 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setFormData(customer);
                    setIsEditing(false);
                  }}
                  className="ml-4 px-6 py-2 bg-gray-400 text-white rounded-md shadow-md hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {Object.entries(customer)
                .filter(([key]) => !["id", "password", "created_at"].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 uppercase font-semibold">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{value || "N/A"}</p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Edit Button */}
        <div className="flex justify-center mt-6">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerProfile;