import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplicationsByCandidate } from "../../api/ApplicationApi";
import { getCandidateProfile } from "../../api/CandidateApi";
import { getJobById, getEmployerById } from "../../api/JobApi";

const AppliedJobsList = () => {
  const navigate = useNavigate();

  // State quản lý danh sách và phân trang
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const jobsPerPage = 3;

  // State quản lý Modal xem lịch phỏng vấn
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedInterviewSchedule, setSelectedInterviewSchedule] =
    useState(null);

  // Cấu hình nhãn trạng thái và màu sắc tương ứng
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

  /**
   * Effect: Tải thông tin ứng viên và danh sách công việc đã ứng tuyển
   * Thực hiện map dữ liệu từ Application, Job và Employer thành một object duy nhất
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const candidate = await getCandidateProfile();
        const applications = await getApplicationsByCandidate(candidate.id);

        const jobsWithDetails = await Promise.all(
          applications.map(async (app) => {
            const job = await getJobById(app.jobId);
            const employer = await getEmployerById(job.employerId);
            return {
              ...job,
              companyName: employer.companyName,
              status: app.status,
              applicationId: app.id,
              cvUrl: app.cvUrl,
              interviewSchedule: app.interviewSchedule || null, // Lưu lịch phỏng vấn nếu có
            };
          })
        );

        setAppliedJobs(jobsWithDetails);
      } catch (err) {
        alert("Lỗi khi tải danh sách công việc đã ứng tuyển.");
      }
    };

    fetchData();
  }, []);

  /**
   * Hàm: Mở modal và gán dữ liệu lịch phỏng vấn cụ thể
   */
  const handleOpenInterviewModal = (schedule) => {
    setSelectedInterviewSchedule(schedule);
    setIsInterviewModalOpen(true);
  };

  /**
   * Hàm: Đóng modal và reset dữ liệu lịch đã chọn
   */
  const handleCloseInterviewModal = () => {
    setIsInterviewModalOpen(false);
    setSelectedInterviewSchedule(null);
  };

  // Logic lọc theo trạng thái
  const filteredJobs =
    filterStatus === "all"
      ? appliedJobs
      : appliedJobs.filter((job) => job.status === filterStatus);

  // Logic phân trang
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (page - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-32 pb-32 px-6 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-grow space-y-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">
          📌 Việc làm bạn đã ứng tuyển
        </h1>

        {/* Thanh bộ lọc trạng thái */}
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

        {/* Danh sách thẻ công việc */}
        <div className="space-y-4 flex-grow">
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-indigo-200 shadow-md p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-xl transition transform"
              >
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
                      navigate(`/candidate/dashboard-recruiterpageview`, {
                        state: { recruiterId: job.employerId },
                      })
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

                <div className="flex flex-col items-start sm:items-end gap-2 mt-3 sm:mt-0">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium shadow-sm ${
                      statusMap[job.status]?.className || "bg-gray-200"
                    }`}
                  >
                    {statusMap[job.status]?.text || job.status}
                    {job.status === "APPROVED" && job.interviewSchedule && (
                      <>
                        <span className="text-gray-400"> | </span>
                        <span
                          className="text-green-700 underline cursor-pointer hover:text-green-800"
                          onClick={() =>
                            handleOpenInterviewModal(job.interviewSchedule)
                          }
                        >
                          Lịch phỏng vấn
                        </span>
                      </>
                    )}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/candidate/jobs/${job.id}`, {
                          state: { job },
                        })
                      }
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-sm shadow-md hover:opacity-90 transition"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => window.open(job.cvUrl, "_blank")}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm shadow hover:bg-gray-200 transition"
                    >
                      Xem CV
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 italic">
              Không tìm thấy công việc phù hợp với trạng thái này.
            </p>
          )}
        </div>
      </div>

      {/* Điều hướng phân trang */}
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
      {/* Modal hiển thị lịch phỏng vấn chi tiết */}
      {isInterviewModalOpen && selectedInterviewSchedule && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[420px]">
            <h3 className="text-2xl font-bold text-indigo-600 mb-5 text-center">
              📅 Lịch phỏng vấn
            </h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Người đại diện
                </p>
                <p className="font-semibold">
                  {selectedInterviewSchedule.interviewerFullName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Số điện thoại
                </p>
                <p className="font-semibold">
                  {selectedInterviewSchedule.interviewerPhone}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <p className="text-sm text-gray-500 font-medium">Ngày</p>
                  <p className="font-semibold text-indigo-700">
                    {selectedInterviewSchedule.interviewDateTime.split(" ")[1]}
                  </p>
                </div>
                <div className="w-1/2">
                  <p className="text-sm text-gray-500 font-medium">Giờ</p>
                  <p className="font-semibold text-red-600">
                    {selectedInterviewSchedule.interviewDateTime.split(" ")[0]}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Địa điểm</p>
                <p className="font-semibold italic">
                  {selectedInterviewSchedule.location}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseInterviewModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition"
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