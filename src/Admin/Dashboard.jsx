import { useEffect, useState } from "react";
import React from "react";
import Icon1 from "../assets/Icons/Icon1.png";
import Icon2 from "../assets/Icons/Icon2.png";
import Icon3 from "../assets/Icons/Icon3.png";
import Profile_pic from "../assets/Profile_Pic.jpg";
import Verticle_Barchart from "../Components/disaster-funding/Verticle_BarChart.jsx";
import PieChart from "../Components/disaster-funding/Pie-Chart.jsx";
import DisasterLineChart from "../Components/admin-dashboard/DisasterLineChart.jsx";
import Dashboard_grid from "../Components/admin-dashboard/Dashboard-Datagrid.jsx";
import toast from "react-hot-toast";
import Modal from "../Components/main-components/Model";
import { Bell, PiggyBank, HandCoins, Users, BarChart3, FileDown, Plus } from "lucide-react";
import { StatsCardSkeleton, ChartSkeleton, TableSkeleton } from "../Components/ui/LoadingSkeleton";
import { API_BASE_URL } from "../config/api";

const Dashboard = () => {
  const [payment_data, setPayment_data] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRecode, setNewRecode] = useState({});
  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState("");
  const [Datarecode, setDataset] = useState([]);
  const [users, setUsers] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [chartPeriod, setChartPeriod] = useState("Daily");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [datasetRecords, setDatasetRecords] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    Donations: "",
    savings: "",
    Distribution: "",
    BalanceAmount: "",
    usertraffic: 0,
    disastersinfo: [],
  });

  const fetchDatasetRecords = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/`);
      const data = await response.json();
      // If your backend returns an array, use it directly
      setDatasetRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch dataset:", error);
      setDatasetRecords([]);
    }
  };

  const handleLoadDataset = (dataset) => {
    // Update all relevant states with the selected dataset

    setDashboardData({
      Donations: dataset.Donations ?? "",
      savings: dataset.savings ?? "",
      Distribution: dataset.Distribution ?? "",
      BalanceAmount: dataset.BalanceAmount ?? "",
      usertraffic: dataset.usertraffic ?? 0,
      disastersinfo: dataset.disastersinfo ?? [],
    });
    setUsers(dataset.users ?? []);
    setDisasters(dataset.disasters ?? []);
    // If you have other states to update, do so here
    // Optionally, store the loaded dataset id in localStorage for persistence
    localStorage.setItem("activeDatasetId", dataset._id);
  };

  const handleSyncRecode = async (recodeId) => {
    // Prepare the latest dashboard data for the recode
    const updatedRecode = {
      Donations: getTotalDonations().toFixed(2),
      savings: (getTotalDonations() - getTotalDonations() * 0.87).toFixed(2),
      Distribution: (users.filter((u) => u.status === "active").length / users.length || 0).toFixed(2),
      BalanceAmount: (getTotalDonations() * 0.87).toFixed(2),
      usertraffic: getActiveUsersCount(),
      disasters: disasterTypeCounts.map((d) => ({
        type: d.type,
        count: d.count,
      })),
      disasterLineChartData,
      users,
      disastersinfo: latestDisasters,
      // Optionally, update recodes array or other fields as needed
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/${recodeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecode),
      });

      if (!response.ok) {
        throw new Error("Failed to sync recode");
      }

      toast.success("Recode synced with latest dashboard data!");
      fetchDatasetRecords(); // Refresh datagrid
    } catch (error) {
      toast.error("Failed to sync recode: " + error.message);
    }
  };

  // Helper to group payments by period
  const getChartDataByPeriod = (payments, period) => {
    const groupMap = {};

    payments.forEach((payment) => {
      const date = new Date(payment.createdAt);
      let key = "";
      if (period === "Daily") {
        key = date.toLocaleDateString();
      } else if (period === "Weekly") {
        // Get ISO week number
        const tempDate = new Date(date.getTime());
        tempDate.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
        const week1 = new Date(tempDate.getFullYear(), 0, 4);
        const weekNo = 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
        key = `W${weekNo}-${tempDate.getFullYear()}`;
      } else if (period === "Monthly") {
        key = `${date.toLocaleString("default", { month: "short" })}-${date.getFullYear()}`;
      } else if (period === "Yearly") {
        key = `${date.getFullYear()}`;
      }
      if (!groupMap[key]) groupMap[key] = 0;
      groupMap[key] += payment.amount;
    });

    // Sort keys chronologically
    const sortedKeys = Object.keys(groupMap).sort((a, b) => {
      if (period === "Yearly") return a - b;
      if (period === "Monthly") {
        const [ma, ya] = a.split("-");
        const [mb, yb] = b.split("-");
        return new Date(`${ma} 1, ${ya}`) - new Date(`${mb} 1, ${yb}`);
      }
      if (period === "Weekly") {
        const [wa, ya] = a.replace("W", "").split("-");
        const [wb, yb] = b.replace("W", "").split("-");
        return ya !== yb ? ya - yb : wa - wb;
      }
      // Daily
      return new Date(a) - new Date(b);
    });

    return sortedKeys.map((label) => ({
      label,
      value: groupMap[label],
    }));
  };

  const chartData = getChartDataByPeriod(payment_data, chartPeriod);

  const latestDisasters = [...disasters].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)).slice(0, 3);

  // Export recodes as CSV
  const handleExportCSV = () => {
    if (!Datarecode || Datarecode.length === 0) {
      toast.error("No data to export.");
      return;
    }
    const headers = Object.keys(Datarecode[0]);
    const csvRows = [
      headers.join(","),
      ...Datarecode.map((row) => headers.map((field) => `"${(row[field] ?? "").toString().replace(/"/g, '""')}"`).join(",")),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "guardian_earth_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report exported as CSV!");
  };
  // Fetch all disasters from backend
  const fetchDisasters = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/disaster`);
      const data = await response.json();
      setDisasters(data.disasters || []);
    } catch (error) {
      toast.error("Failed to load disaster data");
      setDisasters([]);
    }
  };

  // Prepare disaster type data for PieChart
  const disasterTypeCounts = (() => {
    const typeMap = {};
    disasters.forEach((d) => {
      const type = d.disasterType || "Other";
      typeMap[type] = (typeMap[type] || 0) + 1;
    });
    return Object.entries(typeMap).map(([type, count]) => ({
      type,
      count,
    }));
  })();

  const getDisasterFrequencyByDate = (disasters, period = "Monthly") => {
    const groupMap = {};

    disasters.forEach((disaster) => {
      const date = new Date(disaster.date || disaster.createdAt);
      let key = "";
      if (period === "Daily") {
        key = date.toLocaleDateString();
      } else if (period === "Monthly") {
        key = `${date.toLocaleString("default", { month: "short" })}-${date.getFullYear()}`;
      } else if (period === "Yearly") {
        key = `${date.getFullYear()}`;
      }
      if (!groupMap[key]) groupMap[key] = 0;
      groupMap[key] += 1;
    });

    // Sort keys chronologically
    const sortedKeys = Object.keys(groupMap).sort((a, b) => new Date(a) - new Date(b));
    return sortedKeys.map((date) => ({
      date,
      count: groupMap[date],
    }));
  };

  const disasterLineChartData = getDisasterFrequencyByDate(disasters, chartPeriod);

  const getActiveUsersCount = () => {
    if (!users || users.length === 0) return 0;
    return users.length;
  };

  const getTotalDonations = () => {
    if (!payment_data || payment_data.length === 0) return 0;
    // If payment_data.amount is a string with "$", remove it and convert to number
    return payment_data.reduce((sum, p) => {
      let amount = typeof p.amount === "string" ? Number(p.amount.replace(/[^0-9.-]+/g, "")) : p.amount;
      return sum + (Number(amount) || 0);
    }, 0);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
      setUsers([]);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/`);
      const data = await response.json();
      setDashboardData({
        Donations: data.Donations ?? "",
        savings: data.savings ?? "",
        Distribution: data.Distribution ?? "",
        BalanceAmount: data.BalanceAmount ?? "",
        usertraffic: data.usertraffic ?? 0,
        disastersinfo: data.disastersinfo ?? [],
      });
    } catch (error) {
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchUsers();
    fetchDisasters();
    fetchDatasetRecords();
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const activeId = localStorage.getItem("activeDatasetId");
    if (activeId && datasetRecords.length > 0) {
      const found = datasetRecords.find((ds) => ds._id === activeId);
      if (found) handleLoadDataset(found);
    }
    // Only run when datasetRecords changes
  }, [datasetRecords]);

  useEffect(() => {
    setNewRecode((prev) => ({ ...prev, remark, status }));
  }, [remark, status]);

  // Handle form submission to add a new recode
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const recodeWithChart = {
      ...newRecode,
      Donations: getTotalDonations().toFixed(2),
      savings: (getTotalDonations() - getTotalDonations() * 0.87).toFixed(2),
      Distribution: (users.filter((u) => u.status === "active").length / users.length || 0).toFixed(2),
      BalanceAmount: (getTotalDonations() * 0.87).toFixed(2),
      usertraffic: getActiveUsersCount(),

      // Arrays
      disasters: disasterTypeCounts.map((d) => ({
        type: d.type,
        count: d.count,
      })), // If you want to store types
      disasterLineChartData, // Already in correct format
      users, // If you want to store users
      disastersinfo: latestDisasters, // If you want to store disaster info
      recodes: [
        {
          Id: newRecode.id,
          date: new Date(),
          remark,
          status,
        },
        // ...add more if needed
      ],
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recodeWithChart),
      });

      if (!response.ok) {
        throw new Error(`Failed to add record: ${response.statusText}`);
      }

      const data = await response.json();

      setNewRecode({ date: "", remark: "", status: "" }); // Reset form fields
      setIsFormVisible(false); // Close form
      fetchDashboardData();
      fetchDatasetRecords();

      //Clear model Fileds
      setRemark("");
      setStatus("");

      toast.success("Recode added successfully!");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to add recode." + error.message);
    }
  };

  const getChartData = (payments) => {
    const monthMap = {};

    payments.forEach((payment) => {
      const date = new Date(payment.createdAt);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const monthYear = `${month}-${year}`;
      if (!monthMap[monthYear]) {
        monthMap[monthYear] = 0;
      }
      monthMap[monthYear] += payment.amount;
    });

    return Object.keys(monthMap).map((monthYear) => ({
      label: monthYear,
      value: monthMap[monthYear],
    }));
  };
  const data = getChartData(payment_data);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/payment/`);
      const data = await response.json(); // Convert response to JSON
      setPayment_data(data); // Set the data to state
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
              <div className="text-left mx-5">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Insights</h1>
                <p className="text-gray-500 text-[14px]">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>Monitor, alert, and track resources for effective
                  disaster response
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    className="bg-white border border-gray-300 pl-10 rounded-lg py-2.5 px-5 w-72 outline-none text-sm shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    placeholder="Search dashboard..."
                    type="text"
                  />
                  <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-md transition-all duration-300 text-sm font-medium shadow-md whitespace-nowrap flex items-center gap-2"
                  title="Export report as CSV"
                >
                  <FileDown className="w-4 h-4" />
                  Export Report
                </button>
              </div>
            </div>
            {/* Stats Cards - Compact Modern Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
              {loading ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <StatsCardSkeleton key={i} />
                  ))}
                </>
              ) : (
                <>
                  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                        <HandCoins className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Total Donations</p>
                        <p className="text-xl font-bold text-gray-900 truncate">${getTotalDonations().toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition">
                        <PiggyBank className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Savings</p>
                        <p className="text-xl font-bold text-gray-900 truncate">${getTotalDonations() - (getTotalDonations() * 0.87).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Distribution</p>
                        <p className="text-xl font-bold text-gray-900">
                          {(users.filter((user) => user.status === "active").length / users.length || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-100 transition">
                        <PiggyBank className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Balance Amount</p>
                        <p className="text-xl font-bold text-gray-900 truncate">${(getTotalDonations() * 0.87).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-100 transition">
                        <Users className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">User Traffic</p>
                        <p className="text-xl font-bold text-gray-900">{getActiveUsersCount()}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col text-left">
                    <h2 className="text-xl font-bold text-gray-900">Monthly Donation Trends</h2>
                    <p className="text-sm text-gray-500 mt-1">Analysis of donations for the current month</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="flex items-center h-7 justify-center bg-emerald-50 rounded-full border border-emerald-200">
                      <p className="text-emerald-700 px-3 font-semibold text-xs">On track</p>
                    </div>
                    <select
                      className="border px-4 py-1.5 rounded-lg text-sm outline-none border-emerald-200 bg-white text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      value={chartPeriod}
                      onChange={(e) => setChartPeriod(e.target.value)}
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <Verticle_Barchart data={chartData} height={"24rem"} />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex flex-col text-left">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Disaster Types</h2>
                  <p className="text-sm text-gray-500 mb-4">Distribution analysis by disaster types</p>
                  <PieChart data={disasterTypeCounts} />
                </div>
              </div>
            </div>

            {/* System Performance & Activity Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Response Time Card */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col text-left">
                    <h3 className="text-lg font-bold text-gray-900">Response Rate</h3>
                    <p className="text-xs text-gray-500 mt-1">System performance metrics</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Disaster Reports</span>
                    <span className="text-sm font-semibold text-gray-900">{disasters.length}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min((disasters.length / 100) * 100, 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Donations Received</span>
                    <span className="text-sm font-semibold text-gray-900">{payment_data.length}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((payment_data.length / 50) * 100, 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="text-sm font-semibold text-gray-900">{users.length}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min((users.length / 200) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex flex-col text-left mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Quick Overview</h3>
                  <p className="text-xs text-gray-500 mt-1">Key platform metrics</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
                    <p className="text-xs font-medium text-emerald-700 mb-1">Total Reports</p>
                    <p className="text-2xl font-bold text-emerald-900">{disasters.length}</p>
                    <p className="text-xs text-emerald-600 mt-1">↑ Active tracking</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs font-medium text-blue-700 mb-1">Funds Raised</p>
                    <p className="text-2xl font-bold text-blue-900">${getTotalDonations().toFixed(0)}</p>
                    <p className="text-xs text-blue-600 mt-1">↑ Total collected</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <p className="text-xs font-medium text-purple-700 mb-1">Users</p>
                    <p className="text-2xl font-bold text-purple-900">{users.length}</p>
                    <p className="text-xs text-purple-600 mt-1">Registered</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                    <p className="text-xs font-medium text-amber-700 mb-1">Donations</p>
                    <p className="text-2xl font-bold text-amber-900">{payment_data.length}</p>
                    <p className="text-xs text-amber-600 mt-1">Transactions</p>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col text-left">
                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                    <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">New disaster reported</p>
                      <p className="text-xs text-gray-500">
                        {disasters.length > 0
                          ? new Date(disasters[disasters.length - 1]?.date || disasters[disasters.length - 1]?.createdAt).toLocaleTimeString()
                          : "No data"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">Donation received</p>
                      <p className="text-xs text-gray-500">
                        {payment_data.length > 0 ? new Date(payment_data[payment_data.length - 1]?.createdAt).toLocaleTimeString() : "No data"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">New user registered</p>
                      <p className="text-xs text-gray-500">
                        {users.length > 0 ? new Date(users[users.length - 1]?.createdAt).toLocaleTimeString() : "No data"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">System update</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Disaster Frequency and Latest Disasters - Horizontal Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mb-6">
              {/* Left: Disaster Frequency Chart */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex flex-col text-left">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Disaster Frequency</h2>
                  <p className="text-sm text-gray-500 mb-4">Analysis based on the disaster frequency</p>
                  <div className="pt-2">
                    <DisasterLineChart data={disasterLineChartData} height={470} />
                  </div>
                </div>
              </div>

              {/* Right: Latest Disasters Card */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col">
                <div className="flex flex-col text-left pb-4 border-b border-gray-200 flex-shrink-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Latest Disasters</h2>
                  <p className="text-sm text-gray-500">Recent disaster updates and alerts</p>
                </div>
                <div className="overflow-y-auto pr-2 mt-4 max-h-[520px]">
                  {latestDisasters.length === 0 ? (
                    <div className="flex items-center justify-center h-full py-8">
                      <p className="text-gray-400 text-sm text-center">No recent disasters found.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {latestDisasters.map((disaster, idx) => (
                        <div
                          key={disaster._id || idx}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <span className="text-red-600 text-lg">⚠️</span>
                          </div>
                          <div className="flex flex-col text-left flex-1 min-w-0">
                            <span className="font-semibold text-gray-900 text-sm mb-1 truncate">{disaster.disasterType}</span>
                            <span className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {disaster.description
                                ? disaster.description.length > 80
                                  ? disaster.description.slice(0, 80) + "..."
                                  : disaster.description
                                : ""}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(disaster.date || disaster.createdAt).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Registered Users Card - Separate Row */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
              <div className="flex flex-col text-left pb-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Registered Users</h2>
                <p className="text-sm text-gray-500">Active users on Guardian Earth platform</p>
              </div>
              <div className="mt-4">
                {users && users.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                    {users.map((user, index) => (
                      <div
                        key={user._id || index}
                        className="flex items-center text-left gap-3 p-3 rounded-lg hover:bg-emerald-50 transition-all duration-200 group border border-gray-100"
                      >
                        <div className="flex-shrink-0">
                          <img
                            alt={user.name}
                            className="rounded-full w-10 h-10 border-2 border-emerald-100 shadow-sm group-hover:border-emerald-300 transition"
                            src={user.profile_img || "https://placehold.co/40x40"}
                          />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-semibold text-gray-900 text-sm truncate">{user.name}</span>
                          <span className="text-xs text-gray-500 truncate">{user.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm py-8 text-center">No users found.</div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
              <Dashboard_grid recodes={datasetRecords} fetchdata={fetchDatasetRecords} onSync={handleSyncRecode} onLoadDataset={handleLoadDataset} />
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Add New Recode */}
      <Modal isOpen={isFormVisible} onClose={() => setIsFormVisible(false)} title="Add New Recode">
        <form onSubmit={handleFormSubmit} className="bg-white p-4 rounded-lg ">
          <div className="flex flex-col gap-6  bg-white rounded-lg ">
            {/* Recode ID */}
            <div>
              <label className="text-sm font-semibold text-gray-800">Recode ID</label>
              <input
                type="text"
                name="id"
                value={newRecode.id}
                className="border h-[36px] mt-1 border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500 transition duration-300"
                required
              />
            </div>
            {/* Recode Remark */}
            <div>
              <label className="text-sm font-semibold text-gray-800">Recode Remark</label>
              <textarea
                name="remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="border mt-1 border-gray-300 p-3 rounded-md w-full h-16 focus:outline-none focus:ring-1 focus:ring-green-500 transition duration-300"
                required
              />
            </div>
            {/* Status */}
            <div>
              <label className="text-sm font-semibold text-gray-800">Status</label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border h-[36px] mt-1 border-gray-300 text-[13px] pl-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500 transition duration-300"
                required
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="bg-green-500 h-[40px] text-white px-6 py-2 text-[14px] rounded-lg mt-4 w-full hover:bg-green-600 focus:outline-none focus:ring-0 focus:ring-green-500 transition duration-300"
            >
              Add Recode
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Dashboard;
