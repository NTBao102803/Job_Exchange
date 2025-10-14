import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ServicePlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState("");
  const [loading, setLoading] = useState(true);

  // 📦 Lấy danh sách gói và gói hiện tại
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/payment-plans");
        setPlans(res.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách gói dịch vụ:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentPlan = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) return;

        const res = await axios.get(
          `http://localhost:8080/api/payment-plans/current/${user.id}`
        );
        setCurrentPlan(res.data?.planName || "");
      } catch (err) {
        console.warn("Không có gói hiện tại hoặc lỗi khi lấy gói hiện tại:", err);
      }
    };

    fetchPlans();
    fetchCurrentPlan();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-500 animate-pulse">
          ⏳ Đang tải danh sách gói dịch vụ...
        </p>
      </div>
    );
  }

  // 🔢 Xếp hạng gói (để so sánh cấp độ)
  const planRank = {
    "Gói Cơ Bản": 1,
    "Gói Nâng Cao": 2,
    "Gói Chuyên Nghiệp": 3,
  };

  const getButtonLabel = (planName) => {
    if (!currentPlan) return "Đăng ký ngay";

    const currentRank = planRank[currentPlan] || 0;
    const planRankValue = planRank[planName] || 0;

    if (planName === currentPlan) return "✅ Đang sử dụng";
    if (planRankValue > currentRank) return "⬆️ Nâng cấp";
    if (planRankValue < currentRank) return "⛔ Không khả dụng";

    return "Đăng ký ngay";
  };

  const getButtonDisabled = (planName) => {
    if (!currentPlan) return false;

    const currentRank = planRank[currentPlan] || 0;
    const planRankValue = planRank[planName] || 0;

    if (planName === currentPlan) return true;
    if (planRankValue < currentRank) return true; // không thể hạ cấp
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-indigo-600 mb-4 text-center">
        💼 Gói Dịch Vụ Tuyển Dụng
      </h1>

      {/* 👉 Hiển thị gói hiện tại */}
      <div className="mb-10 w-full max-w-2xl">
        {currentPlan ? (
          <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">Bạn đang sử dụng</p>
                <h2 className="text-2xl font-bold mt-1">{currentPlan}</h2>
              </div>
              <div className="bg-white text-green-600 px-4 py-2 rounded-xl font-bold shadow-md">
                ✅ Active
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none animate-pulse"></div>
          </div>
        ) : (
          <div className="bg-red-100 text-red-600 p-6 rounded-2xl shadow-md text-center font-medium">
            Bạn chưa đăng ký gói dịch vụ nào.
          </div>
        )}
      </div>

      <p className="text-gray-600 text-lg max-w-2xl text-center mb-12">
        Lựa chọn gói dịch vụ phù hợp để đăng tin, tìm ứng viên chất lượng và
        xây dựng thương hiệu tuyển dụng của doanh nghiệp bạn.
      </p>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.length > 0 ? (
          plans.map((plan, index) => {
            const isCurrent = plan.name === currentPlan;
            const features =
              plan.description?.split(".").map((f) => f.trim()).filter((f) => f) || [];
            const buttonLabel = getButtonLabel(plan.name);
            const disabled = getButtonDisabled(plan.name);

            return (
              <div
                key={index}
                className={`relative rounded-2xl shadow-xl p-8 bg-white transition transform hover:scale-105 ${
                  isCurrent
                    ? "border-4 border-green-500 shadow-green-300/50"
                    : "border border-gray-200"
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-4 right-4 bg-green-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                    ✅ Đang sử dụng
                  </span>
                )}

                <h2 className="text-2xl font-bold text-indigo-600 mb-2">
                  {plan.name}
                </h2>
                <p className="text-xl font-semibold text-gray-800 mb-6">
                  💰 {plan.price.toLocaleString("vi-VN")}đ / {plan.durationDays} ngày
                </p>

                <ul className="space-y-3 mb-6">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✔</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={disabled}
                  onClick={() =>
                    !disabled &&
                    navigate("/recruiter/register-service", { state: { plan } })
                  }
                  className={`w-full py-3 rounded-xl font-semibold transition transform hover:scale-105 ${
                    isCurrent
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : disabled
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                  }`}
                >
                  {buttonLabel}
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center w-full">
            Không có gói dịch vụ nào khả dụng.
          </p>
        )}
      </div>
    </div>
  );
};

export default ServicePlans;
