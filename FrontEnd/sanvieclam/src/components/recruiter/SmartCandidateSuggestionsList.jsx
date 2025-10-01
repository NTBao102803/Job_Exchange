import React, { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";
import CandidateProfileModal from "../candidate/CandidateProfileModal";
import { getJobsByStatusByEmployer } from "../../api/RecruiterApi";
import {
  getCandidatesForJob,
  syncAllCandidates,
} from "../../api/MachCandidateApi";

const SmartCandidateSuggestionsList = () => {
  const [jobs, setJobs] = useState([]); // ✅ danh sách jobs từ API
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]); // ✅ danh sách ứng viên từ API
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Lấy danh sách job từ API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getJobsByStatusByEmployer("APPROVED"); // ví dụ lấy job đang mở
        setJobs(res);
        if (res.length > 0) {
          setSelectedJob(res[0].id); // chọn job đầu tiên
        }
      } catch (err) {
        console.error("❌ Lỗi load jobs:", err);
      }
    };
    fetchJobs();
  }, []);
  // ✅ Tự động sync khi mở trang
  useEffect(() => {
    const autoSync = async () => {
      try {
        await syncAllCandidates();
        console.log("✅ Sync thành công!");
        if (selectedJob) {
          await fetchCandidates();
        }
      } catch (err) {
        console.error("❌ Lỗi khi auto sync:", err);
      }
    };
    autoSync();
  }, []);

  // ✅ Lấy ứng viên match khi chọn job
  useEffect(() => {
    const fetchCandidate = async () => {
      if (!selectedJob) {
        console.log("⚠️ Không có job nào được chọn -> không gọi API");
        return;
      }

      setLoading(true);
      console.log("🚀 Gọi API getCandidatesForJob với jobId:", selectedJob);

      try {
        const res = await getCandidatesForJob(selectedJob);
        console.log("✅ API response (raw):", res);

        // res = [{ candidate, score }]
        const mappedCandidates = res.map((item, index) => {
          const matchValue =
            item.score != null
              ? item.score.toFixed
                ? item.score.toFixed(2) + "%"
                : String(item.score)
              : "N/A";

          console.log(
            `🟢 Candidate[${index}]:`,
            item.candidate,
            "Score:",
            item.score,
            "Match:",
            matchValue
          );

          return {
            ...item.candidate,
            match: matchValue, // giữ "match" để UI cũ không phải thay đổi
            score: item.score, // giữ score nếu bạn cần tính khác nơi khác
          };
        });

        console.log("📌 mappedCandidates:", mappedCandidates);
        setCandidates(mappedCandidates); // ✅ set list để render
      } catch (err) {
        console.error("❌ Lỗi load candidate:", err);

        // log chi tiết nếu có response từ server
        if (err.response) {
          console.error("❌ Error status:", err.response.status);
          console.error("❌ Error data:", err.response.data);
          console.error("❌ Error headers:", err.response.headers);
        } else if (err.request) {
          console.error("❌ Không nhận được response từ server:", err.request);
        } else {
          console.error("❌ Lỗi khi setup request:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [selectedJob]);

  // ✅ Phân trang
  const candidatesPerPage = 4;
  const totalPages = Math.ceil(candidates.length / candidatesPerPage);
  const startIndex = (page - 1) * candidatesPerPage;
  const endIndex = Math.min(startIndex + candidatesPerPage, candidates.length);
  const currentCandidates = candidates.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 pt-32 pb-32 px-6 relative text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Select chọn job */}
        <div className="relative">
          <select
            value={selectedJob || ""}
            onChange={(e) => setSelectedJob(Number(e.target.value))}
            className="w-full rounded-lg border border-white/30 bg-white/20 text-white px-5 py-3 shadow-md 
                       focus:ring-2 focus:ring-yellow-300 focus:outline-none appearance-none"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id} className="text-black">
                {job.title}
              </option>
            ))}
          </select>
          <Briefcase
            className="absolute right-4 top-3.5 text-yellow-300"
            size={20}
          />
        </div>

        {/* Danh sách ứng viên */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p className="italic text-white/80 col-span-2 text-lg">
              Đang tải ứng viên...
            </p>
          ) : currentCandidates.length > 0 ? (
            currentCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-md p-6 
                           flex justify-between items-center 
                           hover:shadow-[0_0_25px_rgba(255,255,255,0.7)] hover:scale-[1.02] 
                           transition transform"
              >
                {/* Thông tin ứng viên */}
                <div className="flex-1 pr-4">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-yellow-300">
                    {candidate.fullName}
                  </h3>
                  <span className="text-base opacity-90">
                    {candidate.major}
                  </span>
                  <div className="mt-2 text-sm md:text-base space-y-1">
                    <div className="truncate max-w-[220px]">
                      <span className="font-semibold">Kỹ năng: </span>
                      {candidate.skills}
                    </div>
                    <div className="truncate max-w-[220px]">
                      <span className="font-semibold">Kinh nghiệm: </span>
                      {candidate.experience}
                    </div>
                    <div className="truncate max-w-[220px]">
                      <span className="font-semibold">Tốt nghiệp: </span>
                      {candidate.graduationYear} ({candidate.gpa})
                    </div>
                    <div className="truncate max-w-[220px]">
                      <span className="font-semibold">Phù hợp: </span>
                      <span className="text-green-300 font-bold">
                        {candidate.match}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Button xem hồ sơ */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setIsModalOpen(true);
                    }}
                    className="bg-yellow-400 text-gray-900 font-bold px-5 py-2.5 rounded-lg shadow-md 
                               hover:bg-yellow-300 transition text-sm md:text-base"
                  >
                    Xem hồ sơ
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="italic text-white/80 col-span-2 text-lg">
              Không tìm thấy ứng viên phù hợp.
            </p>
          )}
        </div>
      </div>

      {/* Pagination */}
      {candidates.length > 0 && (
        <div className="sticky bottom-0 left-0 w-full bg-white/10 backdrop-blur-xl border-t border-white/20 py-3 mt-6 shadow-inner">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-white">
            <p className="text-sm mb-2 md:mb-0">
              Đang xem {startIndex + 1} - {endIndex} trên tổng{" "}
              {candidates.length} ứng viên
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

      {/* Modal hồ sơ */}
      <CandidateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidate={selectedCandidate}
      />
    </div>
  );
};

export default SmartCandidateSuggestionsList;
