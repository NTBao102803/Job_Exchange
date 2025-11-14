import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CandidateProfileModal from "../candidate/CandidateProfileModal";
import { getJobsByStatus } from "../../api/RecruiterApi";
import { getCandidatesForJob, syncAllCandidates } from "../../api/RecommendationApi";
import axios from "axios";

const SmartCandidateSuggestions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("");

  const navigate = useNavigate();

  // 👉 Lấy gói dịch vụ hiện tại
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

  // 👉 Lấy danh sách ứng viên nếu có gói dịch vụ
  useEffect(() => {
    if (!currentPlan) return;

    const fetchAndSyncCandidates = async () => {
      setLoading(true);
      try {

        await syncAllCandidates(); // GỌI API SYNC

    
        const jobs = await getJobsByStatus("APPROVED");
        if (jobs.length === 0) {
          setCandidates([]);
          return;
        }
        const formatMatchScore = (rawScore) => {
          if (!rawScore || rawScore < 1.0) return "N/A";
          const percentage = (rawScore - 1.0) * 100;
          return `${Math.min(percentage, 100).toFixed(1)}%`;
        };

        const newestJob = [...jobs].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )[0];

        // BƯỚC 3: GỌI GỢI Ý VỚI topK=20
        const res = await getCandidatesForJob(newestJob.id, 20); // GỌI ĐÚNG HÀM

        const mapped = res.map((item) => ({
          ...item.candidate,
          match:
            formatMatchScore(item.score)
        }));

        setCandidates(mapped);
      } catch (err) {
        console.error("Lỗi load SmartCandidateSuggestions:", err);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSyncCandidates();
  }, [currentPlan]);

  return (
    <section className="w-full py-20 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 text-white">
      {/* Tiêu đề */}
      <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center flex items-center justify-center gap-3">
        <Sparkles className="w-8 h-8 text-yellow-300 animate-spin-slow" />
        Gợi ý ứng viên thông minh
      </h2>

      {/* Nếu chưa có gói dịch vụ */}
      {!currentPlan ? (
        <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-2xl rounded-3xl p-10 border border-white/30 text-center shadow-xl">
          <AlertTriangle className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3 text-white">
            Chức năng bị khóa 🔒
          </h3>
          <p className="text-lg text-white/90 mb-6">
            Bạn chưa có <span className="font-semibold text-yellow-300">gói dịch vụ</span>.
            Vui lòng đăng ký để sử dụng tính năng{" "}
            <span className="font-bold text-yellow-200">Gợi ý ứng viên thông minh</span>.
          </p>
          <button
            onClick={() => navigate("/recruiter/serviceplans")}
            className="px-8 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-xl shadow-md hover:bg-yellow-300 transition transform hover:scale-105"
          >
            🚀 Đăng ký dịch vụ ngay
          </button>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Danh sách ứng viên */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
            {candidates.slice(0, 4).map((candidate, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: idx * 0.2,
                  duration: 0.7,
                  type: "spring",
                  stiffness: 100,
                }}
                className="relative bg-white/20 backdrop-blur-2xl rounded-3xl overflow-hidden 
                          border border-white/30 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] 
                          transition-transform duration-300 flex flex-col"
              >
                <div className="h-49 w-full overflow-hidden">
                  <img
                    src={"/uvphuhop.png"}
                    alt={candidate.fullName}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between text-white">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1">
                      {candidate.fullName}
                    </h3>
                    <span className="text-sm opacity-90">
                      {candidate.major}
                    </span>
                    <div className="mt-3 text-xs space-y-1">
                      <div className="truncate max-w-[200px]">
                        <span className="font-semibold">Kỹ năng: </span>
                        {candidate.skills}
                      </div>
                      <div className="truncate max-w-[200px]">
                        <span className="font-semibold">Kinh nghiệm: </span>
                        {candidate.experience}
                      </div>
                        <div className="truncate ">
                        <span className="font-semibold">Liên hệ: </span>
                        {candidate.email}
                      </div>
                      <div className="truncate max-w-[200px]">
                        <span className="font-semibold">Phù hợp: </span>
                        <span className="text-green-300 font-bold">
                          {candidate.match}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setIsModalOpen(true);
                      }}
                      className="bg-yellow-400 text-gray-900 font-bold py-2 px-5 rounded-2xl shadow-lg 
                                hover:bg-yellow-300 transition-all duration-300"
                    >
                      Xem hồ sơ
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nút xem thêm */}
          {candidates.length > 4 && (
            <div className="mt-14 flex justify-center">
              <button
                onClick={() =>
                  navigate("/recruiter/dashboard-smartcandidatesuggestionslist")
                }
                className="bg-white text-indigo-600 font-bold py-3 px-10 rounded-3xl shadow-lg 
                              hover:bg-indigo-100 transition-all duration-300"
              >
                Xem thêm ứng viên
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal hồ sơ */}
      <CandidateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidate={selectedCandidate}
      />
    </section>
  );
};

export default SmartCandidateSuggestions;
