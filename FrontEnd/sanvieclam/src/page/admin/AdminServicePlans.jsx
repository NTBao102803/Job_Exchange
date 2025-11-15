import React, { useEffect, useState } from "react";
import axios from "axios";
import { Info, CreditCard, Search } from "lucide-react";
import { getAllEmployer } from "../../api/RecruiterApi";

const ITEMS_PER_PAGE = 6;

const AdminServicePlans = () => {
  const [activeTab, setActiveTab] = useState("cards"); // "cards" hoặc "table"

  // ====== Plans (Tab 1) ======
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // ====== Subscriptions (Tab 2) ======
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [employerNames, setEmployerNames] = useState({});

  const getEmployerName = async (recruiterId) => {
    if (employerNames[recruiterId]) {
      return employerNames[recruiterId]; // Cache hit
    }
    try {
        const allEmployers = await getAllEmployer();
        const employer = allEmployers.find(emp => emp.authUserId === recruiterId);
        const name = employer?.companyName || "Không rõ";
      setEmployerNames(prev => ({
      ...prev,
      [recruiterId]: name,
    }));

    return name;
    } catch (err) {
      console.error("❌ Lỗi lấy employer:", err);
      return "Không rõ";
    }
  };

  const statusMapLabel = {
    ACTIVE: "Đang hoạt động",
    EXPIRED: "Hết hạn",
    CANCELLED: "Hủy",
  };
  const statusClassMap = {
    ACTIVE: "bg-green-500",
    EXPIRED: "bg-gray-500",
    CANCELLED: "bg-red-500",
  };

  // ================== Fetch Plans ==================
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/payment-plans");
        setPlans(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách gói dịch vụ:", err);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  // ================== Fetch Subscriptions ==================
  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/payment-plans/subscriptions"
        );
        setSubscriptions(Array.isArray(res.data) ? res.data : []);
        for (const sub of res.data) {
          getEmployerName(sub.recruiterId);
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy subscriptions:", err);
      } finally {
        setLoadingSubs(false);
      }
    };
    fetchSubs();
  }, []);

  if (loadingPlans || loadingSubs) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <p className="text-lg text-gray-500 animate-pulse">
          ⏳ Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  // ================== Tab 2: Filter + Pagination ==================
  const filteredSubs = subscriptions.filter((sub) => {
  const matchStatus = filterStatus === "ALL" || sub.status === filterStatus;

  const employerName = employerNames[sub.recruiterId] || "";

  const matchSearch = employerName
    .toLowerCase()
    .includes(search.toLowerCase());

  return matchStatus && matchSearch;
});


  const totalPages = Math.ceil(filteredSubs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSubs = filteredSubs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="bg-gray-50 h-full p-4 flex flex-col items-center">
      {/* Header */}
      <h1 className="flex items-center gap-3 text-3xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
        <CreditCard className="w-9 h-9 text-indigo-600 drop-shadow-sm" />
        Quản lý Gói Dịch Vụ
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("cards")}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === "cards"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Gói Dịch vụ
        </button>
        <button
          onClick={() => setActiveTab("table")}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === "table"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Quản lý subscription
        </button>
      </div>

      {/* Tab 1: Cards */}
      {activeTab === "cards" && (
        <div className="flex justify-center w-full mb-10">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
            {plans.map((plan, idx) => {
              const features =
                plan.description
                  ?.split(".")
                  .map((f) => f.trim())
                  .filter(Boolean) || [];
              const isActive = plan.status === "ACTIVE";

              return (
                <div
                  key={idx}
                  className="relative rounded-3xl shadow-2xl p-8 bg-white transition transform hover:scale-105 hover:shadow-2xl flex flex-col"
                >
                  {isActive && (
                    <span className="absolute -top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg animate-pulse">
                      ✅ Đang hoạt động
                    </span>
                  )}
                  <h2 className="text-2xl font-bold text-indigo-600 mb-2 text-center">
                    {plan.name}
                  </h2>
                  <p className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    💰 {plan.price?.toLocaleString("vi-VN")}đ / {plan.durationDays} ngày
                  </p>
                  <ul className="space-y-2 mb-6">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <span className="text-green-500 mr-2">✔</span> {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-700 mt-auto flex items-center gap-2">
                    <Info size={16} /> <span className="font-semibold">Trạng thái:</span>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                        isActive
                          ? "bg-gradient-to-r from-green-400 to-emerald-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {plan.status || "Đang hoạt động"}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Subscriptions Table */}
      {activeTab === "table" && (
        <div className="w-full max-w-6xl">
          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 mt-1">
            <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-full sm:w-1/2">
              <Search className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Tìm theo tên công ty..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 outline-none text-gray-700"
              />
            </div>

            <div className="flex gap-2">
              {["ALL", "ACTIVE", "EXPIRED", "CANCELLED"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    filterStatus === status
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  {statusMapLabel[status] || "Tất cả"}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 p-6 rounded-2xl shadow-lg overflow-x-auto">
            <table className="w-full text-left border-collapse rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-white/20 text-white uppercase text-sm tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Recruiter ID</th>
                  <th className="p-4">Tên gói</th>
                  <th className="p-4">Thời gian (ngày)</th>
                  <th className="p-4">Bắt đầu</th>
                  <th className="p-4">Kết thúc</th>
                  <th className="p-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {currentSubs.map((sub) => (
                  <tr
                    key={sub.id}
                    className="bg-white/10 backdrop-blur-xl hover:bg-white/20 transition border-b border-white/30"
                  >
                    <td className="p-4 font-semibold text-white">{sub.id}</td>
                    <td className="p-4 text-white ">
                        {employerNames[sub.recruiterId] || "Đang tải..."}
                    </td>
                    <td className="p-4 text-white">{sub.planName}</td>
                    <td className="p-4 text-white">{sub.planDurationDays}</td>
                    <td className="p-4 text-white">
                      {new Date(sub.startAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-white">
                      {new Date(sub.endAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-white">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                          statusClassMap[sub.status] || "bg-gray-400"
                        }`}
                      >
                        {statusMapLabel[sub.status] || sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-white">
              <span className="text-sm mb-2 sm:mb-0">
                Hiển thị {startIndex + 1}-
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredSubs.length)} trong{" "}
                {filteredSubs.length} subscriptions
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white/30 rounded-lg hover:bg-white/40 disabled:opacity-40"
                >
                  Trước
                </button>

                <span className="px-3 py-1 bg-white/20 rounded-lg">
                  {currentPage} / {totalPages || 1}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 bg-white/30 rounded-lg hover:bg-white/40 disabled:opacity-40"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServicePlans;
