"use client";

import { useState, useEffect } from "react";
import {
  FaBars,
  FaClipboardList,
  FaPlus,
  FaPen,
  FaShoppingBag,
} from "react-icons/fa";
import {
  CircleUserRound,
  BellRing,
  Calendar,
  UserRoundPen,
  LogOut,
  Bolt,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({ id, children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New order placed!", read: false },
    { id: 2, text: "Stock running low!", read: false },
  ]);

  const router = useRouter();
  const pathname = usePathname();

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/auth/get-vendor/${id}`
        );
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

  const handleSidebarToggle = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleNotification = () => setNotificationOpen(!notificationOpen);
  const handleLogout = () => router.push("/");

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const getPageTitle = () => {
    if (pathname.includes("addproducts")) return "Add Product";
    if (pathname.includes("productdetails")) return "Product Details";
    if (pathname.includes("productcards")) return "Product Portal";

    if (pathname.includes("profile")) return "My Profile";
    return "Vendor Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-[#549DA9] text-white transition-all duration-300 flex flex-col min-h-screen fixed h-screen shadow-lg`}
      >
        <div className="p-4 flex justify-between items-center">
          {isOpen && (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-500 p-1">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center border border-gray-300 shadow-inner">
                <img
                  src="/Logo.png"
                  alt="M-Place Logo"
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              </div>
            </div>
          )}
          <FaBars
            className="cursor-pointer text-xl"
            onClick={handleSidebarToggle}
          />
        </div>
        <ul className="space-y-4 p-4 text-lg">
          <li>
            <button
              onClick={() => router.push(`/vendorDashboard/${id}/productcards`)}
              className="flex items-center gap-3 hover:bg-blue-600 px-3 py-2 rounded-md transition"
            >
              <FaShoppingBag /> {isOpen && "Product Portal"}
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push(`/vendorDashboard/${id}/addproducts`)}
              className="flex items-center gap-3 hover:bg-blue-600 px-3 py-2 rounded-md transition"
            >
              <FaPlus /> {isOpen && "Add Product"}
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                router.push(`/vendorDashboard/${id}/productdetails`)
              }
              className="flex items-center gap-3 hover:bg-blue-600 px-3 py-2 rounded-md transition"
            >
              <FaClipboardList /> {isOpen && "Product Details"}
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
          isOpen ? "ml-64" : "ml-16"
        } transition-all duration-300`}
      >
        {/* Header */}
        <div
          className="bg-white shadow px-9 py-4 flex justify-between items-center border-b fixed top-0 left-0 right-0 z-10"
          style={{ left: isOpen ? "16rem" : "4rem", right: "0" }}
        >
          <h1 className="text-xl font-bold">{getPageTitle()}</h1>
          <div className="flex items-center space-x-6">
            {/* Date */}
            <div className="flex items-center bg-gray-100 p-3 rounded-md shadow-sm">
              <Calendar className="text-gray-600" />
              <span className="ml-2">{currentDate}</span>
            </div>

            {/* Notifications */}
            <div
              className="relative cursor-pointer bg-gray-100 p-3 rounded-md shadow-sm"
              onClick={toggleNotification}
            >
              <BellRing className="text-gray-600" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {unreadNotifications}
                </span>
              )}
            </div>

            {/* User Dropdown */}
            <div
              className="relative flex items-center cursor-pointer bg-gray-100 p-3 rounded-md shadow-sm"
              onClick={toggleDropdown}
            >
              <CircleUserRound className="text-gray-600" />
              <div className="ml-2 hidden sm:block">
                {vendor && (
                  <span>
                    {vendor.firstName} {vendor.lastName}
                  </span>
                )}
                {loading && <span>Loading...</span>}
                {error && <span className="text-red-500">{error}</span>}
              </div>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 top-16 bg-white shadow-lg rounded-md w-56 z-50 p-3 border">
                <ul className="text-lg">
                  <li
                    onClick={() => {
                      router.push(`/vendorDashboard/${id}/myprofile`);
                      setDropdownOpen(false); // Close the dropdown after navigation
                    }}
                    className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                  >
                    <UserRoundPen size={20} /> My Profile
                  </li>

                 
                  <li
                    onClick={handleLogout}
                    className="p-3 hover:bg-red-100 text-red-600 cursor-pointer flex items-center gap-3"
                  >
                    <LogOut size={20} /> Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-gray-50 flex-1 mt-20">{children}</div>
      </div>
    </div>
  );
}