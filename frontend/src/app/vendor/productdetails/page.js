"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function ProductDetails({ setSelectedPage, setEditProduct }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products.", error);
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditProduct(product);
    setSelectedPage("updateProduct");
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter((product) => product.id !== id));
        alert("Product deleted successfully.");
      } catch (error) {
        console.error("Error deleting product.", error);
        alert("Error deleting product.");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-center mb-6">
        <div className="flex items-center bg-white border rounded-full shadow-md p-3 w-96">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none border-none text-gray-700"
          />
        </div>
      </div>

      <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-6 py-3 text-left">Image</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Price</th>
            <th className="px-6 py-3 text-left">Category</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-100">
              <td className="px-6 py-4 text-center">
                <img
                  src={`http://localhost:5000/uploads/${product.image}`}
                  alt={product.name}
                  className="w-16 h-16 object-cover mx-auto rounded-md"
                />
              </td>
              <td className="px-6 py-4">{product.name}</td>
              <td className="px-6 py-4">₹{product.price}</td>
              <td className="px-6 py-4">{product.category}</td>
              <td className="px-6 py-4 flex space-x-4 justify-center">
                <button
                  className="text-grey-600 hover:text-grey-800 text-lg transition"
                  onClick={() => handleEditClick(product)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-grey-600 hover:text-grey-800 text-lg transition"
                  onClick={() => handleDeleteClick(product.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <Button
            className="bg-blue-500 text-white hover:bg-black"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Button
              key={page}
              className={`bg-blue-500 text-white hover:bg-black ${page === currentPage ? "bg-blue-700" : "bg-blue-500"}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            className="bg-blue-500 text-white hover:bg-black"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}