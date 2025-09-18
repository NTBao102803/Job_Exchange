import React from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  CalendarDays,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const JobPreviewModal = ({ job, onClose }) => {
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
              {displayValue(job.company)}
            </p>

            {/* Thông tin nhanh */}
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                {displayValue(job.location)}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                {displayValue(job.type)}
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

              {/* Quyền lợi */}
              <div>
                <h2 className="text-xl font-semibold text-indigo-600">
                  🎁 Quyền lợi
                </h2>
                <p className="mt-2 whitespace-pre-line">
                  {displayValue(job.benefits)}
                </p>
              </div>

              {/* Liên hệ */}
              <div>
                <h2 className="text-xl font-semibold text-indigo-600">
                  📞 Thông tin liên hệ
                </h2>
                <p className="mt-2 whitespace-pre-line">
                  Người liên hệ:{" "}
                  <span className="font-medium">
                    {displayValue(job.contactName)}
                  </span>
                </p>
                <p className="whitespace-pre-line">
                  Email:{" "}
                  <span className="font-medium">
                    {displayValue(job.contactEmail)}
                  </span>
                </p>
                <p className="whitespace-pre-line">
                  SĐT:{" "}
                  <span className="font-medium">
                    {displayValue(job.contactPhone)}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobPreviewModal;
