// src/pages/admin/AdminFinanceReport.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, Briefcase } from "lucide-react";
import { getAllEmployer } from "../../api/RecruiterApi";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#A855F7"];

const formatCurrency = (v = 0) =>
  v.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const AdminFinanceReport = () => {
  const [payments, setPayments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchOrder, setSearchOrder] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        console.log("📡 Fetching dữ liệu...");

        // ✅ 1. Lấy tất cả payment & plan
        const [paymentRes, planRes] = await Promise.all([
          axios.get("http://localhost:8080/api/payment/all"),
          axios.get("http://localhost:8080/api/payment-plans"),
        ]);

        // ✅ 2. Lấy employer (đã có token)
        const recruiterData = await getAllEmployer();

        const paymentData = paymentRes.data || [];
        const planData = planRes.data || [];

        console.log("💰 Payment data:", paymentData);
        console.log("📦 Plan data:", planData);
        console.log("🏢 Recruiter data:", recruiterData);

        // ✅ Phần mapping sau khi fetch API
const enriched = paymentData.map((p) => {
  // ✅ Tìm plan khớp theo tên (vì payment không có plan_id)
  const plan = planData.find(
    (pl) =>
      pl.name?.trim().toLowerCase() === p.planName?.trim().toLowerCase()
  );

  // ✅ Tìm recruiter dựa vào authUserId === recruiter_id (nếu có)
  const recruiter = recruiterData.find(
    (r) =>
      Number(r.authUserId) === Number(p.recruiter_id) ||
      Number(r.id) === Number(p.recruiter_id)
  );

  return {
    ...p,
    planName: plan?.name || p.planName || "Không xác định",
    planPrice: plan?.price || p.amount,
    recruiterName:
      recruiter?.companyName ||
      recruiter?.fullName ||
      recruiter?.email ||
      `#${p.recruiter_id}`,
  };
});

console.log("🧾 Enriched payments:", enriched);


        setPayments(enriched);
        setPlans(planData);
        setRecruiters(recruiterData);
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu báo cáo tài chính:", err);
        if (err.response) {
          console.error("🔍 Response lỗi:", err.response.status, err.response.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // --- 🧮 Thống kê tổng quan ---
  const stats = useMemo(() => {
    const success = payments.filter((p) => p.status === "SUCCESS");
    const totalRevenue = success.reduce((sum, p) => sum + (p.amount || 0), 0);

    const now = new Date();
    const monthlyRevenue = success
      .filter((p) => {
        const d = new Date(p.created_at || p.createdAt);
        return (
          d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const successRate =
      payments.length > 0
        ? ((success.length / payments.length) * 100).toFixed(1)
        : 0;

    return {
      totalRevenue,
      monthlyRevenue,
      totalPayments: payments.length,
      successCount: success.length,
      successRate,
    };
  }, [payments]);

  // --- 📈 Doanh thu theo ngày ---
  const revenueByDate = useMemo(() => {
    const map = {};
    payments
      .filter((p) => p.status === "SUCCESS")
      .forEach((p) => {
        const key = new Date(p.created_at || p.createdAt).toLocaleDateString("vi-VN");
        map[key] = (map[key] || 0) + (p.amount || 0);
      });
    return Object.entries(map)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [payments]);

  // --- 📊 Doanh thu theo gói ---
  const revenueByPlan = useMemo(() => {
    const map = {};
    payments
      .filter((p) => p.status === "SUCCESS")
      .forEach((p) => {
        map[p.planName] = (map[p.planName] || 0) + (p.amount || 0);
      });
    return Object.entries(map)
      .map(([plan, total]) => ({ plan, total }))
      .sort((a, b) => b.total - a.total);
  }, [payments]);

  // --- 🥇 Top recruiter ---
  const topRecruiters = useMemo(() => {
    const map = {};
    payments
      .filter((p) => p.status === "SUCCESS")
      .forEach((p) => {
        map[p.recruiterName] = (map[p.recruiterName] || 0) + (p.amount || 0);
      });
    return Object.entries(map)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [payments]);

  // --- 🔍 Bộ lọc bảng ---
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const statusOK = statusFilter === "ALL" || p.status === statusFilter;
      const searchOK =
        !searchOrder ||
        (p.order_id || "")
          .toLowerCase()
          .includes(searchOrder.toLowerCase());
      return statusOK && searchOK;
    });
  }, [payments, statusFilter, searchOrder]);

  // --- ⬇️ Xuất CSV ---
  const handleExportCSV = () => {
    const header = [
      "ID",
      "Order ID",
      "Gói dịch vụ",
      "Nhà tuyển dụng",
      "Số tiền",
      "Phương thức",
      "Trạng thái",
      "Ngày tạo",
    ];
    const rows = filteredPayments.map((p) => [
      p.id,
      p.order_id,
      p.planName,
      p.recruiterName,
      p.amount,
      p.method,
      p.status,
      new Date(p.created_at).toLocaleString("vi-VN"),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-6 text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="h-[calc(100vh-64px)] p-6 bg-gray-50 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <Briefcase /> Báo Cáo Tài Chính (Admin)
        </h1>
        <button
          onClick={handleExportCSV}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download size={16} /> Xuất CSV
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {/* --- Thẻ tổng quan --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Tổng doanh thu" value={formatCurrency(stats.totalRevenue)} color="text-blue-600" note="Từ giao dịch SUCCESS" />
          <StatCard title="Doanh thu tháng này" value={formatCurrency(stats.monthlyRevenue)} color="text-emerald-600" note="Theo tháng hiện tại" />
          <StatCard title="Tổng giao dịch" value={stats.totalPayments} color="text-amber-600" note="Bao gồm mọi trạng thái" />
          <StatCard title="Tỉ lệ thành công" value={`${stats.successRate}%`} color="text-purple-600" note={`${stats.successCount} giao dịch thành công`} />
        </div>

        {/* --- Biểu đồ chính --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ChartCard title="Doanh thu theo ngày" desc="Chỉ tính giao dịch SUCCESS">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Line dataKey="total" stroke="#4f46e5" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top recruiter (chi tiêu)" desc="Nhà tuyển dụng chi tiêu cao nhất">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topRecruiters}
                  dataKey="total"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {topRecruiters.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* --- Biểu đồ doanh thu theo gói --- */}
        <ChartCard title="Doanh thu theo gói dịch vụ" desc="Xếp theo gói có doanh thu lớn nhất">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByPlan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plan" />
              <YAxis />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="total" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* --- Bảng dữ liệu --- */}
        <PaymentTable
          payments={filteredPayments}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchOrder={searchOrder}
          setSearchOrder={setSearchOrder}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, note }) => (
  <div className="bg-white p-4 rounded-xl shadow flex flex-col">
    <div className="text-sm text-gray-500">{title}</div>
    <div className={`text-2xl font-bold mt-2 ${color}`}>{value}</div>
    <div className="text-xs text-gray-400 mt-2">{note}</div>
  </div>
);

const ChartCard = ({ title, desc, children }) => (
  <div className="bg-white rounded-xl p-4 shadow col-span-1 lg:col-span-2">
    <h3 className="font-semibold mb-1">{title}</h3>
    <p className="text-xs text-gray-400 mb-3">{desc}</p>
    {children}
  </div>
);

const PaymentTable = ({
  payments,
  statusFilter,
  setStatusFilter,
  searchOrder,
  setSearchOrder,
  formatCurrency,
}) => (
  <div className="bg-white rounded-xl p-4 shadow mb-10">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
      <input
        placeholder="Tìm mã đơn hàng..."
        value={searchOrder}
        onChange={(e) => setSearchOrder(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full sm:w-1/3 text-sm"
      />
      <div className="flex gap-2 items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="ALL">Tất cả</option>
          <option value="PENDING">PENDING</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="FAILED">FAILED</option>
        </select>
        <div className="text-sm text-gray-500">{payments.length} giao dịch</div>
      </div>
    </div>

    <div className="max-h-[360px] overflow-y-auto border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="py-2 px-3 text-left">Mã đơn</th>
            <th className="py-2 px-3 text-left">Gói</th>
            <th className="py-2 px-3 text-left">Nhà tuyển dụng</th>
            <th className="py-2 px-3 text-right">Số tiền</th>
            <th className="py-2 px-3 text-left">Phương thức</th>
            <th className="py-2 px-3 text-left">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-3 font-mono text-indigo-600">{p.order_id}</td>
              <td className="py-2 px-3">{p.planName}</td>
              <td className="py-2 px-3">{p.recruiterName}</td>
              <td className="py-2 px-3 text-right font-semibold">
                {formatCurrency(p.amount)}
              </td>
              <td className="py-2 px-3">{p.method}</td>
              <td className="py-2 px-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    p.status === "SUCCESS"
                      ? "bg-green-100 text-green-700"
                      : p.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan={7} className="py-6 text-center text-gray-500">
                Không có giao dịch phù hợp.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminFinanceReport;
