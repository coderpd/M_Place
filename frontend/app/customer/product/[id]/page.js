"use client";

import { useState, useEffect } from "react"; 
import { useParams } from "next/navigation"; 
import Navbar from "../../components/Navbar";
import { ToastContainer, toast } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css"; 
import Link from "next/link"; 
import { Search, ShoppingCart, User, LogOut, Settings, Calendar } from "lucide-react"; 
import Footer from "@/app/LandingPage/Footer"; 

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [cart, setCart] = useState([]);  

  // Fetch customer data and cart details from localStorage
  useEffect(() => {  
    if (typeof window !== "undefined") {
      const storedCustomer = localStorage.getItem("customer");
      const customerData = storedCustomer ? JSON.parse(storedCustomer) : null;
      if (customerData) {
        setCustomerId(customerData.id);
      }

      // Load cart from localStorage
      const storedCart = JSON.parse(localStorage.getItem(`cart_${customerData?.id}`)) || [];
      setCart(storedCart);
    }
  }, []);

  // Fetch product details from API
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/auth/products/get-product/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        setError("Error fetching product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!customerId) {
      toast.error("Please log in to add products to your cart.", { position: "top-right", autoClose: 3000 });
      return;
    }
  
    try {
      const cartItem = {
        customerId: customerId,
        productId: product.id,
        quantity: 1,
      };
  
      const response = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });
  
      const data = await response.json();
      console.log("Add to Cart Response:", data); // Debugging
  
      if (data.success) {
        // Update cart in localStorage
        const newCart = [...cart, { ...product, quantity: 1 }];
        setCart(newCart);
        localStorage.setItem(`cart_${customerId}`, JSON.stringify(newCart));
  
        // Notify Navbar of cart update
        window.dispatchEvent(new Event("storage"));
  
        toast.success("🛒 Product added to cart!", { position: "bottom-right", autoClose: 1000 });
      } else {
        toast.error(`Failed to add product: ${data.message}`, { position: "top-right", autoClose: 1000 });
      }
    } catch (err) {
      console.error("Error adding product to cart:", err);
      toast.error("Error adding product to cart.", { position: "top-right", autoClose: 2000 });
    }
  };
  
  
  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <>
      <Navbar disableFilters={true} disableSearch={true}  />
      <ToastContainer />
      <div className=" w-full mx-auto p-6 pt-24 bg-gray-50 min-h-screen">
        <div className="flex mb-6 mt-6 flex-col md:flex-row items-start border border-gray-300 rounded-lg p-6 shadow-md min-h-[400px]">
          <div className="relative w-full md:w-1/2 flex flex-col items-center md:pr-6">
            <div className="relative w-80 h-80 flex items-center justify-center">
              <img
                src={`http://localhost:5000/uploads/${product.productImage}`}
                alt={product.productName}
                className="w-80 h-80 object-cover rounded-lg shadow-md"
                onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found")}
              />
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 mt-4 rounded-lg w-full max-w-xs"
            >
              Add to Cart
            </button>
          </div> 
          

          <div className="hidden md:block w-[2px] bg-gray-400 h-auto md:min-h-[300px] mx-6"></div>

          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800">{product.productName}</h1>
            <p className="text-2xl font-semibold text-gray-800 mt-6">Price: ₹{product.price}</p>
            <p className="text-lg font-normal text-gray-800 mt-6">Brand: {product.brand}</p>
            <p className="text-lg font-normal text-gray-800 mt-6">Category: {product.category}</p>
            <p className="text-gray-600 text-lg mt-4">{product.description}</p>
            <p className="text-lg font-normal text-gray-800 mt-6">Seller: {product.seller}</p>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ProductDetail;