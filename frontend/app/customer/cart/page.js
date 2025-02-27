"use client";

import { useCart } from "@/app/customer/context/CartContext";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import Navbar from "../components/Navbar";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleIncrement = (id) => {
    updateQuantity(id, "increment");
  };

  const handleDecrement = (id) => {
    updateQuantity(id, "decrement");
  };

  const handleNotifyVendor = async () => {
    try {
      // Collect the product info and vendor details
      const vendorNotifications = cart.map(item => ({
        product_id: item.id,
        vendor_id: item.vendorId, // Ensure vendorId is added here
        message: `A purchase has been made for your product: ${item.productName}. Quantity: ${item.quantity}. Total: ₹${(item.price * item.quantity).toFixed(2)}.`,
      }));
  
      console.log("Sending notification:", JSON.stringify(vendorNotifications, null, 2));  // Log the notification data
  
      const response = await fetch("http://localhost:5000/notification/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendorNotifications),
      });
  
      const data = await response.json();
      if (data.success) {
        toast.success("Vendor has been notified successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to notify the vendor. Try again!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error notifying vendor:", error);
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  
  

  return (
    <>
      <Navbar disableFilters={true} disableSearch={true} />
      <div className=" font-sans max-w-4xl mx-auto p-6 md:p-6 pt-20 lg:pt-20">
        <ToastContainer />

        <h1 className="text-2xl font-bold text-center mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => {
                const productImage = item.productImage
                  ? `http://localhost:5000/uploads/${item.productImage}`
                  : "https://via.placeholder.com/100?text=No+Image";

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b py-4 px-4 bg-white rounded-lg shadow-md"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/100?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="w-1/3 text-center">
                      <h2 className="text-xl font-semibold">{item.productName}</h2>
                      <p className="text-gray-600 text-md mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDecrement(item.id)}
                        disabled={item.quantity === 1}
                        className="px-3 py-1 bg-gray-300 rounded"
                      >
                        -
                      </button>
                      <span className="text-md">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrement(item.id)}
                        className="px-3 py-1 bg-gray-300 rounded"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Total Price Section */}
            <div className="mt-6 p-4 border-t flex justify-between items-center bg-gray-100 rounded-lg shadow-md">
              <h2 className="text-xl font-bold">Total Price:</h2>
              <p className="text-2xl font-semibold text-gray-900">₹{totalPrice.toFixed(2)}</p>
            </div>

            {/* Notify Vendor Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleNotifyVendor}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Notify Vendor
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
