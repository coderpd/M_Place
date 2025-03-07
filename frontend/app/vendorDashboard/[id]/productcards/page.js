"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";

export default function EcommercePage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 20; // Now displaying 20 products per page

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

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.productName.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const selectedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="min-h-screen border border-gray-200">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center border-b border-gray-300">
        <h1 className="text-2xl font-semibold text-gray-900">Product Spot</h1>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md px-3 py-2 w-64 text-black"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-600" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 bg-gray-50">
        {error && <div className="text-red-500">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {selectedProducts.length > 0 ? (
            selectedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 rounded-xl shadow-md overflow-hidden p-4 border border-gray-300 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="relative">
                  {product.productImage && (
                    <img
                      src={`http://localhost:5000/uploads/${product.productImage}`}
                      alt={product.productName}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium text-black">{product.productName}</h3>
                  <p className="text-md text-gray-600">{product.brand}</p>
                  <p className="text-xl font-bold text-black mt-2">₹{product.price}</p>
                </div>
              </div>
            ))
          ) : (
            !loading && <p className="text-gray-600 text-center col-span-5">No products available.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-800 text-white hover:bg-gray-900"
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`${
                  page === currentPage
                    ? "bg-gray-900 text-white"
                    : "bg-white text-black hover:bg-gray-700 hover:text-white border border-gray-400"
                }`}
              >
                {page}
              </Button>
            ))}

            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gray-800 text-white hover:bg-gray-900"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}