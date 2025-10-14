import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { CheckCircleIcon, CreditCardIcon, QrCodeIcon } from "@heroicons/react/24/solid";

const RegisterServiceForm = () => {
  const location = useLocation();
  const selectedPlan = location.state?.plan;
  const [paymentMethod, setPaymentMethod] = useState("Momo");
  const [orderId, setOrderId] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [step, setStep] = useState(1);
  const [currentPlan, setCurrentPlan] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");



  const handleCreatePayment = async () => {
    try {
      const reqBody = {
        planId: selectedPlan.id,
        recruiterId: user.id,
        method: paymentMethod,
      };

      const res = await axios.post("http://localhost:8080/api/payment/create", reqBody);

      setOrderId(res.data.orderId);
      setQrCodeUrl(res.data.qrCodeUrl || res.data.payUrl);
      setStep(2);

      alert(`✅ Đã tạo đơn hàng ${res.data.orderId}`);
    } catch (err) {
      console.error("Create payment error:", err);
      alert("❌ Lỗi khi tạo thanh toán");
    }
  };

  const simulateScan = async () => {
    if (!orderId) {
      alert("⚠️ Chưa có đơn hàng nào để quét! Hãy tạo thanh toán trước.");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/payment/scan", null, {
        params: { orderId },
      });
      setStep(3);
      alert("✅ Giả lập thanh toán thành công!");
    } catch (err) {
      console.error("simulateScan error: ", err);
      alert("❌ Giả lập thanh toán thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 p-6 flex flex-col items-center">
      {/* === Tiêu đề chính === */}
      <h1 className="text-4xl font-extrabold text-indigo-600 mb-4 text-center">
        💼 Đăng Ký Gói Dịch Vụ
      </h1>


      {/* === Thanh tiến trình === */}
      <div className="flex justify-between items-center mb-10 w-full max-w-3xl">
        {[
          { id: 1, label: "Chọn gói", icon: <CreditCardIcon className="h-6 w-6" /> },
          { id: 2, label: "Thanh toán", icon: <QrCodeIcon className="h-6 w-6" /> },
          { id: 3, label: "Hoàn tất", icon: <CheckCircleIcon className="h-6 w-6" /> },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center relative w-1/3">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 
              ${step >= item.id ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              {item.icon}
            </div>
            <p className="mt-2 text-sm font-medium">{item.label}</p>
            {idx < 2 && (
              <div
                className={`absolute top-6 right-[-50%] w-full h-[3px] transition-all duration-300 ${
                  step > item.id ? "bg-indigo-600" : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* === Thông tin gói được chọn === */}
      {selectedPlan ? (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-10">
          <h2 className="text-2xl font-bold text-indigo-700 mb-3">{selectedPlan.name}</h2>
          <p className="text-xl font-semibold text-gray-800 mb-3">
            💰 {selectedPlan.price.toLocaleString("vi-VN")}đ / {selectedPlan.durationDays} ngày
          </p>

          {/* mô tả dạng danh sách đẹp */}
          <ul className="space-y-3 mb-6 text-gray-700">
            {(selectedPlan.description?.split(".") || [])
              .map((f) => f.trim())
              .filter((f) => f)
              .map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✔</span>
                  {feature}
                </li>
              ))}
          </ul>

          {step === 1 && (
            <div className="space-y-5">
              <label className="block font-semibold text-gray-600 mb-2">
                Phương thức thanh toán
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border rounded-lg px-4 py-3 w-full bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Momo">Momo (Giả lập)</option>
                <option value="VNPay">VNPay (Giả lập)</option>
              </select>

              <button
                onClick={handleCreatePayment}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300"
              >
                🔗 Tạo thanh toán
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-6">
              <p className="text-gray-700 text-lg">
                Mã đơn hàng: <b className="text-indigo-700">{orderId}</b>
              </p>
              {qrCodeUrl && (
                <div className="flex flex-col items-center">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-64 h-64 mx-auto mt-2 rounded-2xl border shadow-md hover:scale-105 transition-all duration-300"
                  />
                  <p className="text-gray-500 mt-2">Quét mã để giả lập thanh toán</p>
                </div>
              )}
              <button
                onClick={simulateScan}
                className="mt-6 w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 font-semibold transition-all duration-300"
              >
                ✅ Giả lập quét mã thành công
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center mt-8 space-y-4">
              <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-800">Thanh toán thành công!</h2>
              <p className="text-gray-600">
                Gói <b>{selectedPlan.name}</b> của bạn đã được kích hoạt 🎉
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600">⚠️ Không có gói nào được chọn.</p>
      )}
    </div>
  );
};

export default RegisterServiceForm;
