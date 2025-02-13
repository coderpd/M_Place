"use client";
import { useCart } from "@/app/customer/context/CartContext"; // Ensure correct path
import { Trash2 } from "lucide-react";
import Navbar from "@/app/customer/components/Navbar";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart(); // Get cart data

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleIncrement = (id) => {
    updateQuantity(id, "increment"); // Increment quantity of product
  };

  const handleDecrement = (id) => {
    updateQuantity(id, "decrement"); // Decrement quantity of product
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 md:p-6 pt-24 lg:pt-28"> {/* ✅ Centered cart container */}
        <h1 className="text-2xl font-bold text-center mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4"> {/* ✅ Ensures all items are evenly spaced */}
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b py-4 px-4 bg-white rounded-lg shadow-md" // ✅ Boxed layout with shadow
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/100?text=No+Image")}
                    />
                  </div>

                  {/* Product Info (Title & Price) */}
                  <div className="w-1/3 text-center">
                    <h2 className="text-md font-semibold">{item.name}</h2>
                    <p className="text-gray-600 text-md mt-1">₹{item.price * item.quantity}</p>
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
              ))}
            </div>

            {/* Total Price Section */}
            <div className="mt-6 p-4 border-t flex justify-between items-center bg-gray-100 rounded-lg shadow-md">
              <h2 className="text-xl font-bold">Total Price:</h2>
              <p className="text-2xl font-semibold text-gray-900">₹{totalPrice.toFixed(2)}</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
