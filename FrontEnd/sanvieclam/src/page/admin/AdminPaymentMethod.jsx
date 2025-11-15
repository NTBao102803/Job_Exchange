import React from "react";
import { CreditCard, Info, Smartphone, DollarSign } from "lucide-react";

const paymentMethodsDemo = [
  {
    id: 1,
    name: "Momo",
    type: "Ví điện tử",
    logoUrl: "/MoMo_Logo.png",
    description: "Thanh toán nhanh qua ví Momo.",
    intro: "Momo là ví điện tử phổ biến tại Việt Nam, hỗ trợ chuyển tiền, nạp tiền và thanh toán mọi dịch vụ.",
    fee: "0 VND",
    status: "Đang hoạt động",
    methods: ["QR Code", "Chuyển tiền trực tiếp qua app Momo"],
    theme: "from-pink-500 to-red-500",
  },
  {
    id: 2,
    name: "Visa",
    type: "Thẻ quốc tế",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
    description: "Thanh toán bằng thẻ Visa/MasterCard.",
    intro: "Visa là thẻ quốc tế được chấp nhận ở hầu hết các giao dịch online và offline trên toàn thế giới.",
    fee: "1% trên tổng đơn hàng",
    status: "Đang hoạt động",
    methods: ["Nhập số thẻ", "3D Secure OTP"],
    theme: "from-blue-500 to-indigo-500",
  },
];

const AdminPaymentMethod = () => {
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="flex items-center gap-3 text-3xl font-extrabold mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
        <CreditCard className="w-9 h-9 text-purple-600 drop-shadow-sm" />
        Quản lý phương thức thanh toán (Demo)
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {paymentMethodsDemo.map((method) => (
          <div
            key={method.id}
            className={`flex-1 bg-gradient-to-br ${method.theme} rounded-3xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-300 flex flex-col`}
            style={{ maxHeight: "600px" }}
          >
            {/* Header: Logo + Name */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={method.logoUrl}
                alt={method.name}
                className="w-20 h-20 object-contain rounded-lg border border-white shadow-lg bg-white p-2"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">{method.name}</h2>
                <p className="text-white/80 text-sm">{method.type}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-white mb-2 flex items-center gap-2">
                <Info size={16} /> {method.description}
              </p>
              <p className="text-white/80 text-sm">{method.intro}</p>
            </div>

            {/* Fee */}
            <p className="text-white mb-2 flex items-center gap-2">
              <DollarSign size={16} />
              <span className="font-semibold">Phí:</span> {method.fee}
            </p>

            {/* Status */}
            <p className="text-white mb-4 flex items-center gap-2">
              <span className="font-semibold">Trạng thái:</span>{" "}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  method.status === "Đang hoạt động"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {method.status}
              </span>
            </p>

            {/* Cách thanh toán */}
            <div className="mb-4">
              <p className="font-semibold text-white mb-2">Cách thanh toán:</p>
              <ul className="list-disc list-inside text-white text-sm">
                {method.methods.map((m, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Smartphone size={14} /> {m}
                  </li>
                ))}
              </ul>
            </div>

            {/* Button thanh toán demo */}
            <button className="mt-auto w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-xl font-semibold transition">
              Thanh toán demo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPaymentMethod;
