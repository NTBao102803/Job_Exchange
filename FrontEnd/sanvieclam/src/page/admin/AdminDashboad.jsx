import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Briefcase, DollarSign } from "lucide-react";
import { getAllEmployer } from "../../api/RecruiterApi";
import { getCandidates } from "../../api/CandidateApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    candidates: 0,
    employers: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [candidatesRes, employersRes, paymentsRes] = await Promise.all([
          getCandidates(),
          getAllEmployer(),
          axios.get("http://localhost:8080/api/payment/all"),
        ]);

        const candidates = candidatesRes?.length || [];
        const employers = employersRes?.length || [];
        const payments = paymentsRes?.data || [];

        const totalAmount = payments
          .filter((p) => p.status === "SUCCESS" || p.status === "COMPLETED")
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        setStats({
          candidates: candidates,
          employers: employers,
          totalAmount,
        });
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700 drop-shadow-sm">
            📊 Bảng Điều Khiển Quản Trị
          </h1>
          <p className="text-gray-500 mt-3 text-center text-lg max-w-2xl">
            Chào mừng bạn đến với hệ thống quản lý!
            <br />
            Theo dõi số liệu tổng quan và hoạt động của nền tảng tuyển dụng.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Ứng viên"
            icon={<Users size={28} />}
            value={stats.candidates}
            gradient="from-indigo-500 to-blue-500"
            small={false}
          />
          <StatCard
            title="Nhà tuyển dụng"
            icon={<Briefcase size={28} />}
            value={stats.employers}
            gradient="from-green-500 to-emerald-500"
            small={false}
          />
          <StatCard
            title="Doanh thu"
            icon={<DollarSign size={28} />}
            value={formatCurrency(stats.totalAmount)}
            gradient="from-yellow-500 to-orange-400"
            small={true} 
          />
        </div>

        {/* Quick Guide */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-inner text-center border border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">
            🚀 Hướng dẫn nhanh
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            • <b>Ứng viên:</b> Quản lý danh sách và hồ sơ ứng viên. <br />
            • <b>Nhà tuyển dụng:</b> Kiểm duyệt và theo dõi tài khoản doanh nghiệp. <br />
            • <b>Thanh toán:</b> Xem thống kê và quản lý các giao dịch thành công. <br />
            • <b>Báo cáo:</b> Phân tích dữ liệu và tối ưu hiệu suất hệ thống.
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, icon, value, gradient, small }) => {
  return (
    <div className="relative group bg-white border border-gray-100 rounded-2xl p-5 shadow-md hover:shadow-2xl transition-all duration-300 w-full">
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition duration-500`}
      ></div>
      <div className="flex items-center gap-4 relative z-10">
        <div
          className={`p-3 rounded-full bg-gradient-to-br ${gradient} text-white shadow-md`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-gray-700 font-semibold text-base">{title}</h3>
          <p
            className={`font-bold mt-1 ${
              small ? "text-xl md:text-2xl text-gray-800" : "text-2xl md:text-3xl text-gray-900"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
