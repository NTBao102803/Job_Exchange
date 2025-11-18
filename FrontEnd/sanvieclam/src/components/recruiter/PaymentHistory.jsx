import React, { useEffect, useState } from "react";
import axios from "axios";
import { getPaymentsByRecruiter } from "../../api/PaymentApi";

const PaymentHistory = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const data = await getPaymentsByRecruiter(user.id);
        setPayments(data || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách thanh toán:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [user.id]);

  const filteredPayments = payments.filter((p) => {
    const matchStatus = filter === "ALL" || p.status === filter;
    const matchSearch = p.orderId?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <p className="text-lg text-gray-500 animate-pulse">⏳ Đang tải lịch sử thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gray-50 pt-28 px-6 flex flex-col items-center pb-28">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
        💳 Lịch Sử Giao Dịch
      </h1>

      {/* Bộ lọc */}
      <div className="flex flex-wrap justify-between w-full max-w-5xl mb-6 bg-white p-4 rounded-xl shadow">
        <input
          type="text"
          placeholder="🔍 Tìm theo mã đơn hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-72 focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="PENDING">Đang chờ</option>
          <option value="SUCCESS">Thành công</option>
          <option value="FAILED">Thất bại</option>
        </select>
      </div>

      {/* Danh sách giao dịch */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Không có giao dịch nào phù hợp.</div>
        ) : (
          <div className="max-h-[480px] overflow-y-auto">
            <table className="min-w-full text-gray-700 text-sm">
              <thead className="bg-indigo-600 text-white sticky top-0">
                <tr>
                  <th className="py-3 px-4 text-left">Mã Đơn Hàng</th>
                  <th className="py-3 px-4 text-left">Gói Dịch Vụ</th>
                  <th className="py-3 px-4 text-left">Số Tiền</th>
                  <th className="py-3 px-4 text-left">Phương Thức</th>
                  <th className="py-3 px-4 text-left">Trạng Thái</th>
                  <th className="py-3 px-4 text-left">Ngày Tạo</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-indigo-50 transition duration-150"
                  >
                    <td className="py-3 px-4 font-mono text-indigo-600">{p.orderId}</td>
                    <td className="py-3 px-4">{p.planName}</td>
                    <td className="py-3 px-4">{p.amount.toLocaleString("vi-VN")}₫</td>
                    <td className="py-3 px-4">{p.method}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                    <td className="py-3 px-4">
                      {new Date(p.createdAt).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
