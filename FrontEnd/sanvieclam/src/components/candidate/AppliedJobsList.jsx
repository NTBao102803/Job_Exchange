import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AppliedJobsList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all"); // 👉 trạng thái lọc
  const jobsPerPage = 3;

  // 👉 Giả lập dữ liệu các job đã ứng tuyển + trạng thái
  const appliedJobs = [
    {
      id: 1,
      title: "Lập trình viên Backend (Java, Spring Boot)",
      company: "Công ty ABC",
      location: "Hà Nội",
      type: "Fulltime",
      salary: "15 - 20 triệu",
      status: "applied", // đã ứng tuyển
    },
    {
      id: 2,
      title: "Thực tập sinh Frontend ReactJS",
      company: "Startup EFG",
      location: "Đà Nẵng",
      type: "Parttime",
      salary: "Hỗ trợ 3 triệu",
      status: "not-suitable", // hồ sơ chưa phù hợp
    },
    {
      id: 3,
      title: "Data Engineer",
      company: "Tập đoàn DataTech",
      location: "TP. HCM",
      type: "Fulltime",
      salary: "20 - 25 triệu",
      status: "suitable", // hồ sơ đã phù hợp
    },
    {
      id: 4,
      title: "Chuyên viên Marketing",
      company: "Công ty Quảng Cáo KLM",
      location: "Hà Nội",
      type: "Fulltime",
      salary: "12 - 18 triệu",
      status: "applied",
    },
  ];

  // 👉 Map trạng thái ra style + text
  const statusMap = {
    applied: {
      text: "Đã ứng tuyển",
      className: "bg-green-100 text-green-700",
    },
    "not-suitable": {
      text: "Hồ sơ chưa phù hợp",
      className: "bg-red-100 text-red-700",
    },
    suitable: {
      text: "Hồ sơ đã phù hợp",
      className: "bg-blue-100 text-blue-700",
    },
  };

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
            { key: "applied", label: "Đã ứng tuyển" },
            { key: "not-suitable", label: "Hồ sơ chưa phù hợp" },
            { key: "suitable", label: "Hồ sơ đã phù hợp" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilterStatus(f.key);
                setPage(1); // reset về trang 1 khi đổi filter
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
                    <button
                      onClick={() =>
                        navigate(`/candidate/jobs/${job.id}`, {
                          state: { job },
                        })
                      }
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-sm shadow-md hover:from-indigo-600 hover:to-purple-600 transition"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => alert("Xem CV của bạn")}
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

      {/* Pagination luôn đứng im dưới */}
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
    </div>
  );
};

export default AppliedJobsList;
