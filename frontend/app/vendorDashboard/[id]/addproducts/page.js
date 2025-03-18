"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";


export default function AddProduct() {
  const { id } = useParams(); // vendor_id

  const [formData, setFormData] = useState({
    category: "",
    brand: "",
    productName: "",
    price: "",
    description: "",
    seller: "",
  });

  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append("productName", formData.productName);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("seller", formData.seller);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("vendor_id", id);
    if (productImage) {
      formDataToSend.append("productImage", productImage);
    }
  
    try {
      const response = await fetch("http://localhost:5000/auth/products/add-product", {
        method: "POST",
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error("Failed to add product");
      }
  
      // ✅ Show SweetAlert2 success popup
      Swal.fire({
        title: "Success!",
        text: "Product added successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
  
      // ✅ Reset form after successful submission
      setFormData({
        category: "",
        brand: "",
        productName: "",
        price: "",
        description: "",
        seller: "",
      });
      setProductImage(null);
      setPreviewImage(null);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-2">
      {/* <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Add New Product</h2> */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Category */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-lg font-medium text-gray-600">Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-3/4 p-3 border rounded-md"
            required
            placeholder="Enter Product Category"
          />
        </div>

        {/* Brand */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-lg font-medium text-gray-600">Make and Model:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-3/4 p-3 border rounded-md"
            required
             placeholder="Enter Make & Model"
          />
        </div>

        {/* Product Name */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-lg font-medium text-gray-600">Product Name:</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            className="w-3/4 p-3 border rounded-md"
            required
            placeholder="Enter Product Name"
          />
        </div>

        {/* Price */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-lg font-medium text-gray-600">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-3/4 p-3 border rounded-md"
            required
              placeholder="Enter Product Price"
          />
        </div>

        {/* Seller */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-lg font-medium text-gray-600">Seller:</label>
          <input
            type="text"
            name="seller"
            value={formData.seller}
            onChange={handleInputChange}
            className="w-3/4 p-3 border rounded-md"
            required
            placeholder="Enter Seller Name"
          />
        </div>

        {/* Image Upload */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-lg font-medium text-gray-600">Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-3/4 p-3 border rounded-md"
            required
          />
        </div>

        {previewImage && (
          <div className="flex items-center space-x-4">
            <div className="w-1/4 text-lg font-medium text-gray-600">Preview:</div>
            <img src={previewImage} alt="Product Preview" className="w-32 h-32 object-cover rounded" />
          </div>
        )}

        {/* Description */}
        <div className="flex items-center space-x-4">
          <label className="w-1/4 text-lg font-medium text-gray-600">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-3/4 p-3 border rounded-md"
            required
              placeholder="Enter Product Description"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg">Add Product</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
} 
