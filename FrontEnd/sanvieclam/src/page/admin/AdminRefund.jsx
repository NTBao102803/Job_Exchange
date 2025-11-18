import React from "react";
import { CreditCard, AlertTriangle, Info } from "lucide-react";

const AdminRefund = () => {
  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 flex flex-col items-center justify-center">
      <h1 className="flex items-center gap-3 text-3xl font-extrabold mb-8 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
        <CreditCard className="w-9 h-9 text-yellow-600 drop-shadow-sm" />
        Hoàn tiền (Demo)
      </h1>

      <div className="relative w-full max-w-lg bg-gradient-to-r from-yellow-100 via-yellow-50 to-white rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
        {/* Icon cảnh báo */}
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4 drop-shadow-lg" />

        {/* Tiêu đề chính */}
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Chức năng hoàn tiền chưa được hỗ trợ
        </h2>

        {/* Mô tả chi tiết */}
        <p className="text-gray-700 mb-4">
          Hiện tại hệ thống chỉ là bản demo thanh toán. Bạn chưa thể thực hiện
          hoàn tiền. Tuy nhiên, bạn vẫn có thể xem thông tin chi tiết về các
          giao dịch đã thanh toán và phương thức thanh toán.
        </p>

        {/* Thông tin thú vị / chi tiết */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 w-full text-left shadow-inner">
          <p className="flex items-center gap-2 text-gray-800">
            <Info size={16} /> <span className="font-semibold">Gợi ý:</span> Trong tương lai, bạn sẽ có thể hoàn tiền trực tiếp từ đây.
          </p>
          <p className="flex items-center gap-2 text-gray-800 mt-2">
            <Info size={16} /> <span className="font-semibold">Mẹo bảo mật:</span> Chỉ hoàn tiền cho giao dịch chính chủ và kiểm tra phương thức thanh toán.
          </p>
        </div>

        {/* Button demo */}
        <button
          onClick={() => alert("⚠️ Hệ thống chưa hỗ trợ hoàn tiền!")}
          className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg transition"
        >
          Thử hoàn tiền
        </button>

        {/* Footer */}
        <p className="text-gray-400 text-xs mt-4">
          Đây là bản demo, mọi thao tác hoàn tiền thực tế sẽ không được thực hiện.
        </p>
      </div>
    </div>
  );
};

export default AdminRefund;
