"use client"; // ✅ Ensure this is at the very top

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Correct import for Next.js 13+
import { Search, ShoppingCart, User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/customer/context/CartContext";

const Navbar = ({ setSearchQuery, setCategoryFilter, setPriceFilter, disableFilters, disableSearch }) => {
  const [search, setSearch] = useState("");
  const { cart } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter(); // ✅ No more errors

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);
    setSearchQuery(query);
  };

  // Logout confirmation function
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      router.push("/"); // Redirect to home page
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-6 h-20 flex items-center justify-between z-50">
      {/* Left Section: Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 flex items-center justify-center bg-black text-white font-bold rounded-lg text-lg">
          M
        </div>
        <span className="text-2xl font-bold text-gray-800">Mplace</span>
      </div>

      {/* Search Bar */}
      {!disableSearch && (
        <div className="flex items-center w-full max-w-md bg-gray-100 p-2 rounded-lg transition hover:ring-2 hover:ring-blue-500">
          <Search className="text-gray-500 mr-2 transition hover:text-blue-500" size={24} />
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full bg-transparent outline-none text-sm"
            value={search}
            onChange={handleSearch}
          />
        </div>
      )}

      {/* Filters Section */}
      {!disableFilters && (
        <div className="flex items-center space-x-4">
          {/* Category Filter */}
          <select
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 rounded-md border bg-white text-sm"
          >
            <option value="">All Categories</option>
            <option value="laptop">Laptop</option>
            <option value="keyboard">Keyboard</option>
            <option value="mouse">Mouse</option>
            <option value="cpu">CPU</option>
            <option value="monitor">Monitor</option>
            <option value="hard disk">Hard Disk</option>
          </select>

          {/* Price Filter */}
          <select
            onChange={(e) => setPriceFilter(e.target.value)}
            className="p-2 rounded-md border bg-white text-sm"
          >
            <option value="">All Prices</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
        </div>
      )}

      {/* Icons Section */}
      <div className="flex items-center space-x-5 relative">
        {/* User Profile Dropdown */}
        <div className="relative mt-2">
          <button onClick={() => setDropdownOpen(!dropdownOpen)}>
            <User className="cursor-pointer text-gray-700 transition hover:text-blue-500" size={28} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-50">
              <ul className="py-2 text-md text-gray-700">
                <li>
                  <Link
                    href="./CustomerProfile"
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <User size={20} className="mr-2 text-black" /> My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/customer/settings"
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <Settings size={20} className="mr-2 text-black" /> Settings
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
        </div>

        {/* Cart Icon */}
        <Link href="/customer/cart" className="relative">
          <ShoppingCart className="cursor-pointer text-gray-700 transition hover:text-blue-500" size={28} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
