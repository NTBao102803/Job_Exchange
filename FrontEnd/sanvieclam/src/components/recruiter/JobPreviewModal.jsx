import React, { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  CalendarDays,
  X,
  User,
  Mail,
  Phone,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // ✅ Gọi API lấy thông tin employer khi mở modal
  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        setLoading(true);
        const res = await getEmployerProfile();
        setEmployer(res);
      } catch (err) {
        console.error("❌ Lỗi lấy employer profile:", err);
        setError("Không thể tải thông tin công ty");
      } finally {
        setLoading(false);
      }
    };

    if (job) {
      fetchEmployer();
    }
  }, [job]);

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
                {job.requirements ? (
                  <p className="mt-2 whitespace-pre-line">
                    {displayValue(job.requirements.descriptionRequirements)}
                  </p>
                ) : (
                  <p className="mt-2 text-gray-500 italic">
                    Chưa có thông tin yêu cầu
                  </p>
                )}
              </div>

              {/* ✅ Yêu cầu bắt buộc  */}
              {(() => {
                const skills =
                  job.requirements?.skills
                    ?.map((s) => s?.trim())
                    ?.filter((s) => s && s.length > 0) || [];

                const hasSkills = skills.length > 0;
                const hasExperience = !!job.requirements?.experience;
                const hasCertificates = !!job.requirements?.certificates;

                if (!hasSkills && !hasExperience && !hasCertificates)
                  return null;

                return (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-red-600 ml-4">
                      ⚠️ Yêu cầu bắt buộc
                    </h2>
                    <div className="mt-2 ml-6 space-y-2 text-gray-700">
                      {hasSkills && (
                        <p>
                          <span className="font-medium">Kỹ năng: </span>
                          {skills.join(", ")}
                        </p>
                      )}
                      {hasExperience && (
                        <p>
                          <span className="font-medium">Kinh nghiệm: </span>
                          {displayValue(job.requirements.experience)}
                        </p>
                      )}
                      {hasCertificates && (
                        <p>
                          <span className="font-medium">
                            Trình độ học vấn:{" "}
                          </span>
                          {displayValue(job.requirements.certificates)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}

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
              <div className="mt-10 border-t pt-6 ">
                <h2 className="text-xl font-semibold text-indigo-600">
                  📞 Thông tin liên hệ
                </h2>
                {employer ? (
                  <>
                    <div className="mt-4 space-y-3 text-gray-700">
                      <p className="flex items-center gap-2">
                        <User className="w-5 h-5 text-pink-500" />
                        Người liên hệ:
                        {displayValue(employer.fullName)}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-pink-500" />
                        Email:
                        {displayValue(employer.email)}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-green-500" />
                        SĐT:
                        {displayValue(employer.phone)}
                      </p>
                    </div>
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
