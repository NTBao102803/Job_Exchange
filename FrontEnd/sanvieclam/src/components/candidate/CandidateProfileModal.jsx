import React from "react";
import { X } from "lucide-react";

// 👉 Input chỉ hiển thị
const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-1">{label}</label>
    <p className="w-full p-3 border rounded-lg bg-gray-50 shadow-sm text-gray-800">
      {value || "—"}
    </p>
  </div>
);

const CandidateProfileModal = ({ isOpen, onClose, candidate }) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl p-8 sm:p-10
                      overflow-y-auto scrollbar-none">
        {/* ❌ Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          📄 Hồ sơ ứng viên
        </h1>

        {/* 👤 Thông tin cá nhân */}
        <div className="space-y-4 border-b pb-6">
          <h2 className="text-2xl font-bold text-indigo-500">👤 Thông tin cá nhân</h2>
          <InfoField label="Họ và tên" value={candidate.fullName} />
          <InfoField label="Ngày sinh" value={candidate.dob} />
          <InfoField label="Giới tính" value={candidate.gender} />
          <InfoField label="Email" value={candidate.email} />
          <InfoField label="Số điện thoại" value={candidate.phone} />
          <InfoField label="Địa chỉ" value={candidate.address} />
        </div>

        {/* 🎓 Thông tin học vấn */}
        <div className="space-y-4 border-b pb-6">
          <h2 className="text-2xl font-bold text-green-600">🎓 Thông tin học vấn</h2>
          <InfoField label="Trường học" value={candidate.school} />
          <InfoField label="Chuyên ngành" value={candidate.major} />
          <InfoField label="GPA" value={candidate.gpa} />
          <InfoField label="Năm tốt nghiệp" value={candidate.graduationYear} />
        </div>

        {/* 💼 Kinh nghiệm & Dự án */}
        <div className="space-y-4 border-b pb-6">
          <h2 className="text-2xl font-bold text-yellow-600">💼 Kinh nghiệm & Dự án</h2>
          <InfoField label="Kinh nghiệm" value={candidate.experience} />
          <InfoField label="Dự án" value={candidate.projects} />
        </div>

        {/* 🛠️ Kỹ năng & Chứng chỉ */}
        <div className="space-y-4 border-b pb-6">
          <h2 className="text-2xl font-bold text-purple-600">🛠️ Kỹ năng & Chứng chỉ</h2>
          <InfoField label="Kỹ năng" value={candidate.skills} />
          <InfoField label="Chứng chỉ" value={candidate.certificates} />
        </div>

        {/* 🌐 Thông tin bổ sung */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-pink-600">🌐 Thông tin bổ sung</h2>
          <InfoField label="Mục tiêu nghề nghiệp" value={candidate.careerGoal} />
          <InfoField label="Sở thích" value={candidate.hobbies} />
          <InfoField label="Mạng xã hội / Liên kết" value={candidate.social} />
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileModal;
