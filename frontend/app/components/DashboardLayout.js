"use client";

import { useState, useEffect } from "react";
import { FaClipboardList } from "react-icons/fa";
import { User, BellRing, Calendar, UserRoundPen, LogOut, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import Footer from "../LandingPage/Footer";

export default function DashboardLayout({ id, children }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");


  const [readNotifications, setReadNotifications] = useState(new Set());

  const router = useRouter();
  const pathname = usePathname();

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let isMounted = true;

    const fetchVendorDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/get-vendor/${id}`, { signal });

        if (!response.ok) {
          throw new Error(`Failed to fetch vendor: ${response.statusText}`);
        }

        const data = await response.json();
        if (isMounted) {
          setVendor(data.vendor);
        }
      } catch (err) {
        if (!signal.aborted) {
          if (isMounted) setError(err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchVendorDetails();
    }

    return () => {
      isMounted = false;
      controller.abort(); // Cancel the request if the component unmounts
    };
  }, [id]);


  useEffect(() => {
    const fetchNotifications = async () => {
      if (!id) return;

      try {
        const response = await fetch(`http://localhost:5000/notification/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();

        if (!data.notifications) {
          console.error("❌ Backend returned no notifications");
          return;
        }

        // Format and sort notifications (latest first)
        const formattedNotifications = data.notifications
          .map((notif) => ({
            ...notif,
            read: notif.status === "read",
            time: new Date(notif.created_at).toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              month: "short",
              day: "numeric",
              year: "numeric",
              timeZone: "Asia/Kolkata", // Ensure IST timezone
              hour12: true, // Enable AM/PM format
            }),
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setNotifications(formattedNotifications);


      } catch (err) {
        console.error("❌ Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [id]);

  // Filter Notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    return filter === "read" ? notif.read : !notif.read;
  });

  // Mark Single Notification as Read
  const markAsRead = async (notifId) => {
    if (!notifId) {
      console.error("Notification ID is missing");
      return;
    }

    try {
      console.log(`🔍 Marking Notification ID: ${notifId} as Read`);
      const response = await fetch(`http://localhost:5000/notification/read/${notifId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notifId ? { ...notif, status: "read", read: true } : notif
          )
        );
        console.log(`✅ Notification ${notifId} marked as read`);
      } else {
        console.error(`Failed to mark notification ${notifId} as read`);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark All as Read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, status: "read", read: true }))
    );
  };

  


  useEffect(() => {
    setFadeIn(false);
    setTimeout(() => setFadeIn(true), 100);
  }, [pathname]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);

    if (!notificationOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when closed
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);


  const handleLogout = () => {
    Swal.fire({
      title: "👋 Logging Out",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#3085D6",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // ✅ Clear local storage before redirecting
        localStorage.clear();

        // ✅ Redirect to the homepage
        router.push("/");
      }
    });
  };



  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow  px-5 py-4 flex justify-between items-center border-b fixed top-0 left-0 right-0 z-10">
        {/* Logo */}
        <div className="w-12 h-12  sm:w-16 sm:h-16 rounded-xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-500 p-1">
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
          className={`absolute sm:relative  top-16 sm:top-0 left-0 w-full sm:w-auto bg-white sm:bg-transparent p-5 sm:p-0 shadow-lg sm:shadow-none transition-all duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
            }`}
        >
          <nav className="flex flex-col  mt-3 sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => router.push(`/vendorDashboard/${id}/productcards`)}
              className={`text-[16px]  pb-1 ${pathname.includes("productcards") ? "border-b-4 border-blue-500" : ""
                }`}
            >
              Product portal
            </button>
            <button
              onClick={() => router.push(`/vendorDashboard/${id}/addproducts`)}
              className={`text-[16px]  pb-1 ${pathname.includes("addproducts") ? "border-b-4 border-blue-500" : ""
                }`}
            >
              Add Product
            </button>
            <button
              onClick={() => router.push(`/vendorDashboard/${id}/productdetails`)}
              className={`text-[16px]   pb-1 ${pathname.includes("productdetails") ? "border-b-4 border-blue-500" : ""
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
          <div className="w-[2px] h-7 bg-gray-400"></div>
          {/* Notifications */}
          <div className="relative">
            <button className="relative cursor-pointer" onClick={toggleNotification}>
              <BellRing className="text-black-900 mt-1 w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>


          {/* Divider */}
          <div className="w-[2px] h-7 bg-gray-400"></div>

          {/* User Dropdown */}
          <div className="relative flex items-center cursor-pointer" onClick={toggleDropdown} >
            <User size={30} className="text-black-900" />
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

      {/* Notification Sidebar */}
      {notificationOpen && (
        <div className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-lg p-4 border-l z-50 overflow-y-auto transition-transform duration-300 ease-in-out transform translate-x-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Notifications</h2>
            <X size={24} className="cursor-pointer" onClick={toggleNotification} />
          </div>

          <hr className="mb-4" />

          {/* Filter & Mark All as Read */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <select
                className="p-2 border rounded-md"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
            <button className="bg-[#06436B] text-white p-2 rounded-md" onClick={markAllAsRead}>
              Mark all as read
            </button>
          </div>

          <hr className="mb-4" />

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <p className="text-gray-500 text-center">No new notifications</p>
          ) : (
            <ul>
              {filteredNotifications.map((notif, index) => (
                <li
                  key={notif.id || index}
                  className={`p-3 mb-2 rounded-md cursor-pointer ${notif.read ? "bg-gray-100 text-gray-600" : "bg-gray-300 text-black"
                    }`}
                >
                  <div>
                    <p className="text-sm font-semibold">{notif.message}</p>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    <div className=" inline-block bg-[#EFF3F5]  rounded-md">{notif.time}</div>
                  </div>
                  <div className="flex justify-between -mt-4 ">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notif.id);
                      }}
                      className="text-blue-500 text-sm ml-[230px]"
                    >
                      Mark as Read
                    </button>

                  </div>
                  <hr className="my-2" />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Page Content */}
      <div className={`p-6 sm:p-8 bg-gray-50 flex-1 mt-20 transition-opacity duration-500 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
        {children}
      </div>


      <Footer/>
    </div>
  );
}




