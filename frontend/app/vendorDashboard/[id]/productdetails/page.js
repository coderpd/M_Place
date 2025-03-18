"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaSearch, FaEdit } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id]);

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/auth/products/delete-product/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }

      setProducts(products.filter((product) => product.id !== productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Error deleting product: " + error.message);
    }
  };

  const handleEdit = (productId) => {
    router.push(`/vendorDashboard/${id}/updateproduct/${productId}`);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="flex justify-center mb-6">
        <div className="flex items-center bg-white border rounded-full shadow-md p-3 w-full sm:w-96">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none border-none text-gray-700"
          />
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-600">No products available.</p>
      ) : (
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <thead className="bg-blue-500 text-white">
            <tr>
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
                  <button onClick={() => handleEdit(product.id)} className="text-blue-600 mt-5">
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
      )}
    </div>
  );
}
