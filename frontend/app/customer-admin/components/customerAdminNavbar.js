"use client";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Activity,
  Bell,
  User,
  LayoutDashboard,
  LogOut,
  Calendar,
  Clipboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function CustomerAdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load customer data from localStorage
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      setCustomer(JSON.parse(customerData));
    }
  }, []);

  const isActive = (path) => pathname === path;

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
         router.push("/SignIn");
       }
     });
   };

  const menuItems = [
    {
      href: "/customer-admin/customerAdminDashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "/customer-admin/add-user",
      icon: <UserPlus className="h-5 w-5" />,
      label: "Add User",
    },
    {
      href: "/customer-admin/user-profile",
      icon: <Users className="h-5 w-5" />,
      label: "User Profiles",
    },
    // {
    //   href: "/customer-admin/activity",
    //   icon: <Activity className="h-5 w-5" />,
    //   label: "Customer Activity",
    // },
    {
      href: "/customer-admin/AdminNotifications",
      icon: <Bell className="h-5 w-5" />,
      label: "Orders",
   
    },
    {
      href: "/customer-admin/PoAutomation",
      icon: <Clipboard className="h-5 w-5" />,
      label: "PoAutomation",
   
    },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur ">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-500 p-1">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center border border-gray-300 shadow-inner">
              <img
                src="/Logo.png"
                alt="M-Place Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 ">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2 text-sm hover:bg-blue-50 hover:text-blue-700 hover:border hover:border-blue-300 transition-colors"
                >
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT: Date & Customer Admin Profile */}
        <div className="flex items-center space-x-6">
          {/* Date */}
          <div className="hidden sm:flex items-center">
            <Calendar className="text-black-900" />
            <span className="ml-2">{currentDate}</span>
          </div>

          <div className="h-10 w-[1px] bg-gray-300"></div>

          {/* Customer Admin Dropdown */}
          <div className="relative">
            <div
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <User size={32} className="text-gray-800" />
              <div className="hidden sm:block text-[16px]">
                {loading && <span>Loading...</span>}
                {error && <span className="text-red-500">{error}</span>}
                {customer && (
                  <span>
                    <span className="text-[14px]">
                      {customer.firstName} {customer.lastName}
                    </span>
                    <br />
                    <p className="text-[#999999] text-[12px]">Customer Admin</p>
                  </span>
                )}
              </div>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                <Link
                  href="/customer-admin/customerAdminProfile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}