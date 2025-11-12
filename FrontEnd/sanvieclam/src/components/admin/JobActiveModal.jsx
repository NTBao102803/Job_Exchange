import React, { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  CalendarDays,
  X,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getEmployerById } from "../../api/RecruiterApi";

const JobActiveModal = ({ job, onClose, onApprove, onReject }) => {
  const [employer, setEmployer] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!job) return null;

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

  useEffect(() => {
    const fetchEmployer = async () => {
      if (!job?.employerId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getEmployerById(job.employerId);
        setEmployer(data);
      } catch (err) {
        console.error("❌ Lỗi lấy employer:", err);
        setError("Không thể tải thông tin nhà tuyển dụng");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployer();
  }, [job?.employerId]);

  const handleRejectWithReason = () => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do thất bại!");
      return;
    }
    onReject({ id: job.id, status: "Xét duyệt thất bại", reason: rejectReason });
    setShowRejectReason(false);
  };

  return (
    <AnimatePresence>
      {job && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide bg-white shadow-2xl rounded-2xl p-10 border border-gray-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
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
              {loading
                ? "⏳ Đang tải..."
                : error
                ? error
                : displayValue(employer?.companyName)}
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

            {/* Nội dung công việc */}
            <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
              <div>
                <h2 className="text-xl font-semibold text-indigo-600">
                  📝 Mô tả công việc
                </h2>
                <p className="mt-2 whitespace-pre-line">
                  {displayValue(job.description)}
                </p>
              </div>
            </div>

            {/* Thông tin liên hệ */}
            <div className="mt-10 border-t pt-6">
              <h2 className="text-2xl font-bold text-indigo-700">
                📞 Thông tin liên hệ
              </h2>
              <div className="mt-4 space-y-3 text-gray-700">
                <p className="flex items-center gap-2">
                  <User className="w-5 h-5 text-pink-500" />
                  Người liên hệ: {displayValue(employer.fullName)}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-pink-500" />
                  Email: {displayValue(employer.email)}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-500" />
                  SĐT: {displayValue(employer.phone)}
                </p>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-center gap-4 mt-10">
              <button
                onClick={() => onApprove({ id: job.id, status: "Đã xét duyệt" })}
                className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
              >
                ✅ Đồng ý xét duyệt
              </button>

              <button
                onClick={() => setShowRejectReason(true)}
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

            {/* Modal nhập lý do thất bại */}
            <AnimatePresence>
              {showRejectReason && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowRejectReason(false)}
                >
                  <motion.div
                    className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-xl font-bold text-red-600 mb-4 text-center">
                      ❌ Lý do xét duyệt thất bại
                    </h2>
                    <textarea
                      className="w-full p-3 border rounded-lg resize-none mb-4"
                      rows={4}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Nhập lý do..."
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={handleRejectWithReason}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Gửi
                      </button>
                      <button
                        onClick={() => setShowRejectReason(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                      >
                        Hủy
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobActiveModal;
