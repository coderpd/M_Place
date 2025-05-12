"use client";
import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Download,
  ArrowLeft,
  Loader2,
  Search,
  MapPin,
  Edit,
  Check,
  X,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "@/app/LandingPage/Footer";

const POAutomationPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPO, setSelectedPO] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCustomerAddress, setShowCustomerAddress] = useState(false);
  const [showVendorAddress, setShowVendorAddress] = useState(false);
  const [showShipToAddress, setShowShipToAddress] = useState(false);
  const [editingShipTo, setEditingShipTo] = useState(false);
  const [shipToForm, setShipToForm] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const storedCustomer = localStorage.getItem("customerUser");
        if (!storedCustomer) {
          setLoading(false);
          return;
        }

        const customerData = JSON.parse(storedCustomer);
        const response = await fetch(
          `/api/po/customer/${customerData.id}`
        );
        const data = await response.json();

        if (response.ok) {
          setPurchaseOrders(data.purchaseOrders || []);
        } else {
          toast.error("Failed to load purchase orders");
        }
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
        toast.error("Error fetching purchase orders");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseOrders();
  }, []);

  // Filter POs based on search term
  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (po.po_number?.toLowerCase() || "").includes(searchLower) ||
        (po.customer_name?.toLowerCase() || "").includes(searchLower) ||
        (po.customer_company?.toLowerCase() || "").includes(searchLower) ||
        (po.items?.[0]?.vendor_name?.toLowerCase() || "").includes(
          searchLower
        ) ||
        (po.items?.[0]?.vendor_company?.toLowerCase() || "").includes(
          searchLower
        ) ||
        (po.items?.[0]?.product_name?.toLowerCase() || "").includes(
          searchLower
        ) ||
        (po.status?.toLowerCase() || "").includes(searchLower)
      );
    });
  }, [purchaseOrders, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPOs.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPOs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPOs, currentPage, itemsPerPage]);

  const handleDownloadPDF = async (poId) => {
    setDownloading((prev) => ({ ...prev, [poId]: true }));
    try {
      const response = await fetch(
      `/api/po/generate-pdf/${poId}`
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `PO_${poId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("PDF downloaded successfully");
      } else {
        toast.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Error generating PDF");
    } finally {
      setDownloading((prev) => ({ ...prev, [poId]: false }));
    }
  };

  const formatAddress = (address, city, state, country, postalCode) => {
    return `${address}, ${city}, ${state}, ${country} - ${postalCode}`;
  };

  const handleEditShipTo = (po) => {
    setEditingShipTo(true);
    setShipToForm({
      address: po.ship_to_address || po.customer_address,
      city: po.ship_to_city || po.customer_city,
      state: po.ship_to_state || po.customer_state,
      country: po.ship_to_country || po.customer_country,
      postalCode: po.ship_to_postal_code || po.customer_postal_code,
    });
  };

  const handleCancelEdit = () => {
    setEditingShipTo(false);
  };

  const handleSaveShipTo = async () => {
    try {
      const response = await fetch(
        `/api/po/${selectedPO.id}/ship-to-address`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shipToForm),
        }
      );

      if (response.ok) {
        // Update the local state
        setPurchaseOrders((prev) =>
          prev.map((po) =>
            po.id === selectedPO.id
              ? {
                  ...po,
                  ship_to_address: shipToForm.address,
                  ship_to_city: shipToForm.city,
                  ship_to_state: shipToForm.state,
                  ship_to_country: shipToForm.country,
                  ship_to_postal_code: shipToForm.postalCode,
                }
              : po
          )
        );
        setSelectedPO((prev) => ({
          ...prev,
          ship_to_address: shipToForm.address,
          ship_to_city: shipToForm.city,
          ship_to_state: shipToForm.state,
          ship_to_country: shipToForm.country,
          ship_to_postal_code: shipToForm.postalCode,
        }));
        toast.success("Ship-to address updated successfully");
        setEditingShipTo(false);
      } else {
        toast.error("Failed to update ship-to address");
      }
    } catch (error) {
      console.error("Error updating ship-to address:", error);
      toast.error("Error updating ship-to address");
    }
  };

  const handleShipToChange = (e) => {
    const { name, value } = e.target;
    setShipToForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <Navbar disableFilters={true} disableSearch={true} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <ToastContainer position="bottom-right" autoClose={3000} />

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 pt-24 pb-20 h-[350px] text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/4 -left-20 w-64 h-64 bg-white rounded-full mix-blend-overlay"></div>
            <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-white rounded-full mix-blend-overlay"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full p-3 mb-6 shadow-lg">
              <FileText size={32} className="text-white" />
            </div>
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
              Purchase Order Tracking
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {purchaseOrders.length > 0
                ? `You have ${purchaseOrders.length} purchase ${
                    purchaseOrders.length === 1 ? "order" : "orders"
                  }`
                : "Your purchase orders will appear here"}
            </p>
          </div>
        </div>

        {/* PO Container */}
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20 pb-16">
          {selectedPO ? (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              {/* Header with back button */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <button
                  onClick={() => setSelectedPO(null)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <ArrowLeft size={18} />
                  Back to all POs
                </button>
                <button
                  onClick={() => handleDownloadPDF(selectedPO.id)}
                  disabled={downloading[selectedPO.id]}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {downloading[selectedPO.id] ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <Download size={16} />
                  )}
                  Download PDF
                </button>
              </div>

              {/* PO Content */}
              <div className="p-8">
                {/* PO Header */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-blue-600 mb-2">
                    PURCHASE ORDER
                  </h1>
                  <div className="border-t-2 border-b-2 border-gray-300 py-3">
                    <div className="flex justify-between px-4">
                      <span className="font-semibold">
                        PO No: {selectedPO.po_number}
                      </span>
                      <span className="font-semibold">
                        Date:{" "}
                        {new Date(selectedPO.order_date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer, Vendor, and Ship To Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-6 border-b border-gray-300">
                  {/* Bill To (Customer) */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-3 text-gray-700">
                      Bill To (Customer)
                    </h3>
                    <div className="space-y-1">
                      <p className="text-gray-800">
                        <b>Name</b> - {selectedPO.customer_name}
                      </p>
                      <p className="text-gray-800">
                        <b>Company</b> - {selectedPO.customer_company}
                      </p>
                      <p className="text-gray-800">
                        <b>Email</b> - {selectedPO.customer_email || "N/A"}
                      </p>
                      <div className="mt-2">
                        <button
                          onClick={() =>
                            setShowCustomerAddress(!showCustomerAddress)
                          }
                          className="flex items-center text-blue-600 text-sm"
                        >
                          <MapPin size={14} className="mr-1" />
                          {showCustomerAddress
                            ? "Hide Address"
                            : "View Address"}
                        </button>
                        {showCustomerAddress && (
                          <p className="text-gray-800 mt-1 text-sm">
                            {formatAddress(
                              selectedPO.customer_address,
                              selectedPO.customer_city,
                              selectedPO.customer_state,
                              selectedPO.customer_country,
                              selectedPO.customer_postal_code
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-lg text-gray-700">
                        Ship To (Customer)
                      </h3>
                      {!editingShipTo ? (
                        <button
                          onClick={() => handleEditShipTo(selectedPO)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveShipTo}
                            className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm"
                          >
                            <Check size={14} />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {!editingShipTo ? (
                      <>
                        <div className="space-y-1">
                          <p className="text-gray-800">
                            <b>Name</b> - {selectedPO.customer_name}
                          </p>
                          <p className="text-gray-800">
                            <b>Company</b> - {selectedPO.customer_company}
                          </p>
                        </div>
                        <div className="mt-2">
                          <button
                            onClick={() =>
                              setShowShipToAddress(!showShipToAddress)
                            }
                            className="flex items-center text-blue-600 text-sm"
                          >
                            <MapPin size={14} className="mr-1" />
                            {showShipToAddress
                              ? "Hide Address"
                              : "View Address"}
                          </button>
                          {showShipToAddress && (
                            <p className="text-gray-800 mt-1 text-sm">
                              {formatAddress(
                                selectedPO.ship_to_address ||
                                  selectedPO.customer_address,
                                selectedPO.ship_to_city ||
                                  selectedPO.customer_city,
                                selectedPO.ship_to_state ||
                                  selectedPO.customer_state,
                                selectedPO.ship_to_country ||
                                  selectedPO.customer_country,
                                selectedPO.ship_to_postal_code ||
                                  selectedPO.customer_postal_code
                              )}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={shipToForm.address}
                            onChange={handleShipToChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={shipToForm.city}
                              onChange={handleShipToChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              State
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={shipToForm.state}
                              onChange={handleShipToChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Country
                            </label>
                            <input
                              type="text"
                              name="country"
                              value={shipToForm.country}
                              onChange={handleShipToChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              name="postalCode"
                              value={shipToForm.postalCode}
                              onChange={handleShipToChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ship From (Vendor) */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-3 text-gray-700">
                      Ship From (Vendor)
                    </h3>
                    <div className="space-y-1">
                      <p className="text-gray-800">
                        <b>Name</b> - {selectedPO.items[0].vendor_name}
                      </p>
                      <p className="text-gray-800">
                        <b>Company</b> - {selectedPO.items[0].vendor_company}
                      </p>
                      <p className="text-gray-800">
                        <b>Email</b> -{" "}
                        {selectedPO.items[0].vendor_email || "N/A"}
                      </p>
                      <div className="mt-2">
                        <button
                          onClick={() =>
                            setShowVendorAddress(!showVendorAddress)
                          }
                          className="flex items-center text-blue-600 text-sm"
                        >
                          <MapPin size={14} className="mr-1" />
                          {showVendorAddress ? "Hide Address" : "View Address"}
                        </button>
                        {showVendorAddress && (
                          <p className="text-gray-800 mt-1 text-sm">
                            {formatAddress(
                              selectedPO.items[0].vendor_address,
                              selectedPO.items[0].vendor_city,
                              selectedPO.items[0].vendor_state,
                              selectedPO.items[0].vendor_country,
                              selectedPO.items[0].vendor_postal_code
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Items Table */}
                <div className="mb-8 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPO.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.product_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">
                              {item.quantity}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm text-gray-900">
                              ₹{item.unit_price.toLocaleString("en-IN")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              ₹{item.total_price.toLocaleString("en-IN")}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="border-t border-gray-300 pt-4 mb-8">
                  <div className="space-y-2">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="text-gray-900">
                        ₹
                        {selectedPO.total_amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {/* CGST (9%) */}
                    <div className="flex justify-between">
                      <span className="text-gray-700">CGST (9%):</span>
                      <span className="text-gray-900">
                        ₹
                        {(selectedPO.total_amount * 0.09).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </div>

                    {/* SGST (9%) */}
                    <div className="flex justify-between">
                      <span className="text-gray-700">SGST (9%):</span>
                      <span className="text-gray-900">
                        ₹
                        {(selectedPO.total_amount * 0.09).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                      <span className="font-bold text-lg">Grand Total:</span>
                      <span className="text-lg font-bold">
                        ₹
                        {(selectedPO.total_amount * 1.18).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status and Notes */}
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-gray-700 mb-1">
                        Product Description:
                      </h3>
                      <div className="px-3 py-2 bg-gray-100 rounded-md inline-block">
                        {selectedPO.items[0].description}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-700 mb-1">Status:</h3>
                      <div className="px-3 py-2 bg-gray-100 rounded-md inline-block">
                        {selectedPO.status || "PENDING"}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-700 mb-1">Notes:</h3>
                      <p className="text-gray-800">
                        Please deliver as soon as possible
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Purchase Orders
                </h2>
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search POs..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PO Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((po) => (
                        <tr key={po.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-600">
                              {po.po_number}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(po.order_date).toLocaleDateString()}
                            </div>
                          </td>
                       
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {po.items[0].vendor_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {po.items[0].vendor_company}
                            </div>
                            <div className="text-sm text-gray-500">
                              {po.items[0].vendor_email}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {po.items[0].product_name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 relative group w-max max-w-[200px]">
                              <span className="truncate block">
                                {(po.items?.[0]?.description || "")
                                  .split(" ")
                                  .slice(0, 3)
                                  .join(" ") + "..."}
                              </span>
                              {po.items?.[0]?.description && (
                                <div className="absolute z-10 hidden group-hover:block bg-white border border-gray-300 text-gray-900 text-xs p-2 rounded shadow-md w-64 top-full mt-1">
                                  {po.items[0].description}
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              ₹{po.items[0].unit_price.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {po.items[0].quantity}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {po.status}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedPO(po)}
                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1 px-3 py-1 rounded bg-blue-50 hover:bg-blue-100"
                              >
                                <FileText size={14} />
                                View
                              </button>
                              <button
                                onClick={() => handleDownloadPDF(po.id)}
                                disabled={downloading[po.id]}
                                className="text-green-600 hover:text-green-900 flex items-center gap-1 px-3 py-1 rounded bg-green-50 hover:bg-green-100"
                              >
                                {downloading[po.id] ? (
                                  <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                  <Download size={14} />
                                )}
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          {searchTerm
                            ? "No matching purchase orders found"
                            : "No purchase orders found. Initiate POs from your cart."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredPOs.length > itemsPerPage && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * itemsPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * itemsPerPage,
                            filteredPOs.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {filteredPOs.length}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">First</span>
                          &laquo;
                        </button>
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Previous</span>
                          &lsaquo;
                        </button>
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
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
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === pageNum
                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Next</span>
                          &rsaquo;
                        </button>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Last</span>
                          &raquo;
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default POAutomationPage;