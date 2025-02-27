"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProductCards() {
  const { id } = useParams(); // Vendor ID from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Adjusted to maintain full rows

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/products/get-products/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        if (isMounted) {
          setProducts(data.products);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchProducts();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const selectedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  }, [products, currentPage]);

  return (
    <div className="p-6 min-h-screen">
      {error && <div className="text-red-500">{error}</div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {selectedProducts.length > 0 ? (
          selectedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-200 rounded-lg shadow-md overflow-hidden p-4 border border-gray-300 transition-all duration-300 transform hover:scale-105 h-[330px] w-full mx-auto flex flex-col items-center justify-between"
            >
              <div className="relative w-full h-40 flex justify-center items-center">
                {product.productImage && (
                  <img
                    src={`http://localhost:5000/uploads/${product.productImage}`}
                    alt={product.productName}
                    className="w-full h-full object-cover rounded-md"
                  />
                )}
              </div>
              <div className="text-center mt-2">
                <h3 className="text-lg font-medium h-10 overflow-hidden text-ellipsis whitespace-nowrap">{product.productName}</h3>
                <p className="text-md text-gray-600">{product.brand}</p>
                <p className="text-xl font-bold mt-1 text-gray-800">₹{product.price}</p>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-gray-500 text-center col-span-5">No products available.</p>
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