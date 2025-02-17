"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/app/customer/components/Navbar";
import ProductCard from "@/app/customer/components/ProductCard";

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

  
  useEffect(() => {
    updateDisplayedProducts(products, searchQuery, categoryFilter, priceFilter, currentPage);
  }, [searchQuery, categoryFilter, priceFilter, currentPage, products]);

  const updateDisplayedProducts = (allProducts, query, category, price, page) => {
    let filteredProducts = allProducts;

    
    if (query) {
      const searchWords = query.toLowerCase().split(" ");
      filteredProducts = filteredProducts.filter((product) =>
        searchWords.every((word) => product.name.toLowerCase().includes(word))
      );
    }


    if (category) {
      filteredProducts = filteredProducts.filter((product) => 
        product.category.toLowerCase() === category.toLowerCase()
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

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pt-24 lg:pt-28">
      
      <Navbar
        setSearchQuery={setSearchQuery}
        setCategoryFilter={setCategoryFilter}
        setPriceFilter={setPriceFilter}
      />

      {loading && <p className="text-center text-blue-500">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No products found</p>
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
};

export default ProductsPage;
