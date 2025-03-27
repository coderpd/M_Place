"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  X,
  User,
  Store,
  Check,
  ArrowRight,
  Home,
  Settings,
  Mail,
} from "lucide-react";
import { RiMenuUnfold2Fill } from "react-icons/ri";

export default function Navbar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSignupCardOpen, setSignupCardOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeLink, setActiveLink] = useState("");
  const router = useRouter();

  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const openSignupCard = () => setSignupCardOpen(true);
  const closeSignupCard = () => {
    setSignupCardOpen(false);
    setSelectedRole(null);
  };

  const handleContinue = () => {
    if (selectedRole === "Customer") {
      router.push("/customer-signup");
    } else if (selectedRole === "Vendor") {
      router.push("/vendor-signup");
    }
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with improved gradient */}
            <div className="flex items-center space-x-2">
              <div className="relative w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 shadow-sm">
                <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center border border-gray-200/80">
                  <img
                    src="/Logo.png"
                    alt="M-Place Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className={`text-lg font-medium text-gray-600 hover:text-blue-600 hover:border-b-2 ${
                  activeLink === "Home" ? "border-b-2 border-blue-600" : ""
                }`}  
                onClick={() => handleLinkClick("Home")}
              >
               Home
              </Link>

              <Link
                href="/#services"
                className={`text-lg font-medium text-gray-600 hover:text-blue-600 hover:border-b-2 ${
                  activeLink === "services" ? "border-b-2 border-blue-600" : ""
                }`}
                onClick={() => handleLinkClick("services")}
              >
                Services
              </Link>

              <Link
                href="/#ContactSection"
                className={`text-lg font-medium text-gray-600 hover:text-blue-600 hover:border-b-2 ${
                  activeLink === "ContactSection"
                    ? "border-b-2 border-blue-600"
                    : ""
                }`}
                onClick={() => handleLinkClick("ContactSection")}
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

              <Link href="/SignIn">
                <Button
                  variant="outline"
                  className="rounded-full text-sm px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-80 transition duration-300"
                >
                  SIGN IN
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <RiMenuUnfold2Fill className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar - Updated Version */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar Container */}
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-6 space-y-4">
                <Link
                  href="/"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                    activeLink === "Home"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handleLinkClick("Home")}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeLink === "Home" ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <Home className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Home</span>
                </Link>

                <Link
                  href="/#services"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                    activeLink === "services"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handleLinkClick("services")}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeLink === "services" ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Services</span>
                </Link>

                <Link
                  href="/#ContactSection"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                    activeLink === "ContactSection"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handleLinkClick("ContactSection")}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeLink === "ContactSection"
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Contact</span>
                </Link>
              </nav>

              {/* Auth Buttons */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-white">
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      openSignupCard();
                      setSidebarOpen(false);
                    }}
                    className="w-full justify-center rounded-xl px-6 py-3 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm hover:opacity-80 transition duration-300"
                  >
                    Sign Up
                  </Button>
                  <Link href="/SignIn" className="block w-full">
                    <Button
                      variant="outline"
                      className="w-full justify-center rounded-xl px-6 py-3 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm hover:opacity-80 transition duration-300"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Role Selection Modal */}
      {isSignupCardOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 p-4 backdrop-blur-sm">
          <div
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Close Button */}
            <button
              onClick={closeSignupCard}
              className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Glossy Header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10"></div>
              <div className="relative p-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome!
                </h2>
                <p className="text-gray-500">
                  Choose how you'd like to join us
                </p>
              </div>
            </div>

            {/* 3D Card Selection */}
            <div className="px-8 pb-8">
              <div className="grid gap-6 mt-4">
                {/* Customer Card */}
                <div
                  className={`relative p-6 rounded-2xl transition-all duration-300 cursor-pointer group overflow-hidden ${
                    selectedRole === "Customer"
                      ? "ring-2 ring-blue-500 bg-white shadow-lg"
                      : "bg-gray-50 hover:shadow-md border border-gray-100"
                  }`}
                  onClick={() => setSelectedRole("Customer")}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-xl ${
                        selectedRole === "Customer"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-200 text-gray-600 group-hover:bg-blue-50"
                      }`}
                    >
                      <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Customer</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Discover amazing products tailored for you
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === "Customer"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 group-hover:border-blue-300"
                      }`}
                    >
                      {selectedRole === "Customer" && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  {selectedRole === "Customer" && (
                    <div className="absolute inset-0 -z-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-60"></div>
                    </div>
                  )}
                </div>

                {/* Vendor Card */}
                <div
                  className={`relative p-6 rounded-2xl transition-all duration-300 cursor-pointer group overflow-hidden ${
                    selectedRole === "Vendor"
                      ? "ring-2 ring-indigo-500 bg-white shadow-lg"
                      : "bg-gray-50 hover:shadow-md border border-gray-100"
                  }`}
                  onClick={() => setSelectedRole("Vendor")}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-xl ${
                        selectedRole === "Vendor"
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-gray-200 text-gray-600 group-hover:bg-indigo-50"
                      }`}
                    >
                      <Store className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Vendor</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Grow your business with our marketplace
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === "Vendor"
                          ? "border-indigo-500 bg-indigo-500"
                          : "border-gray-300 group-hover:border-indigo-300"
                      }`}
                    >
                      {selectedRole === "Vendor" && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  {selectedRole === "Vendor" && (
                    <div className="absolute inset-0 -z-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-60"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Animated Continue Button */}
              <button
                className={`w-full mt-8 py-4 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center ${
                  selectedRole
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={!selectedRole}
                onClick={handleContinue}
              >
                <span className="flex items-center">
                  Continue as {selectedRole || "..."}
                  <ArrowRight
                    className={`w-5 h-5 ml-2 transition-all ${
                      selectedRole ? "group-hover:translate-x-1" : ""
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
