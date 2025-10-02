import React from "react";

const ServicePlans = () => {
  const plans = [
    {
      name: "Gói Cơ Bản",
      price: "499.000đ / tháng",
      highlight: false,
      features: [
        "Đăng tối đa 3 tin tuyển  / tháng",
        "Gợi ý ứng viên thông minh - xem thông tin cơ bản",
        "Hỗ trợ qua email",
        "Hiển thị tin trong 7 ngày",
      ],
      buttonText: "Đăng ký ngay",
    },
    {
      name: "Gói Nâng Cao",
      price: "1.499.000đ / tháng",
      highlight: true,
      features: [
        "Đăng 15 tin tuyển dụng / tháng",
        "Gợi ý ứng viên thông minh - xem thông tin đầy đủ",
        "Hỗ trợ 24/7",
        "Thời gian hiển thị tin: 30 ngày",
      ],
      buttonText: "Nâng cấp ngay",
    },
    {
      name: "Gói Chuyên Nghiệp",
      price: "Liên hệ",
      highlight: false,
      features: [
        "Không giới hạn số tin tuyển dụng",
        "Gợi ý ứng viên thông minh - xem thông tin đầy đủ",
        "Chăm sóc khách hàng riêng",
        "Thời gian hiển thị tin: 60 ngày",
      ],
      buttonText: "Liên hệ tư vấn",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-indigo-600 mb-4 text-center">
        💼 Gói Dịch Vụ Tuyển Dụng
      </h1>
      <p className="text-gray-600 text-lg max-w-2xl text-center mb-12">
        Lựa chọn gói dịch vụ phù hợp để đăng tin, tìm ứng viên chất lượng và xây dựng thương hiệu tuyển dụng của doanh nghiệp bạn.
      </p>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl shadow-xl p-8 bg-white transition transform hover:scale-105 ${
              plan.highlight
                ? "border-4 border-indigo-500 shadow-indigo-300/50"
                : "border border-gray-200"
            }`}
          >
            {/* Badge nổi bật */}
            {plan.highlight && (
              <span className="absolute -top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                🔥 Phổ biến nhất
              </span>
            )}

            {/* Tên & Giá */}
            <h2 className="text-2xl font-bold text-indigo-600 mb-2">
              {plan.name}
            </h2>
            <p className="text-xl font-semibold text-gray-800 mb-6">
              {plan.price}
            </p>

            {/* Tính năng */}
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✔</span> {feature}
                </li>
              ))}
            </ul>

            {/* Nút hành động */}
            <button
              className={`w-full py-3 rounded-xl font-semibold transition transform hover:scale-105 ${
                plan.highlight
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
                  : "bg-gray-100 text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePlans;
