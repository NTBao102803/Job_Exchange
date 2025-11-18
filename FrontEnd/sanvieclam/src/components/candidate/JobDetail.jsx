import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  ArrowLeft,
  CalendarDays,
  User,
  Mail,
  Phone,
  X,MessageCircle
} from "lucide-react";
import { getEmployerById } from "../../api/JobApi";
import { applyJob } from "../../api/ApplicationApi";

import { createConversation } from "../../api/messageApi";

const JobDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(state?.job || null);
  const [employer, setEmployer] = useState(null);

  // State cho modal
  const [showModal, setShowModal] = useState(false);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    if (!job) {
      // fetch(`/api/jobs/${id}`).then(res => res.json()).then(setJob);
    }
  }, [id, job]);

  // 🔥 Lấy employer theo employerId trong job
  useEffect(() => {
    if (job?.employerId) {
      const fetchEmployer = async () => {
        try {
          const data = await getEmployerById(job.employerId);
          setEmployer(data);
        } catch (err) {
          console.error("❌ Lỗi khi lấy employer:", err);
        }
      };
      fetchEmployer();
    }
  }, [job]);

  if (!job) {
    return (
      <div className="pt-32 text-center">
        <p className="text-gray-600">Không tìm thấy thông tin công việc.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg"
        >
          Quay lại
        </button>
      </div>
    );
  }

  // Helper hiển thị fallback
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

  const startDate = formatDate(job.startDate);
  const endDate = formatDate(job.endDate);

  // Xử lý nộp CV
  const handleApply = async () => {
    if (!cvFile) {
      alert("⚠️ Vui lòng chọn file CV trước khi ứng tuyển!");
      return;
    }

    try {
      await applyJob(job.id, cvFile);
      setShowModal(false);
      alert("✅ Ứng tuyển thành công! Chúng tôi sẽ liên hệ bạn sớm.");
    } catch (err) {
      console.error("❌ Lỗi khi ứng tuyển:", err.message);
      alert("❌ " + err.message);
    }
  };
  const handleMessage = async () => {
    try {
      const conversation = await createConversation(job.id);

      navigate("/candidate/dashboard-candidatemessenger", {
        state: {
          conversationId: conversation.id,
          employerId: job.employerId,
        },
      });
    } catch (err) {
      console.error("❌ Lỗi tạo cuộc hội thoại:", err);
      alert("Không thể tạo cuộc hội thoại");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-10 border border-gray-200">
          {/* Header */}
          <h1 className="text-3xl font-bold text-indigo-700">
            {displayValue(job.title)}
          </h1>
          <p className="text-lg text-gray-600 mt-1 flex items-center gap-2 cursor-pointer hover:underline"
              onClick={() =>
                      navigate(`/candidate/dashboard-recruiterpageview`, { state: { recruiterId: job.employerId } })
                    }>
            <Building2 className="w-5 h-5 text-indigo-500" />
            {displayValue(job.companyName)}
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
                <span className="font-medium">Bắt đầu:</span> {startDate}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-orange-500" />
              <span>
                <span className="font-medium">Kết thúc:</span> {endDate}
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
              <p className="mt-2">{displayValue(job.description)}</p>
            </div>

            {/* Yêu cầu */}
            <div>
              <h2 className="text-xl font-semibold text-indigo-600">
                ✅ Yêu cầu ứng viên
              </h2>
              <p className="mt-2">
                {displayValue(job.requirements.descriptionRequirements)}
              </p>
            </div>
            {/* Yêu cầu bắt buộc */}
            {(job.requirements.skills ||
              job.requirements.experience ||
              job.requirements.certificates) && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-red-600 ml-4">
                  ⚠️ Yêu cầu bắt buộc
                </h2>
                <div className="mt-2 ml-6 space-y-2 text-gray-700">
                  {job.requirements.skills && (
                    <p>
                      <span className="font-medium">Kỹ năng: </span>
                      {displayValue(job.requirements.skills)}
                    </p>
                  )}
                  {job.requirements.experience && (
                    <p>
                      <span className="font-medium">Kinh nghiệm: </span>
                      {displayValue(job.requirements.experience)}
                    </p>
                  )}
                  {job.requirements.certificates && (
                    <p>
                      <span className="font-medium">Trình độ học vấn: </span>
                      {displayValue(job.requirements.certificates)}
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
              <p className="mt-2">{displayValue(job.benefits)}</p>
            </div>
          </div>
          {/* Liên hệ */}
          <div className="mt-10 border-t pt-6 ">
            <h2 className="text-xl font-semibold text-indigo-600">
              📞 Thông tin liên hệ
            </h2>
            <div className="mt-4 space-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <User className="w-5 h-5 text-pink-500" />
                Người liên hệ:
                {displayValue(employer?.fullName)}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-pink-500" />
                Email:
                {displayValue(employer?.email)}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-500" />
                SĐT:
                {displayValue(employer?.phone)}
              </p>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="mt-10 flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 flex items-center gap-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={handleMessage}
                className="flex x-6 py-3 items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-md transition"
              >
                <MessageCircle size={18} />
                Nhắn tin
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow hover:from-indigo-600 hover:to-purple-600 transition font-medium"
              >
                Ứng tuyển ngay
              </button>
            </div>

          </div>
        </div>
      </div>
      {/* Modal Upload CV */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-indigo-600 mb-4">
              📄 Nộp CV ứng tuyển
            </h2>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files[0])}
              className="block w-full border p-2 rounded-md mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleApply}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Ứng tuyển
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;