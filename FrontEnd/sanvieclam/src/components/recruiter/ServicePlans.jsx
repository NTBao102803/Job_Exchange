import React from "react";
import { useNavigate } from "react-router-dom";

const ServicePlans = () => {
  const navigate = useNavigate();
  const currentPlan = ""; // mock gói hiện tại

  const plans = [
    {
      name: "Gói Cơ Bản",
      price: "499.000đ / tháng",
      features: [
        "Đăng tối đa 3 tin tuyển / tháng",
        "Gợi ý ứng viên thông minh - xem thông tin cơ bản",
        "Hỗ trợ qua email",
        "Hiển thị tin trong 7 ngày",
      ],
      buttonText: "Đăng ký ngay",
    },
    {
      name: "Gói Nâng Cao",
      price: "1.499.000đ / tháng",
      features: [
        "Đăng 15 tin tuyển dụng / tháng",
        "Gợi ý ứng viên thông minh - xem thông tin đầy đủ",
        "Hỗ trợ 24/7",
        "Thời gian hiển thị tin: 30 ngày",
      ],
      buttonText: "Đăng ký ngay",
    },
    {
      name: "Gói Chuyên Nghiệp",
      price: "2.499.000đ / tháng",
      features: [
        "Không giới hạn số tin tuyển dụng",
        "Gợi ý ứng viên thông minh - xem thông tin đầy đủ",
        "Chăm sóc khách hàng riêng",
        "Thời gian hiển thị tin: 60 ngày",
      ],
      buttonText: "Đăng ký ngay",
    },
  ];

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
        {plans.map((plan, index) => {
          const isCurrent = plan.name === currentPlan;

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
                {plan.price}
              </p>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✔</span> {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled={isCurrent}
                onClick={() =>
                  navigate("/recruiter/register-service", {
                    state: { plan }, // 👉 Truyền dữ liệu sang
                  })
                }
                className={`w-full py-3 rounded-xl font-semibold transition transform hover:scale-105 ${
                  isCurrent
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                }`}
              >
                {isCurrent ? "Đang sử dụng" : plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicePlans;
