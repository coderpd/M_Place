"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProductCards() {
  const { id } = useParams(); // Vendor ID from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/products/get-products/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id]);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-[#FF4500] mb-4">
        🛒 Premium Products, Maximum Impact
      </h2>
      <p className="text-gray-600 text-center mb-8 max-w-xl mx-auto">
        Showcase your top-tier products and attract customers looking for the best in quality. Start making an impact today!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {selectedProducts.length > 0 ? (
          selectedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-100 rounded-xl shadow-lg overflow-hidden p-4 border border-gray-300 transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative">
                {product.productImage && (
                  <img
                    src={`http://localhost:5000/uploads/${product.productImage}`}
                    alt={product.productName}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium">{product.productName}</h3>
                <p className="text-md text-gray-600">Brand: {product.brand}</p>
                <p className="text-xl font-bold text-black-700 mt-2">₹{product.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-4">No products available.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white hover:bg-black"
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black hover:bg-black hover:text-white border border-gray-300"
              }`}
            >
              {page}
            </Button>
          ))}

          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white hover:bg-black"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
