"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/app/customer/components/Navbar";
import Link from "next/link";
import ProductCard from "@/app/customer/components/ProductCard"; // ✅ Import ProductCard

const PRODUCTS_PER_PAGE = 20; // ✅ 4 rows × 5 columns (20 products per page)

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        setProducts(data);
        updateDisplayedProducts(data, searchQuery, categoryFilter, priceFilter, 1);
      } catch (err) {
        setError("Error loading products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update displayed products when filters change
  useEffect(() => {
    updateDisplayedProducts(products, searchQuery, categoryFilter, priceFilter, currentPage);
  }, [searchQuery, categoryFilter, priceFilter, currentPage, products]);

  // Function to filter and paginate products
  const updateDisplayedProducts = (allProducts, query, category, price, page) => {
    let filteredProducts = allProducts;

    // Apply search filter
    if (query) {
      const searchWords = query.toLowerCase().split(" ");
      filteredProducts = filteredProducts.filter((product) => {
        const productTitle = product.name.toLowerCase();
        return searchWords.every((word) => productTitle.includes(word));
      });
    }

    // Apply category filter
    if (category) {
      filteredProducts = filteredProducts.filter((product) => product.category === category);
    }

    // Apply price sorting filter
    if (price === "low") {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (price === "high") {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Pagination logic
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    setDisplayedProducts(filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE));
  };

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pt-24 lg:pt-28">
      {/* Navbar with filters */}
      <Navbar
        setSearchQuery={setSearchQuery}
        setCategoryFilter={setCategoryFilter}
        setPriceFilter={setPriceFilter}
      />

      {loading && <p className="text-center text-blue-500">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* ✅ Product Grid - 4 Rows × 5 Columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"> {/* ✅ Reduced gap */}
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No products found</p>
        )}
      </div>

     {/* ✅ Pagination Controls with Page Numbers */}
{totalPages > 1 && (
  <div className="flex justify-center items-center mt-6 space-x-2">
    <Button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Previous
    </Button>

    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
      <Button
        key={page}
        variant={page === currentPage ? "default" : "outline"}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </Button>
    ))}

    <Button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
