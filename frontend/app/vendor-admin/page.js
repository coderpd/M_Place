"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, subWeeks, subMonths, isWithinInterval, startOfWeek, endOfWeek } from "date-fns";
import Navbar from "./components/navbar";
import {
  CheckCircle,
  XCircle,
  Building2,
  User,
  ChevronRight,
  Clock,
  TrendingUp,
  Edit,
  Bell,
  Package,
  Plus,
  Activity,
  Users,
  UserPlus,
  UserX
} from "lucide-react";
import { Pie, Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`${color} p-5 rounded-xl shadow-sm`}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${color.replace("bg-", "bg-opacity-50 bg-")}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const VendorDashboard = () => {
  const router = useRouter();
  const [vendors, setVendors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorID, setVendorID] = useState(null);
  const [timeRange, setTimeRange] = useState("week");
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({ week: 0, month: 0 });
  const [notificationStats, setNotificationStats] = useState({
    total: 0,
    unread: 0,
    read: 0
  });

  const getTimeRangeDates = () => {
    const now = new Date();
    if (timeRange === "week") {
      return {
        start: startOfWeek(now),
        end: now,
      };
    } else {
      return {
        start: subMonths(now, 1),
        end: now,
      };
    }
  };

  // Fetch notifications data
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/notification/vendor-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('vendorToken')}`
        },
        body: JSON.stringify({ vendorAdminID: vendorID }),
      });

      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
    
      setNotifications(data.notifications);
      console.log(data.notifications)
     

      const unreadCount = data.notifications.filter(n => n.status === "unread").length;
      setNotificationStats({
        total: data.notifications.length,
        unread: unreadCount,
        read: data.notifications.length - unreadCount,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const filterVendorsByTimeRange = (vendors) => {
    const { start } = getTimeRangeDates();
    return vendors.filter(vendor => {
      if (!vendor.createdAt) return false;
      const vendorDate = new Date(vendor.createdAt);
      return vendorDate >= start;
    });
  };

  const getDayLabels = () => {
    const { start, end } = getTimeRangeDates();
    const labels = [];
    let current = new Date(start);

    if (timeRange === "week") {
      while (current <= end) {
        labels.push(format(current, "EEE"));
        current = new Date(current.setDate(current.getDate() + 1));
      }
    } else {
      const weekStart = new Date(start);
      while (weekStart <= end) {
        let weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        if (weekEnd > end) weekEnd = new Date(end);

        labels.push(`Week ${format(weekStart, "d")}-${format(weekEnd, "d MMM")}`);
        weekStart.setDate(weekStart.getDate() + 7);
      }
    }
    return labels;
  };

  const prepareVendorGrowthData = (vendors) => {
    const { start, end } = getTimeRangeDates();
    const labels = getDayLabels();
    const dataMap = {};

    labels.forEach(label => {
      dataMap[label] = 0;
    });

    vendors.forEach(vendor => {
      if (vendor.createdAt) {
        const vendorDate = new Date(vendor.createdAt);
        if (vendorDate >= start && vendorDate <= end) {
          let label;
          if (timeRange === "week") {
            label = format(vendorDate, "EEE");
          } else {
            const weekNumber = Math.floor((vendorDate - start) / (7 * 24 * 60 * 60 * 1000));
            label = labels[Math.min(weekNumber, labels.length - 1)];
          }
          dataMap[label] = (dataMap[label] || 0) + 1;
        }
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "New Vendors",
          data: labels.map(label => dataMap[label]),
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: "rgba(59, 130, 246, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  const prepareNotificationChartData = () => {
    const now = new Date();
    const days = timeRange === "week" ? 7 : 30;
    const labels = [];
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      labels.push(format(date, "MMM d"));

      const count = notifications.filter(n => {
        const notificationDate = new Date(n.created_at);
        return (
          notificationDate.getDate() === date.getDate() &&
          notificationDate.getMonth() === date.getMonth() &&
          notificationDate.getFullYear() === date.getFullYear()
        );
      }).length;

      data.push(count);
    }

    return {
      labels,
      datasets: [
        {
          label: "Notifications",
          data,
          backgroundColor: "rgb(140, 223, 210)",
          borderColor: "rgb(140, 223, 210)",
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    };
  };

  const prepareProductDistributionData = () => {
    const productCounts = {};

    notifications.forEach((n) => {
      if (n.productName) {
        
        productCounts[n.productName] =
          (productCounts[n.productName] || 0) + (n.quantity || 1);
      }
    
    });
    
    
    const sortedProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by total quantity in descending order
      .slice(0, 5);
      console.log("Top 5 products by quantity:", sortedProducts);
    return {
      labels: sortedProducts.map((p) => p[0]),
      datasets: [
        {
          label: "Total Quantity Ordered",
          data: sortedProducts.map((p) => p[1]),
          backgroundColor: [
            "rgba(162, 210, 255, 0.8)",
            "rgba(181, 234, 215, 0.8)",
            "rgba(255, 203, 210, 0.8)",
            "rgba(255, 227, 174, 0.8)",
            "rgba(221, 212, 232, 0.8)",
          ],
          borderColor: [
            "rgba(100, 170, 230, 1)",
            "rgba(120, 200, 180, 1)",
            "rgba(255, 150, 160, 1)",
            "rgba(255, 190, 100, 1)",
            "rgba(180, 160, 220, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  const prepareRecentActivity = (vendors) => {
    const activities = [];

    vendors.forEach(vendor => {
      if (vendor.createdAt) {
        activities.push({
          type: 'created',
          name: vendor.personName || "No contact",
          company: vendor.companyName || "Unknown Vendor",
          date: vendor.createdAt,
          status: vendor.status
        });
      }

      if (vendor.updatedAt && vendor.updatedAt !== vendor.createdAt) {
        activities.push({
          type: 'updated',
          name: vendor.personName || "No contact",
          company: vendor.companyName || "Unknown Vendor",
          date: vendor.updatedAt,
          status: vendor.status
        });
      }
    });

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    return activities.slice(0, 5);
  };

  useEffect(() => {
    const storedVendor = localStorage.getItem("vendor");
    if (storedVendor) {
      try {
        const vendorData = JSON.parse(storedVendor);
        if (vendorData?.id) {
          setVendorID(vendorData.id);
        }
      } catch (err) {
        console.error("Error parsing vendor data:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      if (!vendorID) return;
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/auth/vendor/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId: vendorID }),
        });

        const data = await response.json();
        setVendors(data);

        // Calculate stats
        const weeklyVendors = filterVendorsByTimeRange(data, "week");
        const monthlyVendors = filterVendorsByTimeRange(data, "month");

        setStats({
          week: weeklyVendors.length,
          month: monthlyVendors.length
        });

        // Prepare recent activity
        setRecentActivity(prepareRecentActivity(data));

        // Fetch notifications only (removed products fetch)
        await fetchNotifications();

      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [vendorID]);

  const vendorGrowthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: timeRange === "week"
          ? "📈 Daily Vendor Growth (Last 7 Days)"
          : "📈 Weekly Vendor Growth (Last 4 Weeks)",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#1e293b",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const notificationChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `📊 ${timeRange === "week" ? "Daily" : "Monthly"} Notifications`,
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#1e293b",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const productChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredVendors = filterVendorsByTimeRange(vendors);
  const activeVendors = vendors.filter(v => v.status === "Active").length;
  const inactiveVendors = vendors.filter(v => v.status !== "Active").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Vendor Dashboard</h1>
            <p className="text-slate-500 mt-2">
              Comprehensive overview of your vendor operations and performance
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            {["week", "month"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${timeRange === range
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Vendors"
            value={vendors.length}
            icon={<Users className="h-5 w-5" />}
            color="bg-indigo-100"
          />
          <StatCard
            title="Active Vendors"
            value={activeVendors}
            icon={<Activity className="h-5 w-5" />}
            color="bg-green-100"
          />
          <StatCard
            title="Inactive Vendors"
            value={inactiveVendors}
            icon={<UserX className="h-5 w-5" />}
            color="bg-red-100"
          />
          <StatCard
            title="Total Orders"
            value={notificationStats.total}
            icon={<Bell className="h-5 w-5" />}
            color="bg-orange-100"
          />
          <StatCard
            title={`New Vendors - ${timeRange === "week" ? "Weekly" : "Monthly"}`}
            value={filteredVendors.length}
            icon={<UserPlus className="h-5 w-5" />}
            color="bg-purple-100"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Vendor Growth (
              {timeRange === "week"
                ? "Daily (Last 7 Days)"
                : "Weekly (Last 4 Weeks)"}
              )
            </h2>
            <div className="h-64">
              {vendors.length > 0 ? (
                <Line
                  data={prepareVendorGrowthData(vendors)}
                  options={vendorGrowthOptions}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-400">Loading chart data...</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Notification Trend (
              {timeRange === "week" ? "Last 7 Days" : "Last 30 Days"})
            </h2>
            <div className="h-64">
              {notifications.length > 0 ? (
                <Bar
                  data={prepareNotificationChartData()}
                  options={notificationChartOptions}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-400">Loading notification data...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Doughnut + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Top Ordered Products
            </h2>
            <div className="h-64">
              {notifications.length > 0 ? (
                <Doughnut
                  data={prepareProductDistributionData()}
                  options={productChartOptions}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-400">Loading product data...</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-10 w-10 mx-auto text-gray-300" />
                    <p className="mt-2 text-gray-500">No recent activity</p>
                  </div>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div
                      key={`activity-${index}`}
                      className="flex items-start pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        {activity.type === 'created' ? (
                          <UserPlus className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Edit className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          <span className="font-semibold">{activity.name}</span> from{" "}
                          <span className="text-blue-600">{activity.company}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(activity.date), "MMM d, h:mm a")}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {activity.type === 'created' ? 'Created' : 'Updated'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Management Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-800">
                Vendor Management (
                {timeRange === "week" ? "This Week" : "This Month"})
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => router.push("/vendor-admin/addUser")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Vendor
                </button>
                <button
                  onClick={() => router.push("/vendor-admin/usersprofile")}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition"
                >
                  View All
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {["Vendor", "Company", "Status", "Registered"].map((head) => (
                      <th
                        key={head}
                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredVendors
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map((vendor) => (
                      <tr key={vendor.id || vendor.Email} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {vendor.personName?.charAt(0) || "V"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-800">
                                {vendor.personName}
                              </div>
                              <div className="text-sm text-slate-500">
                                {vendor.Email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-800">
                            {vendor.companyName || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vendor.status === "Active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                              }`}
                          >
                            {vendor.status === "Active" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {vendor.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {vendor.createdAt
                            ? format(new Date(vendor.createdAt), "MMM d, yyyy")
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {filteredVendors.length === 0 && (
                <div className="text-center py-8">
                  <UserX className="h-10 w-10 mx-auto text-gray-300" />
                  <p className="mt-2 text-gray-500">
                    No vendors found for this time period
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;