"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, ArrowBigLeftDash } from "lucide-react";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import Footer from "@/app/LandingPage/Footer";

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

        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully!",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });

      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: errorData.message || "Failed to update profile. Try again.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Try again later.",
      });
    }
  };

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar disableFilters={true} disableSearch={true} />
      <div className="bg-gray-50">
        <div className="font-sans max-w-3xl mb-6 mx-auto p-6 md:p-6 pt-20 lg:pt-20 mt-12">
          <div className="flex gap-2">
            <button onClick={() => router.push("/customer/products")} className="mt-3">
              <ArrowBigLeftDash size={33}></ArrowBigLeftDash>
            </button>
            <h2 className="font-bold text-xl pt-3">My Profile</h2>
          </div>
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
          <div className="bg-white p-6 rounded-xl shadow-md mt-6">
            <img src="/User_Icon.jpg" alt="hi" className="items-center mx-auto w-40 h-30"></img>
            <h1 className="font-semibold text-lg mb-3 ml-1">Profile Details</h1>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  { label: "Company Name", name: "companyName" },
                  { label: "Registration Number", name: "registrationNumber" },
                  { label: "Company Website", name: "companyWebsite" },
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
                  <div key={name} className="p-4 rounded-lg">
                    <label className="text-sm text-gray-400 uppercase font-semibold">{label}</label>
                    {name === "companyName" || name === "email" ? (
                      <p className="w-full p-2 border rounded-md mt-1 text-[16px] text-gray-900 truncate">{formData[name] || "N/A"}</p>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md mt-1 text-[16px] truncate"
                      />
                    )}
                  </div>
                ))}
                <div className="md:col-span-2 flex justify-end mt-4">
                  <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setFormData(customer);
                      setIsEditing(false);
                    }}
                    className="ml-4 px-6 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {Object.entries(customer)
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
      <Footer />
    </>
  );
};

export default CustomerProfile;