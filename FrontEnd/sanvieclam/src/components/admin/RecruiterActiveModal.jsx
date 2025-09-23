import React from "react";
import { X } from "lucide-react"; // dùng icon đẹp hơn

const RecruiterActiveModal = ({ recruiter, onClose, onApprove, onReject }) => {
  if (!recruiter) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="
          bg-white rounded-2xl shadow-2xl w-[800px] max-h-[90vh] p-6 relative
          overflow-y-auto scrollbar-hide transition-transform transform scale-100
        "
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          🏢 Thông tin nhà tuyển dụng
        </h2>

        {/* Thông tin cá nhân */}
        <div className="space-y-3 border-b pb-4">
          <h3 className="text-xl font-semibold text-blue-500 flex items-center gap-2">
            👤 Người đại diện
          </h3>
          <p><span className="font-semibold">Họ tên:</span> {recruiter.fullName}</p>
          <p><span className="font-semibold">Email:</span> {recruiter.email}</p>
          <p><span className="font-semibold">Số điện thoại:</span> {recruiter.phone || "—"}</p>
          <p><span className="font-semibold">Chức vụ:</span> {recruiter.position || "—"}</p>
        </div>

        {/* Thông tin công ty */}
        <div className="space-y-3 border-b pb-4 mt-4">
          <h3 className="text-xl font-semibold text-green-600 flex items-center gap-2">
            🏢 Công ty
          </h3>
          <p><span className="font-semibold">Tên công ty:</span> {recruiter.companyName}</p>
          <p><span className="font-semibold">Địa chỉ:</span> {recruiter.companyAddress}</p>
          <p><span className="font-semibold">Quy mô:</span> {recruiter.companySize || "—"}</p>
          <p><span className="font-semibold">Lĩnh vực:</span> {recruiter.companyField}</p>
          <p><span className="font-semibold">MST:</span> {recruiter.taxCode || "—"}</p>
          <p><span className="font-semibold">Giấy phép KD:</span> {recruiter.businessLicense || "—"}</p>
          <p><span className="font-semibold">Mô tả:</span> {recruiter.companyDescription || "—"}</p>
        </div>

        {/* Thông tin bổ sung */}
        <div className="space-y-3 mt-4">
          <h3 className="text-xl font-semibold text-purple-600 flex items-center gap-2">
            🌐 Bổ sung
          </h3>
          <p><span className="font-semibold">Website:</span> {recruiter.companyWebsite || "—"}</p>
          <p><span className="font-semibold">Mạng xã hội:</span> {recruiter.companySocial || "—"}</p>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() =>
              onApprove({ id: recruiter.id, active: "Đang hoạt động" })
            }
            className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
          >
            ✅ Đồng ý xét duyệt
          </button>

          <button
            onClick={() =>
              onReject({ id: recruiter.id, active: "Tạm thời vô hiệu hoá" })
            }
            className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
          >
            ❌ Xét duyệt thất bại
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition"
          >
            🔙 Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterActiveModal;
