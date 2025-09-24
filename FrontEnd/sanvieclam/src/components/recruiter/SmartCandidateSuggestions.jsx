import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CandidateProfileModal from "../candidate/CandidateProfileModal";
import { getJobsByStatus } from "../../api/RecruiterApi";
import { getCandidatesForJob } from "../../api/MachCandidateApi";

const SmartCandidateSuggestions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const jobs = await getJobsByStatus("APPROVED");

        if (jobs.length > 0) {
          const sortedJobs = [...jobs].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );

          const newestJob = sortedJobs[0];
          const res = await getCandidatesForJob(newestJob.id);

          const mapped = res.map((item) => ({
            ...item.candidate,
            match:
              item.score != null
                ? item.score.toFixed
                  ? item.score.toFixed(2) + "%"
                  : String(item.score)
                : "N/A",
            score: item.score,
          }));

          setCandidates(mapped);
        }
      } catch (err) {
        console.error("❌ Lỗi load SmartCandidateSuggestions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="w-full py-20 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 text-white">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center flex items-center justify-center gap-3">
        <Sparkles className="w-8 h-8 text-yellow-300 animate-spin-slow" />
        Gợi ý ứng viên thông minh
      </h2>

      {loading ? (
        // 👉 Loading state
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
        </div>
      ) : (
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
              {/* Avatar */}
              <div className="h-44 w-full overflow-hidden">
                <img
                  src={candidate.image}
                  alt={candidate.fullName}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Nội dung */}
              <div className="p-5 flex flex-col flex-1 justify-between text-white">
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1">
                    {candidate.fullName}
                  </h3>
                  <span className="text-sm opacity-90">{candidate.major}</span>
                  <div className="mt-3 text-xs space-y-1">
                    <div className="truncate max-w-[200px]">
                      <span className="font-semibold">Kỹ năng: </span>
                      {candidate.skills}
                    </div>
                    <div className="truncate max-w-[200px]">
                      <span className="font-semibold">Kinh nghiệm: </span>
                      {candidate.experience}
                    </div>
                    <div className="truncate max-w-[200px]">
                      <span className="font-semibold">Tốt nghiệp: </span>
                      {candidate.graduationYear} ({candidate.gpa})
                    </div>
                    <div className="truncate max-w-[200px]">
                      <span className="font-semibold">Phù hợp: </span>
                      <span className="text-green-300 font-bold">
                        {candidate.match}
                      </span>
                    </div>
                    <div className="truncate max-w-[200px]">
                      <span className="font-semibold">Social: </span>
                      {candidate.social}
                    </div>
                  </div>
                </div>

                {/* Nút mở modal */}
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
      )}

      {/* Xem thêm */}
      {!loading && candidates.length > 4 && (
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