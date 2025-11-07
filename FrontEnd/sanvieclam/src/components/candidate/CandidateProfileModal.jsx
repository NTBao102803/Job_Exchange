import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, AlertTriangle, Loader2 } from "lucide-react";

const InfoField = ({ label, value }) => {
  if (!value) {
    return (
      <div>
        <label className="block text-gray-700 font-semibold mb-1">{label}</label>
        <div className="w-full p-3 border rounded-lg bg-gray-50 shadow-sm text-gray-800">
          —
        </div>
      </div>
    );
  }

  // Nếu value là mảng
  if (Array.isArray(value)) {
    return (
      <div>
        <label className="block text-gray-700 font-semibold mb-1">{label}</label>
        <div className="w-full p-3 border rounded-lg bg-gray-50 shadow-sm text-gray-800 flex flex-col gap-1">
          {value.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      </div>
    );
  }

  // Nếu value là string có dấu xuống dòng \n => tách xuống dòng
  const lines = value.split("\n");

  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-1">{label}</label>
      <div className="w-full p-3 border rounded-lg bg-gray-50 shadow-sm text-gray-800 flex flex-col gap-1">
        {lines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
};

const CandidateProfileModal = ({ isOpen, onClose, candidate }) => {
  const [currentPlan, setCurrentPlan] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        if (!user) return;
        const res = await axios.get(
          `http://localhost:8080/api/payment-plans/current/${user.id}`
        );
        setCurrentPlan(res.data?.planName || "");
      } catch (err) {
        console.error("Lỗi khi lấy gói dịch vụ:", err);
        setCurrentPlan("");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }
  if ((!currentPlan || currentPlan === "Gói Cơ Bản")&&(user?.role?.id==3)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
        <div className=" relative bg-white p-10 rounded-2xl shadow-2xl max-w-lg text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            <X size={24} />
          </button>
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Gói dịch vụ của bạn không đủ quyền!
          </h2>
          <p className="text-gray-600 mb-4">
            Vui lòng <b>nâng cấp lên Gói Nâng Cao hoặc Chuyên Nghiệp</b> để xem hồ sơ ứng viên chi tiết.
          </p>
          <button
            onClick={() => {
              onClose();
              window.location.href = "/recruiter/serviceplans";
            }}
            className="mt-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition"
          >
            Nâng cấp ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl p-8 sm:p-10 overflow-y-auto scrollbar-none">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X size={24} />
        </button>

        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          📄 Hồ sơ ứng viên
        </h1>

        {/* Thông tin cá nhân */}
        <div className="space-y-4 border-b pb-6">
          <h2 className="text-2xl font-bold text-indigo-500">👤 Thông tin cá nhân</h2>
          <InfoField label="Họ và tên" value={candidate.fullName} />
          <InfoField label="Ngày sinh" value={candidate.dob} />
          <InfoField label="Giới tính" value={candidate.gender} />
          <InfoField label="Email" value={candidate.email} />
          <InfoField label="Số điện thoại" value={candidate.phone} />
          <InfoField label="Địa chỉ" value={candidate.address} />
        </div>

        {/* Thông tin học vấn */}
        <div className="space-y-4 border-b pb-6 mt-6">
          <h2 className="text-2xl font-bold text-green-600">🎓 Thông tin học vấn</h2>
          <InfoField label="Trường học" value={candidate.school} />
          <InfoField label="Chuyên ngành" value={candidate.major} />
          <InfoField label="GPA" value={candidate.gpa} />
          <InfoField label="Năm tốt nghiệp" value={candidate.graduationYear} />
        </div>

        {/* Kinh nghiệm & Dự án */}
        <div className="space-y-4 border-b pb-6 mt-6">
          <h2 className="text-2xl font-bold text-yellow-600">💼 Kinh nghiệm & Dự án</h2>
          <InfoField label="Kinh nghiệm" value={candidate.experience} />
          <InfoField label="Dự án" value={candidate.projects} />
        </div>

        {/* Kỹ năng & Chứng chỉ */}
        <div className="space-y-4 border-b pb-6 mt-6">
          <h2 className="text-2xl font-bold text-purple-600">🛠️ Kỹ năng & Chứng chỉ</h2>
          <InfoField label="Kỹ năng" value={candidate.skills} />
          <InfoField label="Chứng chỉ" value={candidate.certificates} />
        </div>

        {/* Thông tin bổ sung */}
        <div className="space-y-4 mt-6">
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
