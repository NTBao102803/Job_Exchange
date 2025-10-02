import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const RegisterServiceForm = () => {
  const location = useLocation();
  const selectedPlan = location.state?.plan; // 👉 Nhận dữ liệu từ navigate
  const [paymentMethod, setPaymentMethod] = useState("VNPay");

  // 🟢 Sau này mỗi tài khoản backend sẽ trả về QR riêng
  const qrImages = {
    VNPay: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VNPay-Payment",
    Momo: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Momo-Payment",
    Bank: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Bank-Transfer",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 pt-32">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-3xl">
        <h1 className="text-3xl font-extrabold text-indigo-600 text-center mb-8">
          📝 Đăng ký gói dịch vụ
        </h1>

        {/* 👉 Thông tin gói */}
        {selectedPlan ? (
          <div className="mb-8 p-6 border-2 border-indigo-500 rounded-2xl bg-indigo-50">
            <h2 className="text-xl font-bold text-indigo-700">
              {selectedPlan.name}
            </h2>
            <p className="text-gray-700 font-medium">{selectedPlan.price}</p>
            <ul className="mt-3 text-gray-600 space-y-1">
              {selectedPlan.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-red-500">⚠ Không có gói nào được chọn.</p>
        )}

        {/* 👉 Chọn phương thức thanh toán */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phương thức thanh toán
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring focus:ring-indigo-300"
            >
              <option value="VNPay">VNPay</option>
              <option value="Momo">Momo</option>
              <option value="Bank">Chuyển khoản ngân hàng</option>
            </select>
          </div>

          {/* 👉 Hiển thị QR thanh toán */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-gray-700 font-medium">
              Quét mã QR để thanh toán qua{" "}
              <span className="font-bold">{paymentMethod}</span>
            </p>
            <img
              src={qrImages[paymentMethod]}
              alt="QR code"
              className="w-52 h-52 rounded-xl shadow-lg border animate-pulse"
            />
            <p className="text-sm text-gray-500">
              ⚡ Sau khi thanh toán thành công, hệ thống sẽ tự động kích hoạt gói.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterServiceForm;
