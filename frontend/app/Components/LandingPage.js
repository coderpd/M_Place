"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Menu } from "lucide-react";
import { Linkedin } from "lucide-react";

export default function NavbarAndFooter() {
  const [activeLink, setActiveLink] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSignupCardOpen, setSignupCardOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const openSignupCard = () => {
    setSignupCardOpen(true);
  };

  const closeSignupCard = () => {
    setSignupCardOpen(false);
  };

  const handleContinue = () => {
    if (selectedRole === "Customer") {
      window.location.href = "/CustomerSignup";
    } else if (selectedRole === "Vendor") {
      window.location.href = "/VendorSignUp";
    }
  };

  return (
    <>
      {/* Navbar Section */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4 lg:px-10">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-500 p-1">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center border border-gray-300 shadow-inner">
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
            <Link
              href="./LandingPage/Home"
              className={`text-lg font-medium text-gray-600 hover:text-blue-600 ${
                activeLink === "Home" ? "border-b-2 border-blue-800" : ""
              }`}
              onClick={() => handleLinkClick("Home")}
            >
              Home
            </Link>
            <Link
              href="./LandingPage/Services"
              className={`text-lg font-medium text-gray-600 hover:text-blue-600 ${
                activeLink === "services" ? "border-b-2 border-blue-800" : ""
              }`}
              onClick={() => handleLinkClick("services")}
            >
              Services
            </Link>
            <Link
              href="./LandingPage/ContactSection"
              className={`text-lg font-medium text-gray-600 hover:text-blue-600 ${
                activeLink === "contact-us" ? "border-b-2 border-blue-800" : ""
              }`}
              onClick={() => handleLinkClick("contact-us")}
            >
              Contact Us
            </Link>

            <Button
              variant="outline"
              className="rounded-full text-sm px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-80 transition duration-300"
              onClick={openSignupCard}
            >
              SIGN UP
            </Button>
            <Button
              variant="outline"
              className="rounded-full text-sm px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-80 transition duration-300"
            >
              <Link href="./SignIn">SIGN IN</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
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
            <Link
              href="#home"
              className="block text-base font-medium text-gray-700 hover:text-blue-600 transition duration-200"
              onClick={() => handleLinkClick("home")}
            >
              Home
            </Link>
            <Link
              href="#services"
              className="block text-base font-medium text-gray-700 hover:text-blue-600 transition duration-200"
              onClick={() => handleLinkClick("services")}
            >
              Services
            </Link>
            <Link
              href="#contact-us"
              className="block text-base font-medium text-gray-700 hover:text-blue-600 transition duration-200"
              onClick={() => handleLinkClick("contact-us")}
            >
              Contact Us
            </Link>

            <Button
              variant="outline"
              className="w-full rounded-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-80 transition duration-300"
              onClick={openSignupCard}
            >
              SIGNUP
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-80 transition duration-300"
            >
              <Link href="./SignIn">SIGNIN</Link>
            </Button>
          </nav>
        </div>

        {/* Role Selection Modal */}
        {isSignupCardOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4"
            onClick={closeSignupCard}
          >
            <div
              className="bg-white rounded-xl p-8 max-w-lg w-full shadow-xl relative transition-all transform hover:scale-[1.02]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                onClick={closeSignupCard}
              >
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
                  className={`p-6 w-full sm:w-1/2 border ${
                    selectedRole === "Customer"
                      ? "border-[#4A90E2] shadow-lg shadow-gray-300"
                      : "border-[#A0AEC0]"
                  } rounded-xl cursor-pointer bg-gradient-to-b from-[#F8FAFC] to-[#E3F2FD] hover:from-[#E3F2FD] transition-all duration-300 transform hover:scale-105`}
                  onClick={() => setSelectedRole("Customer")}
                >
                  <h3 className="font-medium text-center text-lg text-gray-900">
                    Customer
                  </h3>
                  <p className="text-sm text-center text-gray-600">
                    Discover the perfect products just for you!
                  </p>
                </Card>

                {/* Vendor Card */}
                <Card
                  className={`p-6 w-full sm:w-1/2 border ${
                    selectedRole === "Vendor"
                      ? "border-[#4A90E2] shadow-lg shadow-gray-300"
                      : "border-[#A0AEC0]"
                  } rounded-xl cursor-pointer bg-gradient-to-b from-[#F8FAFC] to-[#E3F2FD] hover:from-[#E3F2FD] transition-all duration-300 transform hover:scale-105`}
                  onClick={() => setSelectedRole("Vendor")}
                >
                  <h3 className="text-center font-medium text-lg text-gray-900">
                    Vendor
                  </h3>
                  <p className="text-sm text-center text-gray-600">
                    Put your products in front of customers who are ready to
                    buy!
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

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 ml-[160px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start space-y-3 text-center md:text-left">
            <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-500 p-1">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center border border-gray-300 shadow-inner">
                <img
                  src="/Logo.png"
                  alt="M-Place Logo"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            <p className="text-sm font-light">
              © {new Date().getFullYear()} MPlace All Rights Reserved.
            </p>
          </div>

          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start space-y-5">
            <h4 className="text-lg font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="./LandingPage/LegalDisclaimer"
                  className="hover:text-white transition duration-200"
                >
                  Legal Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <h4 className="text-lg font-semibold text-white">Follow Us</h4>
            <div className="flex space-x-6">
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-blue-500 transition duration-300 transform hover:scale-110"
              >
                <Linkedin className="w-7 h-7" />
              </a>
            </div>
          </div>

        
        </div>
      </footer>
    </>
  );
}
