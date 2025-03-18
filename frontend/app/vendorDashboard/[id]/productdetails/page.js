"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaSearch, FaEdit } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetails() {
  const { id } = useParams(); // Vendor ID from URL
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

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
          setProducts(data.products || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          toast.error(err.message);
        }
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

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/auth/products/delete-product/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Error deleting product: " + error.message);
    }
  };

  const handleEdit = (productId) => {
    router.push(`/vendorDashboard/${id}/updateproduct/${productId}`);
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    setCurrentPage(1);
    return products.filter((product) => {
      return (
        product?.productName?.toLowerCase().includes(query) ||
        product?.category?.toLowerCase().includes(query) ||
        product?.brand?.toLowerCase().includes(query)
      
      );
    });
  }, [products, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  const selectedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Product List</h2>
        <div className="relative w-[350px]">
          <input
            type="text"
            placeholder="Search by name, category, brand"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-600 text-center">No products available.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Brand</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Seller</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4">
                    <img
                      src={`http://localhost:5000/uploads/${product.productImage}`}
                      alt={product.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4">{product.productName}</td>
                  <td className="px-6 py-4">{product.brand}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">{product.seller}</td>
                  <td className="px-6 py-4 flex space-x-3">
                    <button onClick={() => handleEdit(product.id)} className="text-[#549DA9] mt-5">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 mt-4">
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

<div className="flex justify-center mt-4 space-x-2">
  {/* Previous Button */}
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    className="px-4 py-2 border rounded bg-blue-500 text-white disabled:bg-blue-300"
  >
    Previous
  </button>

  {/* Page Numbers with Fixed Range */}
  {(() => {
    const rangeSize = 5; // Number of pages to show at a time
    const halfRange = Math.floor(rangeSize / 2);
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, startPage + rangeSize - 1);

    // Ensure the range shifts only when necessary
    if (endPage - startPage + 1 < rangeSize) {
      startPage = Math.max(1, endPage - rangeSize + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-2 border rounded ${
          currentPage === page ? "bg-blue-500 text-white" : "bg-white border-blue-400 hover:bg-blue-200"
        }`}
      >
        {page}
      </button>
    ));
  })()}

  {/* Next Button */}
  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    className="px-4 py-2 border rounded bg-blue-500 text-white disabled:bg-blue-300"
  >
    Next
  </button>
</div>

    </div>
  );
}
