"use client";

import { useState, useEffect } from "react";
import { FaClipboardList } from "react-icons/fa";
import { CircleUserRound, BellRing, Calendar, UserRoundPen, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function DashboardLayout({ id, children }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/get-vendor/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch vendor: ${response.statusText}`);
        }
        const data = await response.json();
        setVendor(data.vendor);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVendorDetails();
    }
  }, [id]);

  useEffect(() => {
    setFadeIn(false);
    setTimeout(() => setFadeIn(true), 100);
  }, [pathname]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleNotification = () => setNotificationOpen(!notificationOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Logout Function with SweetAlert2
  const handleLogout = () => {
    Swal.fire({
      title: "👋 Logging Out",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#549DA9",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/");
        Swal.fire({
          title: "✅ Logged Out",
          text: "You have successfully logged out.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow px-5 py-4 flex justify-between items-center border-b fixed top-0 left-0 right-0 z-10">
        {/* Logo */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-500 p-1">
          <div className="w-full h-full bg-white rounded-xl flex items-center justify-center border border-gray-300 shadow-inner">
            <img src="/Logo.png" alt="M-Place Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={toggleMenu} className="sm:hidden">
          <FaClipboardList size={24} className="cursor-pointer" />
        </button>

        {/* Navigation Links */}
        <div
          className={`absolute sm:relative top-16 sm:top-0 left-0 w-full sm:w-auto bg-white sm:bg-transparent p-5 sm:p-0 shadow-lg sm:shadow-none transition-all duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
          }`}
        >
          <nav className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => router.push(`/vendorDashboard/${id}/productcards`)}
              className={`text-lg font-bold pb-1 ${
                pathname.includes("productcards") ? "border-b-4 border-[#549DA9]" : ""
              }`}
            >
              Product Portal
            </button>
            <button
              onClick={() => router.push(`/vendorDashboard/${id}/addproducts`)}
              className={`text-lg font-bold pb-1 ${
                pathname.includes("addproducts") ? "border-b-4 border-[#549DA9]" : ""
              }`}
            >
              Add Product
            </button>
            <button
              onClick={() => router.push(`/vendorDashboard/${id}/productdetails`)}
              className={`text-lg font-bold pb-1 ${
                pathname.includes("productdetails") ? "border-b-4 border-[#549DA9]" : ""
              }`}
            >
              Product Details
            </button>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Date */}
          <div className="hidden sm:flex items-center">
            <Calendar className="text-black-900" />
            <span className="ml-2">{currentDate}</span>
          </div>

          {/* Notifications */}
          <button className="relative cursor-pointer" onClick={toggleNotification}>
            <BellRing className="text-black-900" />
          </button>

          {/* Divider */}
          <div className="w-[2px] h-7 bg-gray-400"></div>

          {/* User Dropdown */}
          <div className="relative flex items-center cursor-pointer" onClick={toggleDropdown}>
            <CircleUserRound className="text-black-900" />
            <div className="ml-2 hidden text-md sm:block">
              {vendor && <span>{vendor.firstName} {vendor.lastName}</span>}
              {loading && <span>Loading...</span>}
              {error && <span className="text-red-500">{error}</span>}
            </div>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 top-[96px] bg-white shadow-lg rounded-md w-48 z-50 p-3 border">
              <ul className="text-lg">
                <li
                  onClick={() => {
                    router.push(`/vendorDashboard/${id}/myprofile`);
                    setDropdownOpen(false);
                  }}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                >
                  <UserRoundPen size={20} /> My Profile
                </li>
                <li onClick={handleLogout} className="p-3 hover:bg-red-100 text-red-600 cursor-pointer flex items-center gap-3">
                  <LogOut size={20} /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Page Content with Smooth Transition */}
      <div className={`p-6 sm:p-8 bg-gray-50 flex-1 mt-20 transition-opacity duration-500 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
        {children}
      </div>
    </div>
  );
}