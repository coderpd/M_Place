"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Users,
  List,
  BarChart,
  User,
  LogOut,
  Calendar,
  LayoutDashboard,
  UserPlus,
  UserRoundPen,
  Menu,
  Bell
} from "lucide-react";
import Swal from "sweetalert2";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [vendorAdminID, setVendorAdminID] = useState(null);
  const router = useRouter();

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    try {
      const storedVendor = localStorage.getItem("vendor");
      if (storedVendor) {
        const vendorData = JSON.parse(storedVendor);
        setVendor(vendorData);
        setVendorAdminID(vendorData.id);
      }
    } catch (err) {
      setError("Failed to load vendor details");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/notification/vendor-admin", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('vendorToken')}`
        },
        body: JSON.stringify({ vendorAdminID }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter(n => n.status === "unread").length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (!vendorAdminID) return;
    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [vendorAdminID]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure want to logout?",
      imageUrl: "/logout.gif",
      imageWidth: 127,
      imageHeight: 151,
      imageAlt: "Logout Image",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#3085D6",
      confirmButtonText: "<b>Yes</b>",
      cancelButtonText: "<b>Cancel</b>",
      customClass: {
        confirmButton: "swal-button",
        cancelButton: "swal-button",
        popup: "rounded-alert",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        router.push("/");
      }
    });
  };

  if (!vendor) return null;

  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-white border-b shadow-sm flex items-center justify-between px-6 z-50">
      {/* Left: Brand Name */}
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-500 p-1">
          <div className="w-full h-full bg-white rounded-xl flex items-center justify-center border border-gray-300 shadow-inner">
            <img src="/Logo.png" alt="M-Place Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          </div>
        </div>

        {/* Center: Nav Items */}
        <div className="hidden sm:flex items-center gap-6 text-sm text-gray-700">
          <Link
            href="/vendor-admin"
            className="flex items-center gap-2 p-2 rounded-md text-sm hover:bg-blue-50 hover:text-blue-700 hover:border hover:border-blue-300 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/vendor-admin/addUser"
            className="flex items-center gap-2 p-2 rounded-md text-sm hover:bg-blue-50 hover:text-blue-700 hover:border hover:border-blue-300 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </Link>
          <Link
            href="/vendor-admin/usersprofile"
            className="flex items-center gap-2 p-2 rounded-md text-sm hover:bg-blue-50 hover:text-blue-700 hover:border hover:border-blue-300 transition-colors"
          >
            <Users className="w-4 h-4" />
            Users Profiles
          </Link>
          <Link
            href="/vendor-admin/products"
            className="flex items-center gap-2 p-2 rounded-md text-sm hover:bg-blue-50 hover:text-blue-700 hover:border hover:border-blue-300 transition-colors"
          >
            <List className="w-4 h-4" />
            Vendor Product View
          </Link>
          <Link
  href="/vendor-admin/AdminNotification"
  className="relative flex items-center gap-2 p-2 rounded-md text-sm hover:bg-blue-50 hover:text-blue-700 hover:border hover:border-blue-300 transition-colors"
>
  <Bell className="w-4 h-4" />
  <span>Orders</span>
  
  {unreadCount > 0 && (
    <span className="ml-1 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
      {unreadCount}
    </span>
  )}
</Link>

        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="sm:hidden">
          <button
            className="text-gray-700"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Menu size={32} />
          </button>
        </div>
      </div>

      {/* Right: Date, Notifications and Vendor Profile */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Notifications Bell
        <Link href="/vendor-admin/AdminNotification" className="relative">
          <Bell className="h-6 w-6 text-gray-700 hover:text-blue-700" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Link> */}

        {/* Date */}
        <div className="hidden sm:flex items-center gap-2">
          <Calendar className="text-black-900" />
          <span className="ml-2">{currentDate}</span>
        </div>
        <div className="w-[1px] h-10 bg-gray-200"></div>

        {/* Vendor Admin Name & Dropdown */}
        <div className="relative">
          <div
            className="group flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 hover:text-blue-700 hover:border hover:border-blue-300 transition-colors cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <User size={32} className="text-gray-800 group-hover:text-blue-700 transition-colors" />
            <div className="hidden sm:block text-[14px] ">
              {loading && <span>Loading...</span>}
              {error && <span className="text-red-500">{error}</span>}
              {vendor && (
                <span>
                  {vendor.firstName} {vendor.lastName}
                  <br />
                  <p className="text-[#999999] text-[12px]">Vendor Admin</p>
                </span>
              )}
            </div>
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-[68px] bg-white shadow-lg rounded-md w-48 z-50 p-2 border">
              <Link
                href="/vendor-admin/myProfile"
                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                onClick={() => setDropdownOpen(false)}
              >
                <UserRoundPen size={20} /> My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="p-3 hover:bg-red-100 text-red-600 cursor-pointer flex items-center gap-3 w-full text-left"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {dropdownOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white shadow-lg rounded-md w-full z-50 p-4 border sm:hidden">
          <Link
            href="/vendor-admin"
            className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
            onClick={() => setDropdownOpen(false)}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link
            href="/vendor-admin/addUser"
            className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
            onClick={() => setDropdownOpen(false)}
          >
            <UserPlus size={20} /> Add User
          </Link>
          <Link
            href="/vendor-admin/usersprofile"
            className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
            onClick={() => setDropdownOpen(false)}
          >
            <Users size={20} /> Users Profiles
          </Link>
          <Link
            href="/vendor-admin/products"
            className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
            onClick={() => setDropdownOpen(false)}
          >
            <List size={20} /> Vendor Product View
          </Link>
          <Link
            href="/vendor-admin/performance"
            className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
            onClick={() => setDropdownOpen(false)}
          >
            <BarChart size={20} /> Vendor Performance
          </Link>
        </div>
      )}
    </nav>
  );
}