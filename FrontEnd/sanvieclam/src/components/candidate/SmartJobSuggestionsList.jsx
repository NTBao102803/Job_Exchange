import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getSmartJobRecommendations,
  syncAllJobs,
} from "../../api/RecommendationApi";
import { getEmployerById } from "../../api/JobApi";

const SmartJobSuggestionsList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]); // ✅ danh sách job được gợi ý
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ✅ Lấy userId từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // ✅ Auto sync khi mở trang
  useEffect(() => {
    if (userId) {
      fetchRecommendedJobs();
    } else {
      console.warn("⚠️ Không tìm thấy userId trong localStorage");
    }
  }, [userId]);

  // ✅ Hàm lấy danh sách job gợi ý (kèm dữ liệu chi tiết)
  const fetchRecommendedJobs = async () => {
    setLoading(true);
    try {
      console.log(`🚀 Gọi API getSmartJobRecommendations(${userId})`);
      const res = await getSmartJobRecommendations(userId, 10);

      console.log("📦 Response từ API:", res);

      // Duyệt qua từng job, đồng thời gọi thêm API lấy thông tin employer
      const mappedJobs = await Promise.all(
        res.map(async (item) => {
          const job = item.job || {};
          const requirements = job.requirements || {};
          let companyName = "Không rõ công ty";

          // ✅ Nếu có employerId → gọi API lấy thông tin công ty
          if (job.employerId) {
            try {
              const employer = await getEmployerById(job.employerId);
              console.log("📦 Response employer từ API:", employer)
              companyName = employer?.companyName || `Công ty ID ${job.employerId}`;
            } catch (error) {
              console.warn(`⚠️ Lỗi lấy employer ${job.employerId}:`, error);
            }
          }

          return {
            id: job.id,
            title: job.title || "Chưa có tiêu đề",
            companyName: companyName,
            location: job.location || "Không rõ",
            salary: job.salary || "Thỏa thuận",
            type: job.jobType || "Fulltime",
            match: item.score ? `${(item.score * 100).toFixed(1)}%` : "N/A",
            skills: Array.isArray(requirements.skills)
              ? requirements.skills.join(", ")
              : "Không có kỹ năng yêu cầu",

            // ✅ Giữ toàn bộ dữ liệu để xem chi tiết
            jobDetail: {
              ...job,
              companyName,
            },
          };
        })
      );

      console.log("📌 mappedJobs (đã có company):", mappedJobs);
      setJobs(mappedJobs);
    } catch (err) {
      console.error("❌ Lỗi load job recommendations:", err);

      if (err.response) {
        console.error("❌ Error status:", err.response.status);
        console.error("❌ Error data:", err.response.data);
      } else if (err.request) {
        console.error("❌ Không nhận được response từ server:", err.request);
      } else {
        console.error("❌ Lỗi khi setup request:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Lọc theo ô tìm kiếm
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Phân trang
  const jobsPerPage = 4;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (page - 1) * jobsPerPage;
  const endIndex = Math.min(startIndex + jobsPerPage, filteredJobs.length);
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 pt-40 pb-32 px-6 relative text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm việc làm nổi bật..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full rounded-full border border-white/30 bg-white/20 text-white px-5 py-3 shadow-md 
                       placeholder-white/70 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
          <Search
            className="absolute right-4 top-3.5 text-yellow-300"
            size={20}
          />
        </div>

        {/* Danh sách job */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading ? (
            <p className="italic text-white/80 col-span-2 text-lg">
              ⏳ Đang tải gợi ý việc làm thông minh...
            </p>
          ) : currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-md p-4 
                           flex flex-col sm:flex-row justify-between items-start sm:items-center 
                           hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:scale-[1.01] 
                           transition transform"
              >
                <div>
                  <h3
                    className="text-xl font-semibold text-yellow-300 cursor-pointer"
                    onClick={() =>
                      navigate(`/candidate/jobs/${job.id}`, {
                        state: { job: job.jobDetail },
                      })
                    }
                  >
                    {job.title}
                  </h3>
                  <p className="text-x opacity-90">{job.companyName}</p>
                  <p className="text-x opacity-90">
                    📍 {job.location} | ⏰ {job.type}
                  </p>
                  <p className="text-x text-green-300 font-medium">
                    💰 {job.salary}
                  </p>
                  <p className="text-x mt-1 flex items-center">
                    <span className="font-semibold mr-1">Kỹ năng:</span>
                    <span
                      className="truncate max-w-[220px] whitespace-nowrap"
                      title={job.skills}
                    >
                      {job.skills}
                    </span>
                  </p>
                  <p className="text-x">
                    <span className="font-semibold">Phù hợp:</span>{" "}
                    <span className="text-green-400 font-bold">
                      {job.match}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigate(`/candidate/jobs/${job.id}`, {
                      state: { job: job.jobDetail },
                    })
                  }
                  className="mt-3 sm:mt-0 bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg shadow-md 
                             hover:bg-yellow-300 transition"
                >
                  Xem chi tiết
                </button>
              </div>
            ))
          ) : (
            <p className="italic text-white/80 col-span-2 text-lg">
              Không tìm thấy việc làm phù hợp.
            </p>
          )}
        </div>
      </div>

      {/* Pagination */}
      {jobs.length > 0 && !loading && (
        <div className="sticky bottom-0 left-0 w-full bg-white/10 backdrop-blur-xl border-t border-white/20 py-3 mt-8 shadow-inner">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-white">
            <p className="text-sm mb-2 md:mb-0">
              Đang xem {startIndex + 1} - {endIndex} trên tổng{" "}
              {filteredJobs.length} công việc
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded-lg ${
                  page === 1
                    ? "bg-white/20 text-white/50 cursor-not-allowed"
                    : "bg-white/20 text-white hover:bg-white/30"
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
                      ? "bg-yellow-400 text-gray-900 font-bold shadow-md"
                      : "bg-white/20 text-white hover:bg-white/30"
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
                    ? "bg-white/20 text-white/50 cursor-not-allowed"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartJobSuggestionsList;