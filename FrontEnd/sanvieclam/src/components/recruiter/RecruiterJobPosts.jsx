import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobPreviewModal from "./JobPreviewModal";
import UpdateJobModal from "./UpdateJobModal";

const RecruiterJobPosts = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showPreview, setShowPreview] = useState(false);   // ✅ thêm state cho modal
  const [jobData, setJobData] = useState(null);           // ✅ lưu job đang chọn
  const jobsPerPage = 3;
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // 👉 Giả lập dữ liệu tin đăng
  const jobPosts = [
    {
      id: 1,
      title: "Tuyển Lập trình viên Backend (Java, Spring Boot)",
      company: "Công ty ABC",
      location: "Hà Nội",
      type: "Fulltime",
      salary: "15 - 20 triệu",
      status: "pending",
    },
    {
      id: 2,
      title: "Tuyển Thực tập sinh Frontend ReactJS",
      company: "Công ty ABC",
      location: "Đà Nẵng",
      type: "Parttime",
      salary: "Hỗ trợ 3 triệu",
      status: "approved",
    },
    {
      id: 3,
      title: "Tuyển Data Engineer",
      company: "Công ty ABC",
      location: "TP. HCM",
      type: "Fulltime",
      salary: "20 - 25 triệu",
      status: "rejected",
    },
    {
      id: 4,
      title: "Tuyển Chuyên viên Marketing",
      company: "Công ty ABC",
      location: "Hà Nội",
      type: "Fulltime",
      salary: "12 - 18 triệu",
      status: "approved",
    },
  ];

  // 👉 Map trạng thái ra style + text
  const statusMap = {
    pending: { text: "⏳ Đang chờ kiểm duyệt", className: "bg-yellow-100 text-yellow-700" },
    approved: { text: "✅ Kiểm duyệt thành công", className: "bg-green-100 text-green-700" },
    rejected: { text: "❌ Kiểm duyệt thất bại", className: "bg-red-100 text-red-700" },
  };

  // 👉 Lọc theo trạng thái
  const filteredJobs =
    filterStatus === "all"
      ? jobPosts
      : jobPosts.filter((job) => job.status === filterStatus);

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
          📌 Quản lý tin tuyển dụng của bạn
        </h1>

        {/* Bộ lọc trạng thái */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Đang chờ kiểm duyệt" },
            { key: "approved", label: "Kiểm duyệt thành công" },
            { key: "rejected", label: "Kiểm duyệt thất bại" },
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

        {/* Danh sách tin đăng */}
        <div className="space-y-4 flex-grow">
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-indigo-200 shadow-md p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-xl hover:scale-[1.01] transition transform"
              >
                {/* Thông tin tin tuyển dụng */}
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold text-indigo-700 cursor-pointer"
                    onClick={() =>
                      navigate(`/candidate/jobs/${job.id}`, { state: { job } })
                    }
                  >
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
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
                      statusMap[job.status].className
                    }`}
                  >
                    {statusMap[job.status].text}
                  </span>
                  <div className="flex gap-2">
                    {/* Luôn có nút Xem chi tiết */}
                    <button
                      onClick={() => {
                          setJobData(job);       // ✅ lưu job hiện tại
                          setShowPreview(true);  // ✅ bật modal
                        }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-sm shadow-md hover:from-indigo-600 hover:to-purple-600 transition"
                    >
                      Xem chi tiết
                    </button>

                    {/* 👉 Nếu job.pending thì hiện nút Chỉnh sửa */}
                    {job.status === "pending" && (
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowUpdateModal(true);
                        }}
                        className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm shadow hover:bg-gray-200 transition"
                      >
                        Chỉnh sửa
                      </button>
                    )}

                    {/* 👉 Nếu job.approved thì hiện nút Xem ứng viên (bật modal) */}
                    {job.status === "approved" && (
                      <button
                        onClick={() =>
                            navigate("/recruiter/dashboard-candidateshaveapplied", { state: { job } })
                          } 
                        className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm shadow hover:bg-blue-200 transition"
                      >
                        Xem ứng viên
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 italic">
              Không có tin tuyển dụng nào với trạng thái này.
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

      {/* Modal xem chi tiết  */}
{showPreview && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 relative overflow-y-scroll max-h-[90vh] scrollbar-hide">

      <button
        onClick={() => setShowPreview(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
      >
        ✖
      </button>
      <JobPreviewModal job={jobData}  onClose={() => setShowPreview(false)} />
    </div>
  </div>
)}

      {/* Modal chỉnh sửa tin tuyển dụng */}
{showUpdateModal && selectedJob && (
  <UpdateJobModal
    job={selectedJob}
    onClose={() => setShowUpdateModal(false)}
    onUpdate={(updatedJob) => {
      console.log("Tin sau khi cập nhật:", updatedJob);
      // TODO: gọi API cập nhật database
    }}
  />
)}
      

    </div>
  );
};

export default RecruiterJobPosts;
