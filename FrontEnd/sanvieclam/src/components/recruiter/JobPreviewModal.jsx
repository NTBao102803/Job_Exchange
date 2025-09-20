import React, { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  CalendarDays,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getEmployerProfile } from "../../api/RecruiterApi";

const JobPreviewModal = ({ job, onClose }) => {
  const [employer, setEmployer] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
  });
  const displayValue = (val) => (val && val !== "" ? val : "Chưa có thông tin");

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa có thông tin";
    const date = new Date(dateStr);
    if (isNaN(date)) return "Chưa có thông tin";
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  // ✅ gọi API lấy thông tin employer khi mở modal
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getEmployerProfile();
        setEmployer(res);
      } catch (err) {
        console.error("❌ Lỗi lấy employer profile:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!job) return null;

  return (
    <AnimatePresence>
      {job && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // 👉 click ra ngoài để đóng
        >
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide bg-white shadow-2xl rounded-2xl p-10 border border-gray-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()} // 👉 chặn đóng khi click bên trong
          >
            {/* ❌ Nút đóng */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={28} />
            </button>

            {/* Header */}
            <h1 className="text-3xl font-bold text-indigo-700">
              {displayValue(job.title)}
            </h1>
            <p className="text-lg text-gray-600 mt-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-500" />
              {employer ? employer.companyName : "⏳ Đang tải..."}
            </p>

            {/* Thông tin nhanh */}
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                {displayValue(job.location)}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                {displayValue(job.jobType)}
              </p>
              <p className="flex items-center gap-2 text-green-600 font-medium">
                <DollarSign className="w-5 h-5" />
                {displayValue(job.salary)}
              </p>
            </div>

            {/* Ngày tuyển dụng */}
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-purple-500" />
                <span>
                  <span className="font-medium">Bắt đầu:</span>{" "}
                  {formatDate(job.startDate)}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-orange-500" />
                <span>
                  <span className="font-medium">Kết thúc:</span>{" "}
                  {formatDate(job.endDate)}
                </span>
              </p>
            </div>

            {/* Nội dung */}
            <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
              {/* Mô tả */}
              <div>
                <h2 className="text-xl font-semibold text-indigo-600">
                  📝 Mô tả công việc
                </h2>
                <p className="mt-2 whitespace-pre-line">
                  {displayValue(job.description)}
                </p>
              </div>

              {/* Yêu cầu */}
              <div>
                <h2 className="text-xl font-semibold text-indigo-600">
                  ✅ Yêu cầu ứng viên
                </h2>
                <p className="mt-2 whitespace-pre-line">
                  {displayValue(job.requirements)}
                </p>
              </div>


                {/* Yêu cầu bắt buộc */}
              {(job.skills || job.experience || job.education) && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-red-600 ml-4">
                    ⚠️ Yêu cầu bắt buộc
                  </h2>
                  <div className="mt-2 ml-6 space-y-2 text-gray-700">
                    {job.skills && (
                      <p>
                        <span className="font-medium">Kỹ năng: </span>
                        {displayValue(job.skills)}
                      </p>
                    )}
                    {job.experience && (
                      <p>
                        <span className="font-medium">Kinh nghiệm: </span>
                        {displayValue(job.experience)}
                      </p>
                    )}
                    {job.education && (
                      <p>
                        <span className="font-medium">Trình độ học vấn: </span>
                        {displayValue(job.education)}
                      </p>
                    )}
                  </div>
                </div>
              )}



              {/* Quyền lợi */}
              <div>
                <h2 className="text-xl font-semibold text-indigo-600">
                  🎁 Quyền lợi
                </h2>
                <p className="mt-2 whitespace-pre-line">
                  {displayValue(job.benefits)}
                </p>
              </div>

              {/* ✅ Thông tin liên hệ lấy từ employer profile */}
              <div>
                <h2 className="text-xl font-semibold text-indigo-600">
                  📞 Thông tin liên hệ
                </h2>
                {employer ? (
                  <>
                    <p className="mt-2 whitespace-pre-line">
                      Người liên hệ:{" "}
                      <span className="font-medium">
                        {displayValue(employer.fullName)}
                      </span>
                    </p>
                    <p>
                      Email:{" "}
                      <span className="font-medium">
                        {displayValue(employer.email)}
                      </span>
                    </p>
                    <p>
                      SĐT:{" "}
                      <span className="font-medium">
                        {displayValue(employer.phone)}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 mt-2">
                    ⏳ Đang tải thông tin liên hệ...
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobPreviewModal;