import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { Users, ShieldAlert, UserCheck, FileCheck, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { getAllEmployer } from "../../api/RecruiterApi";
import { getCandidates } from "../../api/CandidateApi";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#A855F7"];

const AdminUserReport = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [r, c] = await Promise.all([getAllEmployer(), getCandidates()]);
        setRecruiters(r || []);
        setCandidates(c || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // 🧩 Thống kê cơ bản
  const totalUsers = recruiters.length + candidates.length;
  const totalBlocked =
    candidates.filter(c => c.is_blocked || c.status === "BLOCKED").length +
    recruiters.filter(r => r.is_blocked || r.status === "BLOCKED").length;
  const totalActive = totalUsers - totalBlocked;

  // Chỉ dành cho hồ sơ nhà tuyển dụng
  const recruiterApproval = useMemo(() => {
    const count = { APPROVED: 0, WAITING_APPROVAL: 0, REJECTED: 0 };
    recruiters.forEach(r => {
      if (r.status === "WAITING_APPROVAL") count.WAITING_APPROVAL++;
      else if (r.status === "REJECTED") count.REJECTED++;
      else count.APPROVED++;
    });
    return count;
  }, [recruiters]);

  // Dữ liệu biểu đồ
  const userTypeData = useMemo(() => [
    { name: "Ứng viên", value: candidates.length },
    { name: "Nhà tuyển dụng", value: recruiters.length }
  ], [candidates, recruiters]);

  const accountStatusData = useMemo(() => [
    { name: "Đang hoạt động", value: totalActive },
    { name: "Đã bị khóa", value: totalBlocked }
  ], [totalActive, totalBlocked]);

  const blockedCompareData = useMemo(() => {
    const cBlocked = candidates.filter(c => c.is_blocked || c.status === "BLOCKED").length;
    const rBlocked = recruiters.filter(r => r.is_blocked || r.status === "BLOCKED").length;
    return [
      { name: "Ứng viên", value: cBlocked },
      { name: "Nhà tuyển dụng", value: rBlocked }
    ];
  }, [candidates, recruiters]);

  const recruiterStatusData = useMemo(() => [
    { name: "Đã duyệt hồ sơ", value: recruiterApproval.APPROVED },
    { name: "Chờ duyệt", value: recruiterApproval.WAITING_APPROVAL },
    { name: "Từ chối", value: recruiterApproval.REJECTED }
  ], [recruiterApproval]);

  const activityRateData = useMemo(() => {
    const activeRate = ((totalActive / (totalUsers || 1)) * 100).toFixed(1);
    const blockedRate = (100 - activeRate).toFixed(1);
    return [
      { name: "Hoạt động", value: parseFloat(activeRate) },
      { name: "Bị khóa", value: parseFloat(blockedRate) }
    ];
  }, [totalActive, totalUsers]);

  // 🧾 UI
  return (
    <motion.div
      className="p-6 space-y-6 h-[calc(100vh-80px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-indigo-600">
          <BarChart2 /> Báo cáo hệ thống tài khoản
        </h1>
      </div>

      {/* 🔹 Thẻ tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Tổng số tài khoản",
            value: totalUsers,
            icon: <Users className="text-indigo-500" size={32} />,
            color: "bg-indigo-100 text-indigo-700"
          },
          {
            title: "Đang hoạt động",
            value: totalActive,
            icon: <UserCheck className="text-emerald-500" size={32} />,
            color: "bg-emerald-100 text-emerald-700"
          },
          {
            title: "Tài khoản bị khóa",
            value: totalBlocked,
            icon: <ShieldAlert className="text-red-500" size={32} />,
            color: "bg-red-100 text-red-700"
          },
          {
            title: "Hồ sơ NTD chờ duyệt",
            value: recruiterApproval.WAITING_APPROVAL,
            icon: <FileCheck className="text-amber-500" size={32} />,
            color: "bg-amber-100 text-amber-700"
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className={`flex items-center justify-between p-5 rounded-2xl shadow-sm ${item.color}`}
          >
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <h3 className="text-3xl font-bold">{item.value}</h3>
            </div>
            {item.icon}
          </motion.div>
        ))}
      </div>

      {/* 🔸 Biểu đồ */}
      {loading ? (
        <p className="text-gray-500 text-center py-6">Đang tải dữ liệu...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1️⃣ Thành phần người dùng */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white shadow rounded-xl p-6">
            <h3 className="font-semibold mb-3 text-gray-700">Thành phần người dùng</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={userTypeData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {userTypeData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <ReTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 2️⃣ Tình trạng tài khoản */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white shadow rounded-xl p-6">
            <h3 className="font-semibold mb-3 text-gray-700">Tình trạng tài khoản hệ thống</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={accountStatusData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {accountStatusData.map((_, i) => <Cell key={i} fill={COLORS[i + 1]} />)}
                </Pie>
                <ReTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 3️⃣ Hồ sơ nhà tuyển dụng */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white shadow rounded-xl p-6">
            <h3 className="font-semibold mb-3 text-gray-700">Trạng thái hồ sơ nhà tuyển dụng</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={recruiterStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <ReTooltip />
                <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 4️⃣ So sánh bị khóa */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white shadow rounded-xl p-6">
            <h3 className="font-semibold mb-3 text-gray-700">So sánh tài khoản bị khóa</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={blockedCompareData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <ReTooltip />
                <Bar dataKey="value" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 5️⃣ Tỷ lệ hoạt động */}
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white shadow rounded-xl p-6 lg:col-span-2">
            <h3 className="font-semibold mb-3 text-gray-700">Tỷ lệ hoạt động của toàn hệ thống (%)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={activityRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <ReTooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminUserReport;
