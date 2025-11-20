import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  CreditCardIcon,
  QrCodeIcon,
} from "@heroicons/react/24/solid";
import { createPayment, simulateScanPayment, getAllSepay } from "../../api/PaymentApi";

const RegisterServiceForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan;

  const [paymentMethod, setPaymentMethod] = useState("Mã QR Ngân Hàng");
  const [orderId, setOrderId] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Polling hoặc fetch transactions sau khi tạo payment
  useEffect(() => {
    

    const checkTransaction = async () => {
      try {
        const response = await getAllSepay();
        setTransactions(response);
        console.log("Fetched transactions:", response);

        const cleanedOrderId =orderId.replace(/-/g, ""); // bỏ dấu -
        const matched = response.some(tx =>
          tx.transaction_content?.includes(cleanedOrderId)
        );
        if (matched) {
          // Tìm thấy transaction → gọi simulateScan để cập nhật payment
          await simulateScanPayment(orderId);
          setStep(3); // chuyển sang bước thành công
        }
      } catch (err) {
        console.error("Error checking transactions:", err);
      }
    };

    // gọi ngay lần đầu
    checkTransaction();

    // có thể dùng polling 5s để tự động cập nhật nếu chưa có
    const interval = setInterval(checkTransaction, 5000);
    return () => clearInterval(interval);

  }, [orderId]);

  // ✅ Tạo thanh toán
  const handleCreatePayment = async () => {
    if (isCreating) return;
    setIsCreating(true);

    try {
      const reqBody = {
        planId: selectedPlan.id,
        recruiterId: user.id,
        method: paymentMethod,
      };

      const res = await createPayment(reqBody);
      setOrderId(res.orderId);
      setQrCodeUrl(res.qrCodeUrl || res.payUrl);
      setStep(2);
      alert(`✅ Đã tạo đơn hàng ${res.orderId}`);
    } catch (err) {
      console.error("Create payment error:", err);
      alert("❌ Lỗi khi tạo thanh toán!");
    } finally {
      setIsCreating(false);
    }
  };

  // ✅ tự động chuyển trang khi step === 3 sau 4 giây
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => navigate(-1), 4000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-indigo-600 mb-4 text-center">
        💼 Đăng Ký Gói Dịch Vụ
      </h1>

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

      {selectedPlan ? (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-10">
          <h2 className="text-2xl font-bold text-indigo-700 mb-3">{selectedPlan.name}</h2>
          <p className="text-xl font-semibold text-gray-800 mb-3">
            💰 {selectedPlan.price.toLocaleString("vi-VN")}đ / {selectedPlan.durationDays} ngày
          </p>

          <ul className="space-y-3 mb-6 text-gray-700">
            {(selectedPlan.description?.split(".") || [])
              .map(f => f.trim())
              .filter(f => f)
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
                onChange={e => setPaymentMethod(e.target.value)}
                className="border rounded-lg px-4 py-3 w-full bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Mã QR Ngân Hàng">Mã QR Ngân Hàng</option>
              </select>

              <button
                onClick={handleCreatePayment}
                disabled={isCreating}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                  isCreating
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isCreating ? "⏳ Đang tạo..." : "🔗 Tạo thanh toán"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-6">
              <p className="text-gray-700 text-lg">
                Mã đơn hàng: <b className="text-indigo-700">{orderId}</b>
              </p>
              {orderId && (
                <img
                  src={`https://qr.sepay.vn/img?acc=0899626775&bank=MBBank&amount=2000&des=${encodeURIComponent(orderId)}`}
                  alt="SePay QR Code"
                  className="w-64 h-64 mx-auto mt-2 rounded-2xl border shadow-md hover:scale-105 transition-all duration-300"
                />
              )}
              <p className="text-gray-500 mt-2">Quét mã để thanh toán dịch vụ</p>
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
