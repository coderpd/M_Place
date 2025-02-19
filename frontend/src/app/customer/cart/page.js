"use client";
import { useCart } from "@/app/customer/context/CartContext";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [company] = useState("RnD Technologies");

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleIncrement = (id) => {
    updateQuantity(id, "increment");
  };

  const handleDecrement = (id) => {
    updateQuantity(id, "decrement");
  };

  const handleNotifyVendor = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifyVendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      const data = await response.json();
      if (data.message) {
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
    <div className="max-w-4xl mx-auto p-6 md:p-6 pt-17 lg:pt-19">
      <ToastContainer /> 

      <h1 className="text-2xl font-bold text-center mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4 px-4 bg-white rounded-lg shadow-md"
              >
                {/* Product Image */}
                <div className="w-30 h-32 flex-shrink-0">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/100?text=No+Image")}
                  />
                </div>

                <div className="w-1/3 text-center">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-700 text-md mt-1">₹{item.price * item.quantity}</p>
                </div>

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
            ))}
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
  );
};

export default CartPage;
