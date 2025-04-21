'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaFileExport } from 'react-icons/fa';
import { Trash2, Loader2, Edit, ChevronRight, ChevronLeft } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

export default function VendorAdminProducts() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const router = useRouter();

  // Adjust items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1920) { // 4K and larger screens
        setItemsPerPage(10);
      } else if (window.innerWidth >= 1440) { // Large laptops
        setItemsPerPage(8);
      } else {
        setItemsPerPage(5); // Default
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const vendorAdminId = localStorage.getItem('userId');
    if (vendorAdminId) {
      fetch(`http://localhost:5000/auth/products/get-products/vendoradmin/${vendorAdminId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          } else {
            setProducts([]);
            setMessage('No products found.');
          }
        })
        .catch((err) => {
          console.error('Error fetching products:', err);
          setMessage('Failed to load products.');
        })
        .finally(() => setLoading(false));
    } else {
      setMessage('Vendor Admin ID not found in localStorage.');
      setLoading(false);
    }
  }, []);

  const handleEdit = (product) => {
    if (!product.id) {
      console.error("No product ID found!");
      return;
    }
    localStorage.setItem("edit_product", JSON.stringify(product));
    router.push(`/vendor-admin/editproducts/${product.id}`);
  };

  const handleDelete = async (productId) => {
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: 'This product will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirmed.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:5000/auth/products/delete-product/${productId}`,
          { method: 'DELETE' }
        );
        if (res.ok) {
          setProducts(products.filter((p) => p.id !== productId));
          Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        } else {
          Swal.fire('Failed!', 'Could not delete product.', 'error');
        }
      } catch (err) {
        console.error('Delete error:', err);
        Swal.fire('Error!', 'An error occurred while deleting the product.', 'error');
      }
    }
  };

  const handleExport = () => {
    // Prepare data for export (excluding image and actions)
    const exportData = filteredProducts.map(product => ({
      'Product Name': product.productName,
      'Brand': product.brand,
      'Category': product.category,
      'Price': `₹${product.price}`,
      'Seller': product.seller
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    
    // Export to Excel
    XLSX.writeFile(wb, "products_export.xlsx");
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      `${product.product_name} ${product.brand} ${product.category} ${product.seller}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen max-w-screen-2xl mx-auto 2xl:px-12">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl 2xl:text-3xl font-semibold text-gray-800">Vendor Users Products</h2>
        <div className="flex gap-4">
          <div className="relative w-full lg:w-[400px] xl:w-[450px]">
            <input
              type="text"
              placeholder="Search by name, category, brand"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-3 pr-10 py-2 2xl:py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm 2xl:text-base"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 2xl:h-5 2xl:w-5" />
          </div>
          <Button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <FaFileExport className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {message && <p className="mb-4 text-blue-600 2xl:text-lg">{message}</p>}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-4 2xl:py-5 text-left text-sm 2xl:text-base font-medium text-gray-700 tracking-wider">Image</th>
              <th className="px-4 py-4 2xl:py-5 text-left text-sm 2xl:text-base font-medium text-gray-700 tracking-wider">Name</th>
              <th className="px-4 py-4 2xl:py-5 text-left text-sm 2xl:text-base font-medium text-gray-700 tracking-wider">Brand</th>
              <th className="px-4 py-4 2xl:py-5 text-left text-sm 2xl:text-base font-medium text-gray-700 tracking-wider">Category</th>
              <th className="px-4 py-4 2xl:py-5 text-left text-sm 2xl:text-base font-medium text-gray-700 tracking-wider">Price</th>
              <th className="px-4 py-4 2xl:py-5 text-left text-sm 2xl:text-base font-medium text-gray-700 tracking-wider">Seller</th>
              <th className="px-4 py-4 2xl:py-5 text-left text-sm 2xl:text-base font-medium text-gray-700 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product.id} className="border-gray-100 hover:bg-blue-50/50">
                <td className="px-4 py-4 2xl:py-5">
                  <img
                    src={`http://localhost:5000/uploads/${product.productImage}`}
                    alt={product.productName}
                    className="h-10 w-10 2xl:h-12 2xl:w-12 rounded object-cover"
                    onError={(e) => e.target.src = '/placeholder-product.png'}
                  />
                </td>
                <td className="px-4 py-4 2xl:py-5 text-sm 2xl:text-base font-medium text-gray-900">{product.productName}</td>
                <td className="px-4 py-4 2xl:py-5 text-sm 2xl:text-base">{product.brand}</td>
                <td className="px-4 py-4 2xl:py-5 text-sm 2xl:text-base">{product.category}</td>
                <td className="px-4 py-4 2xl:py-5 text-sm 2xl:text-base">₹{product.price}</td>
                <td className="px-4 py-4 2xl:py-5 text-sm 2xl:text-base">{product.seller}</td>
                <td className="px-4 py-4 2xl:py-5 text-sm 2xl:text-base">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4 2xl:h-5 2xl:w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 2xl:h-5 2xl:w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="text-sm 2xl:text-base text-gray-700">
          Showing <span className="font-medium">{indexOfFirst + 1}</span> to{" "}
          <span className="font-medium">{Math.min(indexOfLast, filteredProducts.length)}</span> of{" "}
          <span className="font-medium">{filteredProducts.length}</span> results
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 2xl:px-4 2xl:py-2 rounded-lg border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm 2xl:text-base"
          >
            <ChevronLeft className="h-4 w-4 2xl:h-5 2xl:w-5" />
            <span>Previous</span>
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 2xl:px-4 2xl:py-2 border rounded-md text-sm 2xl:text-base font-medium ${currentPage === pageNum
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 2xl:px-4 2xl:py-2 rounded-lg border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm 2xl:text-base"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4 2xl:h-5 2xl:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}