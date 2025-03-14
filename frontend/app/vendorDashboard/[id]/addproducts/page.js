"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { IoBagAdd } from "react-icons/io5";

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
      const response = await fetch(
        "http://localhost:5000/auth/products/add-product",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      // ✅ Show success message
      Swal.fire({
        title: "Success!",
        text: "Product added successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });

      // ✅ Reset form
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
    <div className="max-w-3xl  mx-auto bg-white p-6 rounded-xl shadow-lg mt-8 font-sans">
      <h2 className="text-lg font-bold text-black mb-4 text-left flex items-center gap-2">
 <IoBagAdd size={25} />
  Add New Product
</h2>

      <form className="grid grid-cols-2 gap-6 text-sm text-black" onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div>
          <label className="block font-medium mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md font-sans"
            required
            placeholder="Enter Product Category"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Make & Model</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md font-sans"
            required
            placeholder="Enter Make & Model"
          />
        </div>

        {/* Row 2 */}
        <div>
          <label className="block font-medium mb-2">Product Name</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md font-sans"
            required
            placeholder="Enter Product Name"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md font-sans"
            required
            placeholder="Enter Product Price"
          />
        </div>

        {/* Row 3 */}
        <div>
          <label className="block font-medium mb-2">Seller</label>
          <input
            type="text"
            name="seller"
            value={formData.seller}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md font-sans"
            required
            placeholder="Enter Seller Name"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md font-sans"
            required
          />
        </div>

        {/* Image Preview */}
        {previewImage && (
          <div className="col-span-2 flex justify-center">
            <img
              src={previewImage}
              alt="Product Preview"
              className="w-40 h-40 object-cover rounded-lg border"
            />
          </div>
        )}

        {/* Row 4 (Full Width) */}
        <div className="col-span-2">
          <label className="block font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md h-24 font-sans"
            required
            placeholder="Enter Product Description"
          />
        </div>

        {/* Submit Button (Full Width) */}
        <div className="col-span-2 flex justify-start">
      <button
         type="submit"
         className="bg-[#549DA9] text-white px-6 py-2 rounded-sm hover:bg-[#3E7F88] transition font-sans"

      >
        Add Product
      </button>
      </div>
       </form>

      <ToastContainer />
    </div>
  );
}