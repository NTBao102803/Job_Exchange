import React, { useState, useEffect } from "react";
import { Briefcase, AlertTriangle } from "lucide-react";
import CandidateProfileModal from "../candidate/CandidateProfileModal";
import { getJobsByStatusByEmployer } from "../../api/RecruiterApi";
import {
  getCandidatesForJob,
  syncAllCandidates,
} from "../../api/MachCandidateApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SmartCandidateSuggestionsList = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("");

  const navigate = useNavigate();

  // ✅ Kiểm tra gói dịch vụ hiện tại
  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) return;

        const res = await axios.get(
          `http://localhost:8080/api/payment-plans/current/${user.id}`
        );
        setCurrentPlan(res.data?.planName || "");
      } catch (err) {
        console.warn("⚠️ Không có gói dịch vụ hiện tại:", err);
      }
    };
    fetchCurrentPlan();
  }, []);

  // ✅ Lấy danh sách job (chỉ khi có gói)
  useEffect(() => {
    if (!currentPlan) return;
    const fetchJobs = async () => {
      try {
        const res = await getJobsByStatusByEmployer("APPROVED");
        setJobs(res);
        if (res.length > 0) setSelectedJob(res[0].id);
      } catch (err) {
        console.error("❌ Lỗi load jobs:", err);
      }
    };
    fetchJobs();
  }, [currentPlan]);

  // ✅ Auto sync ứng viên khi mở trang
  useEffect(() => {
    if (!currentPlan) return;
    const autoSync = async () => {
      try {
        await syncAllCandidates();
        console.log("✅ Sync thành công!");
      } catch (err) {
        console.error("❌ Lỗi khi auto sync:", err);
      }
    };
    autoSync();
  }, [currentPlan]);

  // ✅ Lấy danh sách ứng viên khi chọn job
  useEffect(() => {
    if (!selectedJob || !currentPlan) return;

    const fetchCandidate = async () => {
      setLoading(true);
      console.log("🚀 Gọi API getCandidatesForJob với jobId:", selectedJob);

      try {
        const res = await getCandidatesForJob(selectedJob);
        const mappedCandidates = res.map((item, index) => {
          const matchValue =
            item.score != null
              ? item.score.toFixed
                ? item.score.toFixed(2) + "%"
                : String(item.score)
              : "N/A";

          return {
            ...item.candidate,
            match: matchValue,
            score: item.score,
          };
        });

        setCandidates(mappedCandidates);
      } catch (err) {
        console.error("❌ Lỗi load candidate:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [selectedJob, currentPlan]);

  // ✅ Phân trang
  const candidatesPerPage = 4;
  const totalPages = Math.ceil(candidates.length / candidatesPerPage);
  const startIndex = (page - 1) * candidatesPerPage;
  const endIndex = Math.min(startIndex + candidatesPerPage, candidates.length);
  const currentCandidates = candidates.slice(startIndex, endIndex);

  // ✅ Nếu chưa có gói dịch vụ
  if (!currentPlan) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white px-6">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-10 text-center max-w-lg animate-fadeIn">
        <div className="flex justify-center mb-5">
          <AlertTriangle className="w-16 h-16 text-yellow-400 animate-bounce" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-yellow-300">
          Tính năng bị khóa
        </h2>
        <p className="text-base md:text-lg text-white/90 mb-6">
          Bạn chưa có gói dịch vụ nào đang hoạt động.  
          Hãy{" "}
          <span className="font-semibold text-yellow-300">
            đăng ký ngay
          </span>{" "}
          để sử dụng tính năng{" "}
          <span className="font-bold text-white">
            Gợi ý ứng viên thông minh
          </span>.
        </p>

        <button
          onClick={() => navigate("/recruiter/serviceplans")}
          className="px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-md hover:bg-yellow-300 hover:scale-105 transition-all duration-200"
        >
          Đăng ký ngay
        </button>
      </div>
    </section>
  );
}

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
                    <div className="truncate ">
                      <span className="font-semibold">Liên hệ: </span>
                      {candidate.email}
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
