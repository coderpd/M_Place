"use client";
import { useState, useEffect } from "react";
import { FaBars, FaHome, FaClipboardList, FaPlus } from "react-icons/fa";
import { BellRing, Calendar, X } from "lucide-react";
import { useRouter } from "next/navigation";
import AddProduct from "../vendor/addproduct/page";
import UpdateProduct from "../vendor/updateproduct/page";
import ProductDetails from "../vendor/productdetails/page";
import Home from "../vendor/home/page";

export default function Mainpage() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState("home");
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [company, setCompany] = useState("RnD Technologies");
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [filter, setFilter] = useState("all");  

  const router = useRouter();
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    if (notificationOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [notificationOpen]);

  // Fetch notifications based on the selected company
  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${encodeURIComponent(company)}?read_status=${filter}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
      setUnreadNotifications(data.filter((notification) => !notification.read_status));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (company) {
      fetchNotifications();
    }
  }, [company, filter]);

  const handleSidebarToggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  
  const dismissNotification = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "DELETE",
      });
  
      const data = await response.json();
      if (data.message) {
        // Remove the dismissed notification from state
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification.id !== id)
        );
      } else {
        alert("Failed to dismiss notification.");
      }
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };
  
  

  
  const markAllAsRead = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/markAllNotificationsAsRead/${encodeURIComponent(company)}`, {
        method: "PUT",
      });
  
      // Check if the response is successful (status 200)
      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read.");
      }
  
      const data = await response.json();
      if (data.message) {
        alert("All notifications marked as read.");
        fetchNotifications(); // Refresh notifications after marking all as read
      } else {
        alert("Failed to mark all notifications as read.");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  const handleNotifyVendor = async (product) => {
    const message = `A customer is interested in buying ${product.name}.`;

    try {
      const response = await fetch("http://localhost:5000/api/notifyVendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: [{ id: product.id, company, name: product.name }],
        }),
      });

      const data = await response.json();
      if (data.message) {
        alert("Vendor has been notified successfully!");
        fetchNotifications();  // Fetch new notifications after notifying the vendor
      } else {
        alert("Failed to notify the vendor. Try again!");
      }
    } catch (error) {
      console.error("Error notifying vendor:", error);
      alert("Something went wrong!");
    }
  };

  // Filter notifications based on "read" or "unread"
  const filteredNotifications = filter === "all"
    ? notifications
    : notifications.filter((notification) =>
        filter === "read" ? notification.read_status : !notification.read_status
      );

  // Function to format the date
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`${isOpen ? "w-64" : "w-16"} bg-[#1C92D2] text-white transition-[width] duration-500 ease-in-out flex flex-col min-h-screen fixed`}>
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center">
            {isOpen ? (
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-lg">
                M
              </div>
            ) : (
              <FaBars className="cursor-pointer text-white text-2xl" onClick={handleSidebarToggle} />
            )}
            {isOpen && <span className="ml-2 text-xl font-semibold">Mplace</span>}
          </div>
          {isOpen && <FaBars className="cursor-pointer" onClick={handleSidebarToggle} />}
        </div>

        <ul className="mt-4 flex-1">
          <li className="flex items-center gap-2 p-3 hover:bg-gray-700 cursor-pointer" onClick={() => setSelectedPage("home")}>
            <FaHome /> {isOpen && "Home"}
          </li>
          <li className="flex items-center gap-2 p-3 hover:bg-gray-700 cursor-pointer" onClick={() => setSelectedPage("addProduct")}>
            <FaPlus /> {isOpen && "Add Product"}
          </li>
          <li className="flex items-center gap-2 p-3 hover:bg-gray-700 cursor-pointer" onClick={() => setSelectedPage("productDetails")}>
            <FaClipboardList /> {isOpen && "Product Details"}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`flex-1 bg-slate-50 flex flex-col min-h-screen transition-[margin-left] duration-500 ease-in-out ${isOpen ? "ml-[16rem]" : "ml-[4rem]"}`}>
        <div className="flex justify-between items-center bg-white p-4 shadow-md sticky top-0 z-10">
          <h1 className="text-xl font-bold">
            {selectedPage === "home" && "Home"}
            {selectedPage === "addProduct" && "Add Product"}
            {selectedPage === "productDetails" && "Product Details"}
            {selectedPage === "updateProduct" && "Update Product"}
          </h1>

          {/* Company Selector */}
          <select value={company} onChange={(e) => setCompany(e.target.value)} className="p-2 border rounded-md">
            <option value="RnD Technologies">RnD Technologies</option>
            <option value="cv technologies">cv technologies</option>
            <option value="UB tech">UB tech</option>
            <option value="SG retail">SG retail</option>
            <option value="IP logistics">IP logistics</option>
            <option value="RM dealers">RM dealers</option>
            <option value="MP Electronics">MP Electronics</option>
            <option value="AM retail pvt lmt">AM retail pvt lmt</option>
          </select>

          {/* Notification Icon (Bell) */}
          <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100">
              <Calendar size={28} />
              <p className="text-sm text-gray-600 font-medium">{currentDate}</p>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 cursor-pointer" onClick={toggleNotification}>
              <BellRing size={28} />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
          </div>
        </div>

        {/* Notifications Panel */}
        {notificationOpen && (
          <div className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-lg p-4 border-l z-50 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Notifications</h2>
              <X size={24} className="cursor-pointer" onClick={toggleNotification} />
            </div>

            <hr className="mb-4" />

            {/* Filter and Mark All as Read Button */}
            <div className="flex justify-between mb-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="all">All</option>
                <option value="read">Read</option>
                <option value="unread">Unread</option>
              </select>

              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Mark all as Read
              </button>
            </div>

            {filteredNotifications.length === 0 ? (
              <p className="text-gray-500">No notifications</p>
            ) : (
              <ul>
                {filteredNotifications.map((notification) => (
                  <li key={notification.id} className={`p-3 mb-2 rounded-md bg-gray-100 flex justify-between`}>
                    <span>{notification.message}</span>
                    <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
                    
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="text-red-500 text-sm"
                    >
                      Dismiss
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Dynamic Pages */}
        <div className="p-6 flex-1 overflow-y-auto">
          {selectedPage === "home" && <Home />}
          {selectedPage === "addProduct" && <AddProduct setProducts={setProducts} products={products} />}
          {selectedPage === "productDetails" && <ProductDetails products={products} setSelectedPage={setSelectedPage} setEditProduct={setEditProduct} />}
          {selectedPage === "updateProduct" && <UpdateProduct product={editProduct} />}
        </div>
      </div>
    </div>
  );
}