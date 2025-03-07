"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [isSignupCardOpen, setSignupCardOpen] = useState(false);

  const router = useRouter();

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setSidebarOpen(false);
  };

  const openSignupCard = () => {
    setSignupCardOpen(true);
  };
  const closeSignupCard = () => {
    setSignupCardOpen(false);
  };

  const handleContinue = () => {
    if (selectedRole === "Customer") {
      router.push("../CustomerSignup");
    } else if (selectedRole === "Vendor") {
      router.push("../VendorSignUp");
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-500 p-1">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center border border-gray-300 shadow-inner ">
              <img
                src="/Logo.png"
                alt="M-Place Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {["Home", "Features", "Contact Us"].map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              className={`text-base font-medium transition duration-200 ease-in-out ${
                activeLink === link
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => handleLinkClick(link)}
            >
              {link}
            </Link>
          ))}

          <Button
            variant="outline"
            onClick={openSignupCard}
            className="rounded-full text-base px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-80 transition duration-300"
          >
            SIGNUP
          </Button>
          <Button
            variant="outline"
            className="rounded-full text-base px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-80 transition duration-300"
          >
            <Link href="./SignIn">SIGNIN</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-gray-700 hover:text-blue-600"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white shadow-md transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden z-40`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <button
            className="p-2 text-gray-700 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-6 space-y-6 px-6">
          {["Home", "Features", "Contact Us"].map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              className="block text-base font-medium text-gray-700 hover:text-blue-600 transition duration-200"
              onClick={() => handleLinkClick(link)}
            >
              {link}
            </Link>
          ))}
          <Button
            variant="outline"
            className="w-full rounded-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-80 transition duration-300"
            onClick={openSignupCard}
          >
            SIGNUP
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full px-6 py-3 hover:bg-blue-500 hover:text-white transition duration-300"
          >
            <Link href="./SignIn">SIGNIN</Link>
          </Button>
        </nav>
      </div>
 {/* Signup Role Selection Modal */}
 {isSignupCardOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4" onClick={closeSignupCard}>
    <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-xl relative transition-all transform hover:scale-[1.02]" onClick={(e) => e.stopPropagation()}>
      
      {/* Close Button */}
      <button className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition" onClick={closeSignupCard}>
        <X className="w-5 h-5" />
      </button>

      {/* Title */}
      <h2 className="text-xl font-serif font-semibold text-center text-gray-900 mt-4 mb-6">
        Please Select Your Role
      </h2>

      {/* Role Selection Cards */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        
        {/* Customer Card */}
        <Card
          className={`p-6 w-full sm:w-1/2 border ${selectedRole === "Customer" ? "border-[#4A90E2] shadow-lg shadow-gray-300" : "border-[#A0AEC0]"} rounded-xl cursor-pointer bg-gradient-to-b from-[#F8FAFC] to-[#E3F2FD] hover:from-[#E3F2FD] transition-all duration-300 transform hover:scale-105`}
          onClick={() => setSelectedRole("Customer")}
        >
          <h3 className="font-medium text-center text-lg text-gray-900">Customer</h3>
          <p className="text-sm text-center text-gray-600">
            Discover the perfect products just for you!
          </p>
        </Card>

        {/* Vendor Card */}
        <Card
          className={`p-6 w-full sm:w-1/2 border ${selectedRole === "Vendor" ? "border-[#4A90E2] shadow-lg shadow-gray-300" : "border-[#A0AEC0]"} rounded-xl cursor-pointer bg-gradient-to-b from-[#F8FAFC] to-[#E3F2FD] hover:from-[#E3F2FD] transition-all duration-300 transform hover:scale-105`}
          onClick={() => setSelectedRole("Vendor")}
        >
          <h3 className="text-center font-medium text-lg text-gray-900">Vendor</h3>
          <p className="text-sm text-center text-gray-600">
            Put your products in front of customers who are ready to buy!
          </p>
        </Card>
      </div>

      {/* Continue Button */}
      <Button
        className="w-full sm:w-[220px] h-[45px] mx-auto mt-6 bg-[#4A90E2] text-white rounded-full py-2 flex justify-center hover:bg-[#357ABD] transition-all duration-300 transform hover:scale-105 shadow-md shadow-gray-300"
        disabled={!selectedRole}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </div>
  </div>
)}

    </header>
  );
}
