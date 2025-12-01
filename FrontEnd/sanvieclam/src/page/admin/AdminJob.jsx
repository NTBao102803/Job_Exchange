import React, { useState, useEffect } from "react";
import { Search, Trash2, Briefcase } from "lucide-react";
import JobActiveModal from "../../components/admin/JobActiveModal";
import {
  getAllJobs,
  approveJob,
  rejectJob,
  getJobsByStatus,
  getPendingJobs,
} from "../../api/AdminApi";

const AdminJob = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  // 💡 Trạng thái loading/submitting cho hành động Duyệt/Từ chối
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [selectedJob, setSelectedJob] = useState(null);

  const statusMap = {
    "Tất cả": "ALL",
    "Đã xét duyệt": "APPROVED",
    "Đang chờ xét duyệt": "PENDING",
    "Xét duyệt thất bại": "REJECTED",
  };

  const backendToLabel = {
    APPROVED: "Đã xét duyệt",
    PENDING: "Đang chờ xét duyệt",
    REJECTED: "Xét duyệt thất bại",
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        setJobs(data);
      } catch (error) {
        // console.error giữ lại
        console.error("❌ Không thể tải danh sách jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((j) => {
    const matchTitle = j.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase());
    const matchStatus = filterStatus === "ALL" || j.status === filterStatus;
    return matchTitle && matchStatus;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  // ✅ Hàm duyệt job có xử lý loading
  const handleApprove = async (jobData) => {
    const jobId = jobData.id;
    // console.log đã xóa

    // 💡 Bắt đầu Loading
    setIsSubmitting(true);

    try {
      // 1. Gọi API
      const updated = await approveJob(jobId);

      // 2. Cập nhật trạng thái jobs
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: updated.status } : j))
      );

      // FIX: Đóng modal trước
      setSelectedJob(null);

      // Sau đó chuyển về trang 1 (nếu cần)
      setCurrentPage(1);

      // Thông báo THÀNH CÔNG
      alert("✅ Duyệt tin thành công!");
    } catch (error) {
      // console.error giữ lại
      console.error("❌ Lỗi khi phê duyệt job:", error);
      // Thông báo THẤT BẠI
      alert("❌ Lỗi: Không thể phê duyệt tin này.");
    } finally {
      // 💡 Kết thúc Loading
      setIsSubmitting(false);
    }
  };

  // ✅ Hàm từ chối job có xử lý loading
  const handleReject = async (jobData) => {
    const jobId = jobData.id;
    const reason = jobData.reason;
    // console.log đã xóa

    // 💡 Bắt đầu Loading
    setIsSubmitting(true);

    try {
      // 1. Gọi API
      const updated = await rejectJob(jobId, reason);

      // 2. Cập nhật trạng thái jobs
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: updated.status } : j))
      );

      // FIX: Đóng modal trước
      setSelectedJob(null);

      // Sau đó chuyển về trang 1 (nếu cần)
      setCurrentPage(1);

      // Thông báo THÀNH CÔNG
      alert("Tin đã bị từ chối xét duyệt.");
    } catch (error) {
      // console.error giữ lại
      console.error("❌ Lỗi khi từ chối job:", error);
      // Thông báo THẤT BẠI
      alert("❌ Lỗi: Không thể từ chối tin này.");
    } finally {
      // 💡 Kết thúc Loading
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-1">
      <h1 className="flex items-center gap-3 text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
        <Briefcase className="w-9 h-9 text-blue-600 drop-shadow-sm" />
        Quản lý việc làm
      </h1>
      {/* Thanh tìm kiếm + bộ lọc */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 mt-10">
        {/* Search */}
        <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-full sm:w-1/2">
          <Search className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchTitle}
            onChange={(e) => {
              setSearchTitle(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 outline-none text-gray-700"
          />
        </div>
        {/* Bộ lọc trạng thái */}
        <div className="flex gap-2">
          {Object.keys(statusMap).map((statusLabel) => (
            <button
              key={statusLabel}
              onClick={() => {
                setFilterStatus(statusMap[statusLabel]);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                statusMap[statusLabel] === filterStatus
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {statusLabel}
            </button>
          ))}
        </div>
      </div>
      {/* Bảng job */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 p-6 rounded-2xl shadow-lg mt-10">
        <table className="w-full text-left border-collapse rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-white/20 text-white uppercase text-sm tracking-wider">
              <th className="p-4">ID</th>
              <th className="p-4">Công việc</th>
              <th className="p-4">Thông tin</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentJobs.map((j) => {
              const statusLabel = backendToLabel[j.status] || j.status;
              return (
                <tr
                  key={j.id}
                  className="bg-white/10 backdrop-blur-xl hover:bg-white/20 transition border-b border-white/30"
                >
                  <td className="p-4 font-semibold text-white">{j.id}</td>
                  <td className="p-4 text-white">
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} className="text-white" />
                      <span className="font-bold">{j.title}</span>
                    </div>
                    <p className="text-xs opacity-80">{j.company}</p>
                  </td>
                  <td className="p-4 text-sm text-white space-y-1 max-w-[250px]">
                    <p>
                      <span className="font-semibold">Địa điểm: </span>
                      {j.location}
                    </p>
                    <p>
                      <span className="font-semibold">Loại hình: </span>
                      {j.jobType}
                    </p>
                    <p>
                      <span className="font-semibold">Mức lương: </span>
                      {j.salary}
                    </p>
                  </td>
                  <td className="p-4 text-white">
                    {statusLabel === "Đã xét duyệt" && (
                      <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                        {statusLabel}
                      </span>
                    )}
                    {statusLabel === "Đang chờ xét duyệt" && (
                      <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">
                        {statusLabel}
                      </span>
                    )}
                    {statusLabel === "Xét duyệt thất bại" && (
                      <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                        {statusLabel}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedJob(j);
                      }}
                      disabled={
                        j.status === "APPROVED" || j.status === "REJECTED" || isSubmitting // Vô hiệu hóa khi đang submit
                      }
                      className={`p-2 rounded-lg text-white transition ${
                        j.status === "PENDING"
                          ? "bg-blue-500 hover:bg-blue-400"
                          : "bg-gray-400 cursor-not-allowed opacity-50"
                      } disabled:opacity-50`}
                    >
                      Xét duyệt
                    </button>
                    <button className="p-2 bg-red-500 rounded-lg hover:bg-red-400 text-white transition disabled:opacity-50" disabled={isSubmitting}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Phân trang */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-white">
          <span className="text-sm mb-2 sm:mb-0">
            Hiển thị {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, filteredJobs.length)} trong
            {filteredJobs.length} việc làm
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || isSubmitting}
              className="px-3 py-1 bg-white/30 rounded-lg hover:bg-white/40 disabled:opacity-40"
            >
              Trước
            </button>
            <span className="px-3 py-1 bg-white/20 rounded-lg">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0 || isSubmitting}
              className="px-3 py-1 bg-white/30 rounded-lg hover:bg-white/40 disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
      {/* Modal duyệt job */}
      {selectedJob && (
        <JobActiveModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isSubmitting={isSubmitting} // Truyền trạng thái loading vào modal
        />
      )}
    </div>
  );
};

export default AdminJob;