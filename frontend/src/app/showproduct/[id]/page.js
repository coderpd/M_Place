"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function ShowProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (!product) {
    return <p className="text-center text-gray-500 mt-10 text-lg">Loading product details...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 to-orange-100 p-6">
      {/* Card Container */}
      <div className="max-w-4xl w-full bg-[#FFF8E7] bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-[#F4D03F] transition-all duration-300
                      hover:border-yellow-400 hover:shadow-xl">
        
        {/* Content */}
        <div className="flex flex-col md:flex-row transition-all duration-300">
          
          {/* Left: Product Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt={product.name}
              className="w-full max-w-sm h-auto object-cover rounded-xl shadow-md transform hover:scale-105 transition duration-300"
            />
          </div>

          {/* Right: Product Details */}
          <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-10">
            <h2 className="text-4xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-gray-700 text-lg mt-3">{product.description}</p>

            <div className="mt-5 space-y-3 text-lg">
              <p className="text-gray-800">
                <strong className="text-gray-900">Brand:</strong> {product.brand}
              </p>
              <p className="text-gray-800">
                <strong className="text-gray-900">Company:</strong> {product.company}
              </p>
              <p className="text-gray-800">
                <strong className="text-gray-900">Category:</strong> {product.category}
              </p>
              <p className="text-3xl font-semibold text-[#FF6B6B]">
                Price: ₹{product.price}
              </p>
              <p className="text-gray-800">
                <strong className="text-gray-900">Stock:</strong> {product.stock} available
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-6">
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-gradient-to-r from-[#4DB6AC] to-[#26A69A] text-white text-lg font-semibold rounded-lg shadow-md hover:scale-105 transition-all duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
