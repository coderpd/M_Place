"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function UpdateProduct({ product }) {
  const [formData, setFormData] = useState({ ...product });
  const [previewImage, setPreviewImage] = useState(
    product.image ? `http://localhost:5000/uploads/${product.image}` : ""
  );

  const router = useRouter();

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
      setPreviewImage(product.image ? `http://localhost:5000/uploads/${product.image}` : "");
    }
  }, [product]);

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

    const formDataToSend = new FormData();
    formDataToSend.append("category", formData.category);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("company", formData.company);

    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    } else {
      formDataToSend.append("image", product.image);
    }

    try {
      await axios.put(
        `http://localhost:5000/api/products/${formData.id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Product updated successfully!");

      // Clear form fields and image preview
      setFormData({
        category: "",
        brand: "",
        name: "",
        price: "",
        description: "",
        company: "",
        image: null,
      });
      setPreviewImage("");

      setTimeout(() => {
        router.push("/Mainpage");
      }, 2000);
    } catch (error) {
      toast.error("Error updating product.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Update Product</h2>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="category"
          value={formData.category || ""}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="brand"
          value={formData.brand || ""}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="price"
          value={formData.price || ""}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <input
          type="text"
          name="company"
          value={formData.company || ""}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover border rounded-md shadow-md"
          />
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update Product
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}