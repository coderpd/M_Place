"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/customer/components/Navbar";
import { useCart } from "@/app/customer/context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError("Error fetching product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Product added to cart!"); // Show success notification
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 pt-24">
        <div className="flex flex-col md:flex-row items-start border border-gray-300 rounded-lg p-6 shadow-md min-h-[400px]">
          <div className="relative w-full md:w-1/2 flex flex-col items-center md:pr-6">
            <div className="relative w-80 h-80 flex items-center justify-center">
              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                alt={product.name}
                className="w-80 h-80 object-cover rounded-lg shadow-md"
                onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found")}
              />
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-black text-white px-6 py-2 mt-4 rounded-lg w-full max-w-xs"
            >
              Add to Cart
            </button>
          </div>

          <div className="hidden md:block w-[2px] bg-gray-400 h-auto md:min-h-[300px] mx-6"></div>

          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-600 text-lg mt-4">{product.description}</p>
            <p className="text-2xl font-semibold text-gray-800 mt-6">Price: ₹{product.price}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
