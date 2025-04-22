"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart,
  Sparkle,
  Minus,
  Plus,
  Bell,
  Trash2,
  Package,
  CreditCard,
  Lock,
  ShieldCheck,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "@/app/LandingPage/Footer";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifying, setNotifying] = useState({});

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customerUser");
    if (storedCustomer) {
      const customerData = JSON.parse(storedCustomer);
      setCustomerId(customerData.id);
      fetchCartItems(customerData.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCartItems = useCallback(async (customerId) => {
    try {
      const response = await fetch(`http://localhost:5000/cart/${customerId}`);
      const data = await response.json();
      if (response.ok) {
        setCart(data.cartItems || []);
      } else {
        toast.error("Failed to load cart items");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Error fetching cart items");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = async (cartId, action) => {
    try {
      const response = await fetch("http://localhost:5000/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, action }),
      });

      if (response.ok) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === cartId
              ? {
                  ...item,
                  quantity:
                    action === "increment"
                      ? item.quantity + 1
                      : Math.max(1, item.quantity - 1),
                }
              : item
          )
        );
      } else {
        toast.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      toast.error("Server error");
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/cart/delete/${cartId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setCart(cart.filter((item) => item.id !== cartId));
        toast.success("Item removed from cart");
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast.error("Server error");
    }
  };

  const notifyVendor = async (item) => {
    const storedCustomer = localStorage.getItem("customerUser");
    if (!storedCustomer) {
      toast.error("No customer found. Please log in.");
      return;
    }

    const customerData = JSON.parse(storedCustomer);
    const Email = customerData.Email;

    setNotifying((prev) => ({ ...prev, [item.id]: true }));

    try {
      const response = await fetch(
        "http://localhost:5000/notification/notify-vendor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Email,
            cart: [
              {
                productId: item.product_id,
                productName: item.productName,
                quantity: item.quantity,
              },
            ],
          }),
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        toast.success(`Notification sent to vendor about ${item.productName}!`);
      } else {
        toast.error(`Failed to notify vendor about ${item.productName}`);
      }
    } catch (error) {
      console.error("Error notifying vendor:", error);
      toast.error("Server error while sending notification");
    } finally {
      setNotifying((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );

  if (!customerId)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full mx-4 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Cart Awaits
          </h2>
          <p className="text-gray-600 mb-6">
            Sign in to view your saved items and start shopping
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full font-medium shadow-md hover:shadow-lg"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );

  return (
    <>
      <Navbar disableFilters={true} disableSearch={true} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <ToastContainer position="bottom-right" autoClose={3000} />

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 pt-24 pb-20 h-[350px] text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/4 -left-20 w-64 h-64 bg-white rounded-full mix-blend-overlay"></div>
            <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-white rounded-full mix-blend-overlay"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full p-3 mb-6 shadow-lg">
              <ShoppingCart size={32} className="text-white" />
            </div>
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
              Your Shopping Journey
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
              {cart.length > 0
                ? `Your cart contains ${cart.length} premium ${
                    cart.length === 1 ? "item" : "items"
                  }`
                : "Your curated collection awaits"}
            </p>
          </div>
        </div>

        {/* Cart Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20">
          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md mx-auto text-center transform transition-all hover:scale-[1.02] duration-300">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <ShoppingCart className="w-14 h-14 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Your Cart Feels Light
              </h3>
              <p className="text-gray-500 mb-8 text-lg">
                Discover exceptional products to begin your collection
              </p>
              <a
                href="/customer/products"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-lg shadow-md inline-flex items-center gap-2"
              >
                <Sparkle size={20} />
                Explore Marketplace
              </a>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16  relative z-20">
              {cart.length === 0 ? (
                <div className="flex justify-center">
                  
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="w-full max-w-4xl">
                    {" "}
                    {/* Adjust max-width as needed */}
                    <div className="space-y-6">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="p-6 flex flex-col sm:flex-row gap-6">
                            <div className="relative w-full sm:w-40 h-40 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 group-hover:shadow-inner transition-shadow">
                              <img
                                src={`http://localhost:5000/uploads/${item.productImage}`}
                                alt={item.productName}
                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="flex-1 flex flex-col">
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h3 className="text-xl font-bold text-gray-800">
                                    {item.productName}
                                  </h3>
                                  <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    ₹{item.price.toLocaleString()}
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  
                                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    In Stock
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, "decrement")
                                    }
                                    disabled={item.quantity === 1}
                                    className={`px-4 py-2 bg-gray-50 ${
                                      item.quantity === 1
                                        ? "text-gray-300 cursor-not-allowed"
                                        : "text-gray-600 hover:bg-gray-100"
                                    } transition-colors`}
                                  >
                                    <Minus size={18} />
                                  </button>
                                  <span className="px-6 text-center w-12 border-x border-gray-200 font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, "increment")
                                    }
                                    className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                                  >
                                    <Plus size={18} />
                                  </button>
                                </div>

                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => notifyVendor(item)}
                                    disabled={notifying[item.id]}
                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                                      notifying[item.id]
                                        ? "bg-gray-100 text-gray-400"
                                        : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                                    } transition-colors`}
                                  >
                                    {notifying[item.id] ? (
                                      <Loader2 className="animate-spin h-4 w-4" />
                                    ) : (
                                      <Bell size={16} />
                                    )}
                                    <span className="text-sm font-medium">
                                      Notify
                                    </span>
                                  </button>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="flex items-center gap-1 px-4 py-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={16} />
                                    <span className="text-sm font-medium">
                                      Remove
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Package size={16} className="text-indigo-500" />
                              <span className="text-sm font-medium text-gray-600">
                                Item Total
                              </span>
                            </div>
                            <span className="text-lg font-bold text-gray-800">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};
export default CartPage;
