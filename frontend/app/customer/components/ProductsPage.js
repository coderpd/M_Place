"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";

const PRODUCTS_PER_PAGE = 20;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost:5000/auth/products/get-products/all");
        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();

        if (!data || !Array.isArray(data.products)) {
          throw new Error("Invalid API response format");
        }

        setProducts(data.products);
        updateDisplayedProducts(data.products, searchQuery, categoryFilter, priceFilter, 1);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Error loading products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    updateDisplayedProducts(products, searchQuery, categoryFilter, priceFilter, currentPage);
  }, [searchQuery, categoryFilter, priceFilter, currentPage, products]);

  const updateDisplayedProducts = (allProducts, query, category, price, page) => {
    let filteredProducts = allProducts;

    if (query) {
      filteredProducts = filteredProducts.filter((product) =>
        product.category?.toLowerCase().includes(query.toLowerCase()) ||  product.brand?.toLowerCase().includes(query.toLowerCase()) || product.description?.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (price === "low") {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (price === "high") {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    }

    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    setDisplayedProducts(filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE));
  };

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const handleProductClick = (productId) => {
    router.push(`/customer/product/${productId}`);
  };

  return (
    <>
 <Navbar
  allProducts={products}
  setDisplayedProducts={setDisplayedProducts}
  setSearchQuery={setSearchQuery} 
  setCategoryFilter={setCategoryFilter}
  setPriceFilter={setPriceFilter}
  disableFilters={false}
  disableSearch={false}
/>



      <div className="max-w-7xl mx-auto p-4 md:p-6 pt-24 lg:pt-28">
        {loading && <p className="text-center text-blue-500">Loading products...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-100 rounded-xl shadow-lg overflow-hidden p-4 border border-gray-300 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative">
                  {product.productImage && (
                    <img
                      src={`http://localhost:5000/uploads/${product.productImage}`}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="mt-4 text-center">
                <h3 className="text-lg font-medium">{product.productName}</h3>
                <p className="text-md text-gray-600">{product.brand}</p>
                <p className="text-xl font-bold text-black-700 mt-2">₹{product.price}</p>
              </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No products found</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="bg-blue-500 text-white hover:bg-black">
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`${page === currentPage ? "bg-blue-600 text-white" : "bg-white text-black hover:bg-black hover:text-white border border-gray-300"}`}
              >
                {page}
              </Button>
            ))}
            <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="bg-blue-500 text-white hover:bg-black">
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsPage;