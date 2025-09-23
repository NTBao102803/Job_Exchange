// src/pages/admin/AdminJob.js
import React, { useState, useEffect } from "react";
import { Search, Trash2, Briefcase, CheckCircle, XCircle } from "lucide-react";
import JobActiveModal from "../../components/admin/JobActiveModal";

const AdminJob = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const data = [
        {
          id: 1,
          title: "Frontend Developer",
          company: "ABC Corp",
          location: "Hà Nội",
          jobType: "Full-time",
          salary: "15 - 20 triệu",
          description: "Phát triển giao diện web hiện đại.",
          requirements: "Thành thạo ReactJS, HTML, CSS",
          benefits: "Bảo hiểm, Du lịch công ty",
          skills: "ReactJS, JavaScript",
          experience: "2 năm",
          education: "Đại học CNTT",
          career: "IT - Phần mềm",
          status: "Đang chờ xét duyệt",
        },
        {
          id: 2,
          title: "Backend Developer",
          company: "XYZ Group",
          location: "TP.HCM",
          jobType: "Full-time",
          salary: "18 - 25 triệu",
          description: "Xây dựng API cho hệ thống.",
          requirements: "Spring Boot, Database",
          benefits: "Lương tháng 13, OT",
          skills: "Java, SQL",
          experience: "3 năm",
          education: "Đại học CNTT",
          career: "IT - Phần mềm",
          status: "Đã xét duyệt",
        },
        {
          id: 3,
          title: "Frontend Developer",
          company: "ABC Corp",
          location: "Hà Nội",
          jobType: "Full-time",
          salary: "15 - 20 triệu",
          description: "Phát triển giao diện web hiện đại.",
          requirements: "Thành thạo ReactJS, HTML, CSS",
          benefits: "Bảo hiểm, Du lịch công ty",
          skills: "ReactJS, JavaScript",
          experience: "2 năm",
          education: "Đại học CNTT",
          career: "IT - Phần mềm",
          status: "Đang chờ xét duyệt",
        },
        {
          id: 4,
          title: "Frontend Developer",
          company: "ABC Corp",
          location: "Hà Nội",
          jobType: "Full-time",
          salary: "15 - 20 triệu",
          description: "Phát triển giao diện web hiện đại.",
          requirements: "Thành thạo ReactJS, HTML, CSS",
          benefits: "Bảo hiểm, Du lịch công ty",
          skills: "ReactJS, JavaScript",
          experience: "2 năm",
          education: "Đại học CNTT",
          career: "IT - Phần mềm",
          status: "Xét duyệt thất bại",
        },
        {
          id: 5,
          title: "Frontend Developer",
          company: "ABC Corp",
          location: "Hà Nội",
          jobType: "Full-time",
          salary: "15 - 20 triệu",
          description: "Phát triển giao diện web hiện đại.",
          requirements: "Thành thạo ReactJS, HTML, CSS",
          benefits: "Bảo hiểm, Du lịch công ty",
          skills: "ReactJS, JavaScript",
          experience: "2 năm",
          education: "Đại học CNTT",
          career: "IT - Phần mềm",
          status: "Xét duyệt thất bại",
        },
        
      ];
      setJobs(data);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((j) => {
    const matchTitle = j.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchStatus = filterStatus === "Tất cả" || j.status === filterStatus;
    return matchTitle && matchStatus;
  });
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  // ✅ Hàm cập nhật trạng thái sau khi duyệt từ modal
  const handleApprove = ({ id, status }) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, status } : job
      )
    );
    setSelectedJob(null);
  };

  const handleReject = ({ id, status }) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, status } : job
      )
    );
    setSelectedJob(null);
  };

  return (
    <div className="p-1">
      <h1 className="flex items-center gap-3 text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
        <Briefcase className="w-9 h-9 text-blue-600 drop-shadow-sm" />
        Quản lý việc làm
      </h1>

      {/* Thanh tìm kiếm + bộ lọc */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 mt-10">
        <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-full sm:w-1/2">
          <Search className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />
        </div>

        <div className="flex gap-2">
          {["Tất cả","Đã xét duyệt","Đang chờ xét duyệt", "Xét duyệt thất bại"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {status}
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
            {currentJobs.map((j) => (
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
                  <p><span className="font-semibold">Địa điểm: </span>{j.location}</p>
                  <p><span className="font-semibold">Loại hình: </span>{j.jobType}</p>
                  <p><span className="font-semibold">Mức lương: </span>{j.salary}</p>
                </td>
                <td className="p-4 text-white">
                  {j.status === "Đã xét duyệt" && (
                    <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                      {j.status}
                    </span>
                  )}
                  {j.status === "Đang chờ xét duyệt" && (
                    <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">
                      {j.status}
                    </span>
                  )}
                  {j.status === "Xét duyệt thất bại" && (
                    <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                      {j.status}
                    </span>
                  )}
                </td>
                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => setSelectedJob(j)}
                    disabled={j.status !== "Đang chờ xét duyệt"}
                    className={`p-2 rounded-lg text-white transition ${
                      j.status === "Đang chờ xét duyệt"
                        ? "bg-blue-500 hover:bg-blue-400"
                        : "bg-gray-400 cursor-not-allowed opacity-50"
                    }`}
                  >
                    Xét duyệt
                  </button>
                  <button className="p-2 bg-red-500 rounded-lg hover:bg-red-400 text-white transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Phân trang */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-white">
          <span className="text-sm mb-2 sm:mb-0">
            Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredJobs.length)} trong {filteredJobs.length} nhà tuyển dụng
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white/30 rounded-lg hover:bg-white/40 disabled:opacity-40"
            >
              Trước
            </button>
            <span className="px-3 py-1 bg-white/20 rounded-lg">{currentPage} / {totalPages || 1}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 bg-white/30 rounded-lg hover:bg-white/40 disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
      {/* Modal */}
      {selectedJob && (
        <JobActiveModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default AdminJob;
