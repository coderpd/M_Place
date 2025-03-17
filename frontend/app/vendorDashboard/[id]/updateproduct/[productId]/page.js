"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { IoCreateOutline } from "react-icons/io5";

export default function UpdateProduct() {
  const { id, productId } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    category: "",
    price: "",
    seller: "",
    description: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/products/get-product/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setFormData(data.product);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formDataToSend = new FormData();
    formDataToSend.append("productName", formData.productName);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("seller", formData.seller);
    formDataToSend.append("description", formData.description);
    if (selectedImage) {
      formDataToSend.append("productImage", selectedImage);
    }

    try {
      const response = await fetch(`http://localhost:5000/auth/products/update-product/${productId}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

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
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-8 font-sans">
      <h2 className="text-lg font-bold text-black mb-4 text-left flex items-center gap-2">
        <IoCreateOutline size={25} /> Update Product
      </h2>

      <form className="grid grid-cols-2 gap-6 text-sm text-black" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium mb-2">Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
        </div>

        <div>
          <label className="block font-medium mb-2">Make & Model</label>
          <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
        </div>

        <div>
          <label className="block font-medium mb-2">Product Name</label>
          <input type="text" name="productName" value={formData.productName} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
        </div>

        <div>
          <label className="block font-medium mb-2">Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
        </div>

        <div>
          <label className="block font-medium mb-2">Seller</label>
          <input type="text" name="seller" value={formData.seller} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
        </div>

        <div>
          <label className="block font-medium mb-2">Image</label>
          <input type="file" onChange={handleImageChange} className="w-full p-2 border rounded-md" />
        </div>

        {previewImage && (
          <div className="col-span-2 flex justify-center">
            <img src={previewImage} alt="Product Preview" className="w-40 h-40 object-cover rounded-lg border" />
          </div>
        )}

        <div className="col-span-2">
          <label className="block font-medium mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded-md h-24" required />
        </div>

        <div className="col-span-2 flex justify-start">
          <button type="submit" className="bg-[#549DA9] text-white px-6 py-2 rounded-sm hover:bg-[#3E7F88] transition" disabled={updating}>
            {updating ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}