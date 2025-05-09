"use client";

import { useState } from "react";
import { useEffect } from "react";

import { useParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { IoBagAdd } from "react-icons/io5";
import Footer from "@/app/LandingPage/Footer";

export default function AddProduct() {
  const [vendorUserId, setVendorUserId] = useState(null);

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

  useEffect(() => {
    const storedId = localStorage.getItem("vendorUserId"); // ✅ using correct key
    if (storedId) {
      setVendorUserId(storedId);
    } else {
      Swal.fire({
        title: "Vendor Not Logged In!",
        text: "Please log in again to continue adding products.",
        icon: "warning",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/vendor/login"; // Update if your route differs
      });
    }
  }, []);
  

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

    if (!vendorUserId) {
      Swal.fire({
        title: "Error!",
        text: "Vendor user ID not available.",
        icon: "error",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("productName", formData.productName);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("seller", formData.seller);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("vendor_user_id", vendorUserId);
    if (productImage) {
      formDataToSend.append("productImage", productImage);
    }

    try {
      const response = await fetch(
        "/api/auth/products/add-product",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      Swal.fire({
        title: "Success!",
        text: "Product added successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });

      // Reset form
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
    <>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-8 font-sans w-full md:w-4/5 lg:w-3/5">
        <h2 className="text-lg font-bold text-black mb-4 text-left flex items-center gap-2">
          <IoBagAdd size={25} />
          Add New Product
        </h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-black"
          onSubmit={handleSubmit}
        >
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
              list="category-options"
            />
            <datalist id="category-options">
            <option value="Keyboards Wired" />
            <option value="Keyboards Wireless" />
            <option value="Keyboards Ergonomic" />
            <option value="Keyboards Gaming" />

            <option value="Mouse" />
            <option value="Mouse Wired" />
            <option value="Mouse Wireless" />
            <option value="Mouse Optical" />
            <option value="Mouse Laser" />
            <option value="Mouse Gaming" />

            <option value="Trackballs" />
            <option value="Graphic Tablets" />
            <option value="Graphic Styluses" />
            <option value="Touchpads" />

            <option value="Barcode Scanners Wired" />
            <option value="Barcode Scanners Wireless" />
            <option value="Barcode Scanners Handheld" />

            <option value="Ink Cartridges" />
            <option value="Toner Cartridges" />
            <option value="Toner Cartridges Monochrome Color" />
            <option value="Toner Cartridges Color" />
            <option value="Printer Ribbons" />
            <option value="Printer Ribbons Impact Printers" />
            <option value="Maintenance Kits" />
            <option value="Maintenance Kits Fuser Kits" />
            <option value="Maintenance Kits Roller Kits" />
            <option value="Drum Units" />

            <option value="Printer Paper" />
            <option value="Label Paper" />

            <option value="Fax Paper" />
            <option value="Photographic Paper" />

            <option value="USB Flash Drives" />
            <option value="External Hard Drives" />
            <option value="External Hard Drives HDDs" />
            <option value="External Hard Drives SSDs" />
            <option value="Memory Card" />
            <option value="Memory Cards SD" />
            <option value="Memory Cards MicroSD" />
            <option value="Memory Cards CompactFlash" />
            <option value="Backup Tapes" />
            <option value="Backup Tapes LTO" />
            <option value="Backup Tapes DAT" />
            <option value="Backup Tapes DLT" />
            <option value="Optical Media" />
            <option value="Optical Media Blank Discs" />
            <option value="Optical Media RW Discs" />

            <option value="Rechargeable Batteries" />
            <option value="Laptop Batteries" />
            <option value="UPS Batteries" />
            <option value="CMOS Batteries" />

            <option value="Ethernet Cables" />
            <option value="USB Cables" />
            <option value="HDMI Cables" />
            <option value="HDMI Cables Standard" />
            <option value="HDMI Cables Mini" />
            <option value="HDMI Cables Micro" />
            <option value="DisplayPort Cables" />
            <option value="VGA Cables" />
            <option value="Power Cables" />
            <option value="Audio Cables" />
            <option value="Phone Cables" />
            <option value="Adapters" />
            <option value="Charging Cables" />

            <option value="Monitor" />
            <option value="Monitors Standard" />
            <option value="Monitors 4K" />
            <option value="Monitors Curved" />
            <option value="Printers" />
            <option value="Printers Inkjet" />
            <option value="Printers Laser" />
            <option value="Printers Dot Matrix" />
            <option value="Scanners" />
            <option value="Scanners Flatbed" />
            <option value="Scanners Document" />
            <option value="Scanners Barcode" />
            <option value="Label Printers" />
            <option value="Projectors" />
            <option value="Projectors Portable" />
            <option value="Projectors Office" />
            <option value="Projectors Home Theater" />
            <option value="Speakers" />
            <option value="Speakers Desktop" />
            <option value="Speakers Bluetooth" />
            <option value="Speakers USB" />
            <option value="Headsets" />
            <option value="Headsets Wired" />
            <option value="Headsets Wireless" />
            <option value="Headsets Noise-Cancelling" />
            <option value="Webcams" />
            <option value="Webcams Standard" />
            <option value="Webcams HD" />
            <option value="Webcams 4K" />
            <option value="Microphones" />
            <option value="Microphones Desktop" />
            <option value="Microphones USB" />
            <option value="Microphones XLR" />

            <option value="Routers" />
            <option value="Routers Wireless" />
            <option value="Routers Enterprise" />
            <option value="Routers Home" />
            <option value="Switches" />
            <option value="Switches Unmanaged" />
            <option value="Switches Managed" />
            <option value="Switches PoE" />
            <option value="Wi-Fi Extenders" />
            <option value="Wireless Antennas" />
            <option value="Wireless Access Points" />
            <option value="Wireless Access Points Wi-Fi 6" />
            <option value="Wireless Access Points Mesh System" />
            <option value="Wireless Controllers" />
            <option value="Access Points Indoor" />
            <option value="Access Points Outdoor" />
            <option value="Access Points Mesh" />
            <option value="Network Adapters" />
            <option value="Network Adapters Wi-Fi" />
            <option value="Network Adapters Bluetooth" />
            <option value="Network Adapters Ethernet" />
            <option value="Network Cabling Ethernet" />
            <option value="Network Cabling Fiber Optic" />
            <option value="Network Cabling Coaxial" />
            <option value="Network Interface Cards NICs" />
            <option value="USB Hubs" />
            <option value="USB Hubs Standard" />
            <option value="USB Hubs Powered" />
            <option value="KVM Switches" />
            <option value="KVM Switches Keyboard" />
            <option value="KVM Switches Video" />
            <option value="KVM Switches Mouse" />
            <option value="Modems" />
            <option value="Modems DSL" />
            <option value="Modems Cable" />
            <option value="Modems Fiber" />

            <option value="Laptop Bags" />
            <option value="Laptop Sleeves" />
            <option value="Laptop Stand" />
            <option value="Laptop Cooling Pads" />
            <option value="Mouse Pads" />
            <option value="Wrist Rest" />
            <option value="Monitor Mounts" />
            <option value="Monitor Stands" />
            <option value="Surge Protectors" />
            <option value="Power Strips" />
            <option value="Extension Cords" />
            <option value="Desk Organizers" />
            <option value="Label Makers" />
            <option value="Label Tapes" />
            <option value="Power Banks" />
            <option value="Bluetooth Headsets" />
            <option value="Headphones" />
            <option value="Mobile Charging Cables" />

            <option value="Desktop" />
            <option value="Desktop Basic" />
            <option value="Desktop High-Performance" />
            <option value="Desktop All-in-One" />
            <option value="Laptop" />
            <option value="Laptop Business" />
            <option value="Laptop Gaming" />
            <option value="Laptop Ultrabooks" />
            <option value="Workstations Engineering" />
            <option value="Workstations Graphic Design" />
            <option value="Workstations Video Editing" />
            <option value="Thin Clients" />
            <option value="Chromebooks" />
            <option value="Tablets" />
            <option value="Tablets iPads" />
            <option value="Tablets Android" />
            <option value="Tablets Windows" />

            <option value="Cameras" />
            <option value="Cameras DSLR" />
            <option value="Cameras Mirrorless" />
            <option value="Cameras Action" />
            <option value="Cameras Security" />
            <option value="Camcorders" />
            <option value="Video Conferencing Systems" />
            <option value="AV Receivers" />
            <option value="Projector Screens" />

            <option value="Windows" />
            <option value="Windows Home" />
            <option value="Windows Pro" />
            <option value="Windows Enterprise" />
            <option value="macOS" />
            <option value="Linux Distributions" />
            <option value="Linux Distributions Ubuntu" />
            <option value="Linux Distributions CentOS" />

            <option value="Antivirus & Anti-malware" />
            <option value="Firewalls" />
            <option value="VPN Software" />
            <option value="Encryption Tools" />
            <option value="Endpoint Security" />
            <option value="Graphic Design Software" />
            <option value="Video Editing Software" />
            <option value="3D Modeling Software" />
            <option value="Animation Software" />
            <option value="CAD/CAM Software" />

            <option value="Antivirus & Anti-malware Norton" />
            <option value="Antivirus & Anti-malware McAfee" />
            <option value="Antivirus & Anti-malware Bitdefender" />
            <option value="Firewalls ZoneAlarm" />
            <option value="Firewalls Comodo" />
            <option value="VPN Software NordVPN" />
            <option value="VPN Software ExpressVPN" />
            <option value="VPN Software OpenVPN" />
            <option value="Encryption Tools VeraCrypt" />
            <option value="Encryption Tools BitLocker" />
            <option value="Endpoint Security CrowdStrike" />
            <option value="Endpoint Security Symantec" />

            <option value="Office Suites Microsoft Office" />
            <option value="Office Suites Google Workspace" />
            <option value="Office Suites LibreOffice" />
            <option value="Project Management Tools Asana" />
            <option value="Project Management Tools Trello" />
            <option value="Project Management Tools Microsoft Project" />
            <option value="Collaboration Tools Slack" />
            <option value="Collaboration Tools Microsoft Teams" />
            <option value="Collaboration Tools Zoom" />
            <option value="Email Clients Outlook" />
            <option value="Email Clients Thunderbird" />

            <option value="Graphic Design Adobe Photoshop" />
            {/* <option value="Graphic Design Illustrator" /> */}
            <option value="Graphic Design CorelDRAW" />
            <option value="Video Editing Adobe Premiere Pro" />
            <option value="Video Editing Final Cut Pro" />
            <option value="Video Editing DaVinci Resolve" />
            <option value="3D Modeling AutoCAD" />
            <option value="3D Modeling Blender" />
            <option value="3D Modeling SketchUp" />
            <option value="Animation Maya" />
            <option value="Animation After Effects" />
            <option value="Animation Toon Boom" />
            <option value="CAD/CAM Software SolidWorks" />
            <option value="CAD/CAM Software AutoCAD" />
            <option value="CAD/CAM Software Fusion 360" />
          </datalist>
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
            <div className="col-span-1 md:col-span-2 flex justify-center">
              <img
                src={previewImage}
                alt="Product Preview"
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border"
              />
            </div>
          )}

          {/* Row 4 (Full Width) */}
          <div className="col-span-1 md:col-span-2">
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
          <div className="col-span-1 md:col-span-2 flex justify-start">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-sans w-full sm:w-auto"
            >
              Add Product
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
      
    </>
  );
}
