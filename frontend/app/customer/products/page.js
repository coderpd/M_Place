"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "../Components/Navbar";
import CategoryMenu from "../Components/Categories";
import Footer from "@/app/LandingPage/Footer";

const PRODUCTS_PER_PAGE = 20;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const categoryFromURL = searchParams.get("category") || "";
    setCategoryFilter(categoryFromURL);
  }, [searchParams]);

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
        product.category?.toLowerCase().includes(query.toLowerCase()) ||
        product.brand?.toLowerCase().includes(query.toLowerCase()) ||
        product.productName?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (category) {
      const formattedCategory = category.trim().toLowerCase();

      filteredProducts = filteredProducts.filter((product) => {
        const productCategory = product.category ? product.category.trim().toLowerCase() : '';

        return productCategory.includes(formattedCategory);
      });
    }

    if (price === "low") {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (price === "high") {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    }

    const totalFilteredPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    setCurrentPage((prev) => (prev > totalFilteredPages ? 1 : prev));

    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    setDisplayedProducts(filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE));
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    router.push(`/customer/products?category=${encodeURIComponent(category)}`);
  };

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  if (!isMounted) return null;

  const handleProductClick = (productId) => {
    router.push(`/customer/product/${productId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        allProducts={products}
        setDisplayedProducts={setDisplayedProducts}
        setSearchQuery={setSearchQuery}
        setCategoryFilter={setCategoryFilter}
        setPriceFilter={setPriceFilter}
        disableFilters={false}
        disableSearch={false}
      />

      <div className="pt-[80px]">
        <CategoryMenu setCategoryFilter={handleCategoryChange} />
      </div>

      <div className="w-full h-full mx-auto p-4 md:p-6 pt-12 lg:pt-12 flex-grow">
        {loading && <p className="text-center text-blue-500">Loading products...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 rounded-xl shadow-lg overflow-hidden p-4 border border-gray-300 transition-all duration-300 transform hover:scale-105 cursor-pointer"
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
                <div className="mt-4 text-left">
                  <h3 className="text-lg font-bold hover:text-blue-700 text-gray-800 mb-3 truncate w-full">{product.productName}</h3>
                  <p className="text-md text-gray-600">{product.brand}</p>
                  <p className="text-xl font-bold text-black mt-1">₹{product.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No products found</p>
          )}
        </div>

        {displayedProducts.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 my-6 space-x-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white hover:bg-blue-700"
            >
              Previous
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
              const page = startPage + index;

              return (
                page <= totalPages && (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`${page === currentPage
                      ? "bg-blue-500 text-white hover:bg-blue-700"
                      : "bg-white text-black hover:bg-blue-700 hover:text-white border border-gray-300"
                      }`}
                  >
                    {page}
                  </Button>
                )
              );
            })}

            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-blue-500 text-white hover:bg-blue-700"
            >
              Next
            </Button>
          </div>
        )}

      </div>

      <Footer/>


    </div>
  );
};

export default ProductsPage;