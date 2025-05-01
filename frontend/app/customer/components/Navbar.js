"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, LogOut, Calendar,FileCog } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

const Navbar = ({
  setSearchQuery,
  setCategoryFilter,
  setPriceFilter,
  disableFilters,
  disableSearch,
}) => {
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const [customerUser, setCustomerUser] = useState(() => {
    return JSON.parse(localStorage.getItem("customerUser")) || null;
  });

  // Fetch cart count from API
  const fetchCartCount = async (userId) => {
    try {
      const response = await fetch(`/api/cart/${userId}`);
      const data = await response.json();
      setCartCount(data.cartItems?.length || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    const updateCustomerUser = () => {
      setCustomerUser(JSON.parse(localStorage.getItem("customerUser")));
    };

    // Listen for localStorage changes
    window.addEventListener("storage", updateCustomerUser);

    return () => {
      window.removeEventListener("storage", updateCustomerUser);
    };
  }, []);

  // Fetch cart and user details when component mounts
  useEffect(() => {
    const storedCustomerUser = localStorage.getItem("customerUser");
    if (storedCustomerUser) {
      const userData = JSON.parse(storedCustomerUser);
      setCustomerUser(userData);
      fetchCartCount(userData.id);
    }
  }, []);

  // Listen for cart updates from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      if (customerUser) fetchCartCount(customerUser.id);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [customerUser]);

  // Auto-update cart count every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (customerUser) fetchCartCount(customerUser.id);
    }, 3000);
    return () => clearInterval(interval);
  }, [customerUser]);

  // Logout function
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("customerUser");
        localStorage.removeItem("token");
        router.push("/");
        Swal.fire(
          "Logged Out!",
          "You have been successfully logged out.",
          "success"
        );
      }
    });
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-6 h-20 flex items-center justify-between z-50">
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

      {/* Search Bar */}
      {!disableSearch && (
        <div className="flex items-center w-full max-w-md  p-2 border-2 hover:border-blue-500 rounded-lg">
          <Search className="text-gray-500 mr-2 " size={24} />
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full bg-transparent outline-none text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchQuery && setSearchQuery(e.target.value);
            }}
          />
        </div>
      )}

     {
      !disableSearch &&(<button
        onClick={() => router.push("./PoAutomation")}
        className="text-[#374151] text-[14px] flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 hover:text-blue-700 hover:border hover:border-blue-300 transition-colors"
      >
        <FileCog size={18} /> PO Tracking
      </button>)
     } 
      {!disableFilters && (
        <div className="flex items-center space-x-4">
          {/* Price Filter */}
          <select
            onChange={(e) => setPriceFilter && setPriceFilter(e.target.value)}
            className="p-2 rounded-md border-2 hover:border-blue-500 text-sm "
          >
            <option value="">All Prices</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
        </div>
      )}

      {/* Cart & Profile */}
      <div className="flex items-center space-x-5">
        {/* User Profile Section */}
        <div className="flex relative space-x-2">
          <button onClick={() => setDropdownOpen(!dropdownOpen)}>
            <User className="cursor-pointer text-black" size={32} />
          </button>
          {dropdownOpen && (
            <div className="absolute mt-12 w-36 bg-white border rounded-lg shadow-lg">
              <ul className="py-2 text-md text-gray-700">
                <li>
                  <Link
                    href="/customer/CustomerProfile"
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <User size={20} className="mr-2 text-black" /> My Profile
                  </Link>
                </li>
                <li>
                  <button
                    className="w-full flex items-center text-left px-4 py-2 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} className="mr-2 text-red-500" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
          <div className="mt-1">
            {customerUser && (
              <span className="text-sm">
                {customerUser.personName}
                <p className="text-[#999999] text-[12px] -mt-1">
                  customer User
                </p>
              </span>
            )}
          </div>
        </div>

        {/* Mild Vertical Line */}
        <div className="w-[2px] h-8 bg-gray-300"></div>

        {/* Date Section */}
        <div className="flex items-center p-3">
          <Calendar className="text-black" />
          <span className="ml-2">{currentDate}</span>
        </div>

        {/* Mild Vertical Line */}
        <div className="w-[2px] h-8 bg-gray-300"></div>

        {/* Cart Icon */}
        <Link href="/customer/cart" className="relative">
          <ShoppingCart className="cursor-pointer" size={28} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;