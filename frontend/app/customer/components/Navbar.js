import { useState } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/customer/context/CartContext"; // Import cart context

const Navbar = ({ setSearchQuery, setCategoryFilter, setPriceFilter }) => {
  const [search, setSearch] = useState("");
  const { cart } = useCart(); // Get cart data

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query); // Update local state
    setSearchQuery(query); // Send search query to ProductsPage.js
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
      <div className="flex items-center w-full max-w-md bg-gray-100 p-2 rounded-lg transition hover:ring-2 hover:ring-blue-500">
        <Search className="text-gray-500 mr-2 transition hover:text-blue-500" size={24} />
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full bg-transparent outline-none text-sm"
          value={search}
          onChange={handleSearch} // Trigger search function
        />
      </div>

      {/* Filters Section */}
      <div className="flex items-center space-x-4">
        {/* Category Filter */}
        <select
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 rounded-md border bg-white text-sm"
        >
          <option value="">All Categories</option>
          <option value="men's clothing">Men's Clothing</option>
          <option value="women's clothing">Women's Clothing</option>
          <option value="electronics">Electronics</option>
          <option value="jewelery">Jewelry</option>
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

      {/* Icons Section */}
      <div className="flex items-center space-x-5">
        <User className="cursor-pointer text-gray-700 transition hover:text-blue-500" size={28} />

        {/* Cart Icon with Link */}
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
