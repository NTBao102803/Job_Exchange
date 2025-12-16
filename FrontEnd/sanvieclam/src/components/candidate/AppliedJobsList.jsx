import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {getApplicationsByCandidate} from "../../api/ApplicationApi";
import {getCandidateProfile} from "../../api/CandidateApi";
import {getJobById, getEmployerById} from "../../api/JobApi";

const AppliedJobsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const jobsPerPage = 3;
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewForm] = useState({
  fullName: "Nguyễn Văn A",
  phone: "0909 123 456",
  date: "20/01/2025",
  time: "14:00",
  location: "Văn phòng công ty",
});

  // Map trạng thái từ backend ra UI
  const statusMap = {
    PENDING: {
      text: "Đã ứng tuyển",
      className: "bg-green-100 text-green-700",
    },
    REJECTED: {
      text: "Hồ sơ chưa phù hợp",
      className: "bg-red-100 text-red-700",
    },
    APPROVED: {
      text: "Hồ sơ đã phù hợp",
      className: "bg-blue-100 text-blue-700",
    },
  };

  // 🔥 Lấy danh sách jobs ứng tuyển của ứng viên
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Lấy hồ sơ ứng viên
        const candidate = await getCandidateProfile();

        // 2. Lấy danh sách ứng tuyển của ứng viên
        const applications = await getApplicationsByCandidate(candidate.id);
        // 3. Với mỗi application, lấy thông tin job
        const jobsWithDetails = await Promise.all(
          applications.map(async (app) => {
            const job = await getJobById(app.jobId);
            const employer = await getEmployerById(job.employerId);
            return {
                    ...job, // ✅ giữ toàn bộ thông tin job gốc
                    companyName: employer.companyName,
                    status: app.status,
                    applicationId: app.id,
                    cvUrl: app.cvUrl, 
                  };
          })
        );

        setAppliedJobs(jobsWithDetails);
      } catch (err) {
        console.error("❌ Lỗi khi load applied jobs:", err);
      }
    };

    fetchData();
  }, []);
console.log(appliedJobs);
  // 👉 Lọc theo trạng thái
  const filteredJobs =
    filterStatus === "all"
      ? appliedJobs
      : appliedJobs.filter((job) => job.status === filterStatus);

  // 👉 Tính toán phân trang
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (page - 1) * jobsPerPage;
  const endIndex = Math.min(startIndex + jobsPerPage, filteredJobs.length);
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-32 pb-32 px-6 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-grow space-y-6">
        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">
          📌 Việc làm bạn đã ứng tuyển
        </h1>

        {/* Bộ lọc trạng thái */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: "all", label: "Tất cả" },
            { key: "PENDING", label: "Đã ứng tuyển" },
            { key: "REJECTED", label: "Hồ sơ chưa phù hợp" },
            { key: "APPROVED", label: "Hồ sơ đã phù hợp" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilterStatus(f.key);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm transition ${
                filterStatus === f.key
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Danh sách công việc */}
        <div className="space-y-4 flex-grow">
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-indigo-200 shadow-md p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-xl hover:scale-[1.01] transition transform"
              >
                {/* Thông tin job */}
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold text-indigo-700 cursor-pointer"
                    onClick={() =>
                      navigate(`/candidate/jobs/${job.id}`, { state: { job } })
                    }
                  >
                    {job.title}
                  </h3>
                  <p
                    className="text-sm text-gray-600 font-medium cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(`/candidate/dashboard-recruiterpageview`, { state: { recruiterId: job.employerId } })
                    }
                  >
                    {job.companyName}
                  </p>
                  <p className="text-sm text-gray-600">
                    📍 {job.location} | ⏰ {job.type}
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    💰 {job.salary}
                  </p>
                </div>

                {/* Hành động + trạng thái */}
                <div className="flex flex-col items-start sm:items-end gap-2 mt-3 sm:mt-0">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium shadow-sm ${
                      statusMap[job.status]?.className || "bg-gray-200"
                    }`}
                  >
                    {statusMap[job.status]?.text || job.status}
                    {job.status === "APPROVED" && (
                      <>
                        <span className="text-gray-400"> | </span>
                        <span
                          className="text-green-700 underline cursor-pointer hover:text-green-800"
                          onClick={() => {
                            setIsInterviewModalOpen(true);
                          }}
                        >
                          Lịch phỏng vấn
                        </span>
                      </>
                    )}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/candidate/jobs/${job.id}`, { state: { job } })
                      }
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-sm shadow-md hover:from-indigo-600 hover:to-purple-600 transition"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => window.open(job.cvUrl, "_blank")}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm shadow hover:bg-gray-200 transition"
                    >
                      Xem CV của bạn
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 italic">
              Không có công việc nào với trạng thái này.
            </p>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full bg-white border-t border-gray-200 py-3 mt-6 shadow-inner sticky bottom-0">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded-lg ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Trước
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  page === i + 1
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-lg ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Sau
            </button>
          </div>
        </div>
      )}
      {isInterviewModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-[420px]">
      <h3 className="text-2xl font-bold text-indigo-600 mb-5 text-center">
        📅 Lịch phỏng vấn
      </h3>

      <div className="space-y-4 text-gray-700">
        <div>
          <p className="text-sm text-gray-500">Họ và tên</p>
          <p className="font-semibold">
            {interviewForm.fullName || "Chưa cập nhật"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Số điện thoại</p>
          <p className="font-semibold">
            {interviewForm.phone || "Chưa cập nhật"}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <p className="text-sm text-gray-500">Ngày phỏng vấn</p>
            <p className="font-semibold">
              {interviewForm.date || "Chưa cập nhật"}
            </p>
          </div>

          <div className="w-1/2">
            <p className="text-sm text-gray-500">Thời gian</p>
            <p className="font-semibold">
              {interviewForm.time || "Chưa cập nhật"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Địa điểm</p>
          <p className="font-semibold">
            {interviewForm.location || "Chưa cập nhật"}
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => setIsInterviewModalOpen(false)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AppliedJobsList;