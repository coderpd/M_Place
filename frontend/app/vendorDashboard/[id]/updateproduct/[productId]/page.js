"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function UpdateProduct() {
  const { id, productId } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState({
    productName: "",
    brand: "",
    category: "",
    price: "",
    seller: "",
    description: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/auth/products/get-product/${productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data.product);

        if (data.product.productImage) {
          setPreviewImage(`http://localhost:5000/uploads/${data.product.productImage}`);
        }
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("brand", product.brand);
    formData.append("category", product.category);
    formData.append("price", product.price);
    formData.append("seller", product.seller);
    formData.append("description", product.description);
    
    if (selectedImage) {
      formData.append("productImage", selectedImage);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/auth/products/update-product/${productId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      // Show SweetAlert for success
      Swal.fire({
        title: "Success!",
        text: "Product updated successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => router.push(`/vendorDashboard/${id}/productdetails`), 1500);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded-lg"
        encType="multipart/form-data"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Product Name</label>
          <input
            type="text"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Brand</label>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Seller</label>
          <input
            type="text"
            name="seller"
            value={product.seller}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Product Preview"
              className="mt-2 w-32 h-32 object-cover border rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center justify-center"
          disabled={updating}
        >
          {updating ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 border-4 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
              Updating...
            </>
          ) : (
            "Update Product"
          )}
        </button>
      </form>
    </div>
  );
}
