"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      toast.error("Error updating product.");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2 className="text-xl font-semibold mb-4">Update Product</h2>
      <form className="space-y-4" onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="category"
          value={formData.category || ""}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="brand"
          value={formData.brand || ""}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="price"
          value={formData.price || ""}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        ></textarea>
        <input
          type="text"
          name="company"
          value={formData.company || ""}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover border rounded"
          />
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}