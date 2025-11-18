import React, { useState, useEffect } from "react";
import { Search, CreditCard } from "lucide-react";
import axios from "axios";
import { getAllPayments } from "../../api/PaymentApi";

const AdminPayment = () => {
  const [payments, setPayments] = useState([]);
  const [searchOrder, setSearchOrder] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // 1 trang tối đa 8 dòng

  const statusMap = {
    "Tất cả": "ALL",
    "Thành công": "SUCCESS",
    "Thất bại": "FAILED",
    "Đang xử lý": "PENDING",
  };

  const backendToLabel = {
    SUCCESS: "Thành công",
    FAILED: "Thất bại",
    PENDING: "Đang xử lý",
  };

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments(); // dùng API đã tách
        setPayments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Lỗi tải giao dịch:", error);
      }
    };
    fetchPayments();
  }, []);

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const orderIdStr = (p.orderId ?? "").toString();
    const matchOrder = orderIdStr.includes(searchOrder);
    const matchStatus = filterStatus === "ALL" || p.status === filterStatus;
    return matchOrder && matchStatus;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-1">
      <h1 className="flex items-center gap-3 text-3xl font-extrabold mb-8 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent drop-shadow-sm">
        <CreditCard className="w-9 h-9 text-green-600 drop-shadow-sm" />
        Quản lý giao dịch thanh toán
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 mt-10">
        <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-full sm:w-1/2">
          <Search className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Tìm theo Order ID..."
            value={searchOrder}
            onChange={(e) => {
              setSearchOrder(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 outline-none text-gray-700"
          />
        </div>

        <div className="flex gap-2">
          {Object.keys(statusMap).map((label) => (
            <button
              key={label}
              onClick={() => {
                setFilterStatus(statusMap[label]);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                statusMap[label] === filterStatus
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 p-6 rounded-2xl shadow-lg mt-10 overflow-x-auto">
        <table className="w-full text-left border-collapse rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-white/20 text-white uppercase text-sm tracking-wider">
              <th className="p-4">ID</th>
              <th className="p-4">Order ID</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Phương thức</th>
              <th className="p-4">Gói</th>
              <th className="p-4">Ngày tạo</th>
              <th className="p-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((p) => {
              const statusLabel = backendToLabel[p.status] || p.status;
              const statusClass =
                p.status === "SUCCESS"
                  ? "bg-green-500"
                  : p.status === "FAILED"
                  ? "bg-red-500"
                  : "bg-yellow-500";

              return (
                <tr
                  key={p.id}
                  className="bg-white/10 backdrop-blur-xl hover:bg-white/20 transition border-b border-white/30"
                >
                  <td className="p-4 font-semibold text-white">{p.id}</td>
                  <td className="p-4 text-white">{p.orderId}</td>
                  <td className="p-4 text-white font-bold">
                    {p.amount?.toLocaleString() ?? 0} VND
                  </td>
                  <td className="p-4 text-white">{p.method}</td>
                  <td className="p-4 text-white">{p.planName}</td>
                  <td className="p-4 text-white">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-4 text-white">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-white">
          <span className="text-sm mb-2 sm:mb-0">
            Hiển thị {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, filteredPayments.length)} trong{" "}
            {filteredPayments.length} giao dịch
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
  );
};

export default AdminPayment;
