"use client";
import { useState, useEffect } from "react";
import { FaBars, FaHome, FaClipboardList, FaPlus } from "react-icons/fa";
import { CircleUserRound, BellRing, Calendar, UserRoundPen, LogOut, Bolt, X } from "lucide-react";
import AddProduct from "../vendor/addproduct/page";
import UpdateProduct from "../vendor/updateproduct/page";
import ProductDetails from "../vendor/productdetails/page";
import Home from "../vendor/home/page";
import { useRouter } from "next/navigation";

export default function Mainpage() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState("home");
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "John Doe from XYZ Company has placed an order for 5 units of Product A!", type: "info", read: false, timestamp: new Date() },
    { id: 2, text: "Product XYZ is running low on stock. Restock soon to meet demand.", type: "warning", read: false, timestamp: new Date() },
    { id: 3, text: "Your profile has been updated successfully, Mohammed Kaif!", type: "success", read: true, timestamp: new Date() },
    { id: 4, text: "New review added to your product 'Laptop XYZ' by Emily Clark.", type: "info", read: false, timestamp: new Date() },
    { id: 5, text: "Price change alert: Product ABC's price has been reduced by 10%.", type: "warning", read: false, timestamp: new Date() },
    { id: 6, text: "Your product 'Smartphone XYZ' has been approved and is now live on the platform.", type: "success", read: false, timestamp: new Date() },
  ]);
  const [filter, setFilter] = useState("all");
  const router = useRouter();
  const user = { name: "Balaji", role: "Vendor" };
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

  const handleSidebarToggle = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  const dismissNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const getNotificationClass = (read) => {
    return read ? "bg-white" : "bg-[#DAE3E9]"; // Unread messages have light blue background, read messages are white
  };

  const filterNotifications = () => {
    if (filter === "all") return notifications;
    return notifications.filter((notification) => (filter === "unread" ? !notification.read : notification.read));
  };

  const unreadNotifications = notifications.filter((notification) => !notification.read);

  return (
    <div className="flex min-h-screen">
      <div
        className={`${isOpen ? "w-64" : "w-16"} bg-[#1C92D2] text-white transition-[width] duration-500 ease-in-out flex flex-col min-h-screen fixed`}
      >
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

      <div className={`flex-1 bg-slate-50 flex flex-col min-h-screen transition-[margin-left] duration-500 ease-in-out ${isOpen ? "ml-[16rem]" : "ml-[4rem]"}`}>
        <div className="flex justify-between items-center bg-white p-4 shadow-md sticky top-0 z-10">
          <h1 className="text-xl font-bold">
            {selectedPage === "home" && "Home"}
            {selectedPage === "addProduct" && "Add Product"}
            {selectedPage === "productDetails" && "Product Details"}
            {selectedPage === "updateProduct" && "Update Product"}
            {selectedPage === "logout" && "Logout"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100">
              <Calendar size={28} />
              <p className="text-sm text-gray-600 font-medium">{currentDate}</p>
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 cursor-pointer" onClick={toggleNotification}>
                <BellRing size={28} />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 cursor-pointer" onClick={toggleDropdown}>
                <CircleUserRound size={28} className="text-gray-500" />
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50">
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedPage("profile")}>
                      <UserRoundPen size={20} /> My Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedPage("settings")}>
                      <Bolt size={20} /> Settings
                    </li>
                    <li className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer" onClick={() => setSelectedPage("logout")}>
                      <LogOut size={20} /> Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {notificationOpen && (
          <div className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-lg p-4 border-l z-50 overflow-y-auto transition-transform duration-300 ease-in-out transform translate-x-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Notifications</h2>
              <X size={24} className="cursor-pointer" onClick={toggleNotification} />
            </div>

            <hr className="mb-4" />

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <select
                  className="p-2 border rounded-md"
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
              <button
                className="bg-[#06436B] text-white p-2 rounded-md"
                onClick={() => {
                  setNotifications(notifications.map(notification => ({ ...notification, read: true })));
                }}
              >
                Mark all as read
              </button>
            </div>

            <hr className="mb-4" />

            {filterNotifications().length === 0 ? (
              <p className="text-gray-500">No new notifications</p>
            ) : (
              <ul>
                {filterNotifications().map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-3 mb-2 rounded-md cursor-pointer ${getNotificationClass(notification.read)}`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{notification.text}</p>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <div className="inline-block bg-[#EFF3F5] p-1 rounded-md">
                        {new Date(notification.timestamp).toLocaleString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true, 
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="text-red-500 text-sm"
                      >
                        Dismiss
                      </button>
                    </div>
                    <hr className="my-2" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

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
