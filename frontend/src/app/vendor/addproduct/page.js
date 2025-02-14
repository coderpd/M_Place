import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the CSS file for React Toastify

export default function AddProduct({ setProducts, products }) {
  const [formData, setFormData] = useState({
    category: "",
    brand: "",
    name: "",
    price: "",
    description: "",
    company: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please upload an image.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("category", formData.category);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("company", formData.company);
    formDataToSend.append("image", formData.image);

    try {
      const response = await axios.post("http://localhost:5000/api/products", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully!"); // Add toast success notification
      setProducts([...products, response.data]);

      // Reset form fields
      setFormData({
        category: "",
        brand: "",
        name: "",
        price: "",
        description: "",
        company: "",
        image: null,
      });

      setPreviewImage(null);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product."); // Add toast error notification
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Add New Product</h2>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        {/* Category */}
        <div className="flex items-center space-x-4">
          <label htmlFor="category" className="w-1/4 text-lg font-medium text-gray-600"> Product Category:</label>
          <input
            type="text"
            name="category"
            id="category"
            placeholder="Enter product category"
            className="w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Brand */}
        <div className="flex items-center space-x-4">
          <label htmlFor="brand" className="w-1/4 text-lg font-medium text-gray-600">Make and model:</label>
          <input
            type="text"
            name="brand"
            id="brand"
            placeholder="Enter product brand"
            className="w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.brand}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Name */}
        <div className="flex items-center space-x-4">
          <label htmlFor="name" className="w-1/4 text-lg font-medium text-gray-600">Product Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter product name"
            className="w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Price */}
        <div className="flex items-center space-x-4">
          <label htmlFor="price" className="w-1/4 text-lg font-medium text-gray-600">Product Price:</label>
          <input
            type="text"
            name="price"
            id="price"
            placeholder="Enter product price"
            className="w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Description */}
        <div className="flex items-center space-x-4">
          <label htmlFor="description" className="w-1/4 text-lg font-medium text-gray-600">Description:</label>
          <textarea
            name="description"
            id="description"
            placeholder="Enter product description"
            className="w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        {/* Company */}
        <div className="flex items-center space-x-4">
          <label htmlFor="company" className="w-1/4 text-lg font-medium text-gray-600">Seller:</label>
          <input
            type="text"
            name="company"
            id="company"
            placeholder="Enter company name"
            className="w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={formData.company}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Image */}
        <div className="flex items-center space-x-4">
          <label htmlFor="image" className="w-1/4 text-lg font-medium text-gray-600">Image:</label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            className="w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={handleImageChange}
            required
          />
        </div>

        {/* Image Preview */}
        {previewImage && (
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-lg font-medium text-gray-600">Preview:</label>
            <img
              src={previewImage}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover border rounded-md shadow-md"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-100 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-black focus:ring-4 focus:ring-blue-500"
        >
          Add Product
        </button>
      </form>
      <ToastContainer /> {/* Add ToastContainer here */}
    </div>
  );
}