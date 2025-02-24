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

        // Update localStorage
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
    <div className="max-w-4xl  mx-auto p-6 md:p-6 pt-20 lg:pt-20">
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
            className="mt-4 text-3xl font-semibold text-black p-1 border rounded"
          />
        ) : (
          <h2 className="text-3xl font-semibold mt-4">{customer?.companyName || "N/A"}</h2>
        )}
      </div>

      {/* Profile Details Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {isEditing ? (
          // Editable form
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">State</label>
              <input
                type="text"
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">City</label>
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="font-semibold">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode || ""}
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
          // Display profile info
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(customer)
              .filter(([key]) => !["id", "password", "created_at"].includes(key))
              .map(([key, value]) => (
                <div key={key}>
                  <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p>{value}</p>
                </div>
              ))}
          </div>
        )}
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
                setFormData(customer); // Reset changes
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
            Edit Profile
          </button>
        )}
      </div>
    </div>
    </>
  );
};

export default CustomerProfile;
