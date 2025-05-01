"use client";
import { useState, useEffect, useMemo } from "react";
import { FileText, Download, ArrowLeft, Loader2, Search, Check, X, Edit, MapPin } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";

const VendorPOAutomationPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPO, setSelectedPO] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState(false);
  const [showCustomerAddress, setShowCustomerAddress] = useState(false);
  const [showVendorAddress, setShowVendorAddress] = useState(false);
  const [showShipToAddress, setShowShipToAddress] = useState(false);
  const [companyName, setcompanyName] = useState(" ")
 
  const [editData, setEditData] = useState({
    status: "",
  });
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchVendorOrders = async () => {
      try {
        console.log("Fetching vendor purchase orders...");
        const storedVendor = localStorage.getItem("vendor");
        
        if (!storedVendor) {
          throw new Error("No vendor data found. Please login again.");
        }
  
        const vendorData = JSON.parse(storedVendor);
        console.log("Vendor data from localStorage:", vendorData);
  
        // First try to get vendor ID, fallback to companyName if needed
        const vendorId = vendorData.id || vendorData.vendorId;
        
        if (!vendorId) {
          throw new Error("Vendor ID not found in vendor data");
        }
  
        console.log("Using vendor ID:", vendorId);
        
        const response = await fetch(
          `http://3.109.75.252:5000/PoVendorUser/vendor/admin/${vendorId}`
        );
  
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch vendor orders");
        }
  
        const data = await response.json();
        console.log("API response data:", data);
  
        if (!data.success) {
          throw new Error(data.error || "Request failed");
        }
  
        setPurchaseOrders(data.purchaseOrders || []);
        setcompanyName(data.companyName || "");
  
      } catch (error) {
        console.error("Error in fetchVendorOrders:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchVendorOrders();
  }, []);
  // Filter POs based on search term
  const filteredPOs = useMemo(() => {
    if (!searchTerm) return purchaseOrders;

    return purchaseOrders.filter(po => {
      const searchLower = searchTerm.toLowerCase();
      return (
        po.po_number?.toLowerCase().includes(searchLower) ||
        po.customer_name?.toLowerCase().includes(searchLower) ||
        po.customer_company?.toLowerCase().includes(searchLower) ||
        po.items?.[0]?.vendor_name?.toLowerCase().includes(searchLower) ||
        po.items?.[0]?.product_name?.toLowerCase().includes(searchLower) ||
        po.status?.toLowerCase().includes(searchLower)
      );
    });
  }, [purchaseOrders, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPOs.length / itemsPerPage);

  // Get current items for the current page
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPOs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPOs, currentPage]);

  const handleDownloadPDF = async (poId) => {
    setDownloading((prev) => ({ ...prev, [poId]: true }));
    try {
      const response = await fetch(
        `http://3.109.75.252:5000/PoVendorUser/generate-pdf/${poId}`
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

  const handleEditClick = (po) => {
    setEditing(true);
    setSelectedPO(po);
    setEditData({
      status: po.status || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://3.109.75.252:5000/PoVendorUser/update/${selectedPO.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: editData.status,
          }),
        }
      );

      if (response.ok) {
        setPurchaseOrders(prev => prev.map(po =>
          po.id === selectedPO.id ? {
            ...po,
            status: editData.status,
          } : po
        ));

        setSelectedPO(prev => ({
          ...prev,
          status: editData.status,
        }));

        setEditing(false);
        toast.success("PO status updated successfully");
      } else {
        toast.error("Failed to update PO status");
      }
    } catch (error) {
      console.error("Error updating PO status:", error);
      toast.error("Error updating PO status");
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditData({
      status: "",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="bottom-right" autoClose={3000} />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Purchase Orders</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-gray-600">
            {filteredPOs.length > 0
              ? `Showing ${filteredPOs.length} purchase ${filteredPOs.length === 1 ? "order" : "orders"}`
              : "No purchase orders found"}
          </p>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search POs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* PO Content */}
      {selectedPO ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          {/* Header with back button */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <Button
              onClick={() => setSelectedPO(null)}
              variant="ghost"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={18} />
              Back to all POs
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDownloadPDF(selectedPO.id)}
                disabled={downloading[selectedPO.id]}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                {downloading[selectedPO.id] ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Download size={16} />
                )}
                Download PDF
              </Button>
            </div>
          </div>

          {/* PO Content */}
          <div className="p-6">
            {/* PO Header */}
            <div className="text-center mb-6">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-300">
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
                      onClick={() => setShowCustomerAddress(!showCustomerAddress)}
                      className="flex items-center text-blue-600 text-sm"
                    >
                      <MapPin size={14} className="mr-1" />
                      {showCustomerAddress ? "Hide Address" : "View Address"}
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

              {/* Ship To (Customer) */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-gray-700">
                  Ship To (Customer)
                </h3>
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
                    onClick={() => setShowShipToAddress(!showShipToAddress)}
                    className="flex items-center text-blue-600 text-sm"
                  >
                    <MapPin size={14} className="mr-1" />
                    {showShipToAddress ? "Hide Address" : "View Address"}
                  </button>
                  {showShipToAddress && (
                    <p className="text-gray-800 mt-1 text-sm">
                      {formatAddress(
                        selectedPO.ship_to_address || selectedPO.customer_address,
                        selectedPO.ship_to_city || selectedPO.customer_city,
                        selectedPO.ship_to_state || selectedPO.customer_state,
                        selectedPO.ship_to_country || selectedPO.customer_country,
                        selectedPO.ship_to_postal_code || selectedPO.customer_postal_code
                      )}
                    </p>
                  )}
                </div>
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
                    <b>Email</b> - {selectedPO.items[0].vendor_email || "N/A"}
                  </p>
                  <div className="mt-2">
                    <button
                      onClick={() => setShowVendorAddress(!showVendorAddress)}
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
            <div className="mb-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedPO.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.product_name}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">
                          {item.quantity}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900">
                          ₹{item.unit_price.toLocaleString("en-IN")}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
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
            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-gray-700 mb-1">Product Description:</h3>
                  <div className="px-3 py-2 bg-gray-100 rounded-md">
                    {selectedPO.items?.[0]?.description || "No description available"}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-700 mb-1">Status:</h3>
                  {editing ? (
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700">Update PO Status</h4>
                        <span className="text-sm text-gray-500">PO #{selectedPO.po_number}</span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Status:
                          </label>
                          <div className={`px-3 py-2 rounded-md inline-block ${selectedPO.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              selectedPO.status === 'PO-Acknowledgement' ? 'bg-blue-100 text-blue-800' :
                                selectedPO.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                  selectedPO.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                    selectedPO.status === 'Payment Success' ? 'bg-purple-100 text-purple-800' :
                                      'bg-gray-100 text-gray-800'
                            }`}>
                            {selectedPO.status || "PENDING"}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            New Status:
                          </label>
                          <select
                            name="status"
                            id="status"
                            value={editData.status}
                            onChange={handleEditChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                          >
                            <option value="">Select new status</option>
                            <option value="Pending">Pending</option>
                            <option value="PO-Acknowledgement">PO-Acknowledgement</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Payment Success">Payment Success</option>
                          </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-50 text-gray-700"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveChanges}
                            disabled={!editData.status}
                            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Update Status
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className={`px-3 py-2 rounded-md inline-block ${selectedPO.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          selectedPO.status === 'PO-Acknowledgement' ? 'bg-blue-100 text-blue-800' :
                            selectedPO.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              selectedPO.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                selectedPO.status === 'Payment Success' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                        }`}>
                        {selectedPO.status || "PENDING"}
                      </div>
                      <Button
                        onClick={() => handleEditClick(selectedPO)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Status
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-gray-700 mb-1">Notes:</h3>
                  <p className="text-gray-800">
                    {selectedPO.notes || "Please deliver as soon as possible"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PO Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((po) => (
                    <tr key={po.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">
                          {po.po_number}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(po.order_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {po.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {po.customer_company}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {po.items?.[0]?.vendor_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {po.items?.[0]?.vendor_company}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {po.items?.[0]?.product_name}
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
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ₹{po.total_amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {po.items?.[0]?.quantity}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${po.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          po.status === 'PO-Acknowledgement' ? 'bg-blue-100 text-blue-800' :
                            po.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              po.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                po.status === 'Payment Success' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                          }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => setSelectedPO(po)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            onClick={() => handleDownloadPDF(po.id)}
                            disabled={downloading[po.id]}
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-900"
                          >
                            {downloading[po.id] ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4 mr-1" />
                            )}
                            PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-4 py-6 text-center text-gray-500">
                      No purchase orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredPOs.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="ml-3"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredPOs.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredPOs.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">First</span>
                      &laquo;
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      &lsaquo;
                    </button>
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
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      &rsaquo;
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};

export default VendorPOAutomationPage;