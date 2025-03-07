"use client";
import { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifying, setNotifying] = useState(false); // Added for notifyVendor loading state

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
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
      setLoading(true);
      const response = await fetch(`http://localhost:5000/cart/${customerId}`);
      const data = await response.json();
      if (response.ok) {
        setCart(data.cartItems || []);
      } else {
        toast.error(data.message || "Failed to load cart items");
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
              ? { ...item, quantity: action === "increment" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
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
      const response = await fetch(`http://localhost:5000/cart/delete/${cartId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCart(cart.filter((item) => item.id !== cartId));
        toast.success("Item removed from cart!");
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast.error("Server error");
    }
  };

  const notifyVendor = async () => {
    if (cart.length === 0) {
      toast.warn("Your cart is empty!");
      return;
    }

    const storedCustomer = localStorage.getItem("customer");
    if (!storedCustomer) {
      toast.error("No customer found. Please log in.");
      return;
    }

    const customerData = JSON.parse(storedCustomer);
    const email = customerData.email;
    const cartWithVendors = cart.map((item) => ({
      productId: item.product_id, 
      productName: item.productName,
      vendorEmail: item.vendorEmail || "unknown@example.com",
      quantity: item.quantity,
    }));
    

    setNotifying(true);
    try {
      const response = await fetch("http://localhost:5000/notification/notify-vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cart: cartWithVendors }),
      });

      const responseData = await response.json();
      if (response.ok) {
        toast.success(responseData.message || "Vendor notified successfully!");
      } else {
        toast.error(responseData.error || "Failed to notify vendor");
      }
    } catch (error) {
      console.error("Error notifying vendor:", error);
      toast.error("Server error");
    } finally {
      setNotifying(false);
    }
  };

  if (loading) return <div className="text-center">Loading cart items...</div>;
  if (!customerId) return <div>No customer data found. Please log in.</div>;

  return (
    <>
      <Navbar disableFilters={true} disableSearch={true} />
      <div className="max-w-4xl mx-auto p-6 pt-20">
        <ToastContainer />
        <h1 className="text-2xl font-bold text-center mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500">Your cart is empty.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-4 px-4 bg-white rounded-lg shadow-md">
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={`http://localhost:5000/uploads/${item.productImage}`}
                  alt={item.productName}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="text-center w-1/3">
                <h2 className="text-xl font-semibold">{item.productName}</h2>
                <p className="text-gray-600 text-md mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, "decrement")}
                  disabled={item.quantity === 1}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  -
                </button>
                <span className="text-md">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, "increment")}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  +
                </button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800 ml-2">
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
        {cart.length > 0 && (
          <button
            onClick={notifyVendor}
            className={`w-full bg-blue-600 text-white p-3 mt-6 rounded-md hover:bg-blue-700 ${
              notifying ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={notifying}
          >
            {notifying ? "Notifying Vendor..." : "Notify Vendor"}
          </button>
        )}
      </div>
    </>
  );
};

export default CartPage;
