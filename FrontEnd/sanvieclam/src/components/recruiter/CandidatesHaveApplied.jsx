import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Building2, MapPin, DollarSign, CalendarDays } from "lucide-react";
import CandidateProfileModal from "../candidate/CandidateProfileModal";
import { getApplicationsByJob } from "../../api/ApplicationApi";
import { getCandidateById } from "../../api/CandidateApi";

const CandidatesHaveApplied = () => {
  const location = useLocation();
  const job = location.state?.job; // ✅ lấy job từ RecruiterJobPosts

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [appliedCandidates, setAppliedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const candidatesPerPage = 4;
  const totalPages = Math.ceil(appliedCandidates.length / candidatesPerPage);
  const startIndex = (page - 1) * candidatesPerPage;
  const endIndex = Math.min(
    startIndex + candidatesPerPage,
    appliedCandidates.length
  );
  const currentCandidates = appliedCandidates.slice(startIndex, endIndex);

  const displayValue = (val) => (val && val !== "" ? val : "Chưa có thông tin");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        if (!job?.id) return;

        // 1. Gọi API lấy tất cả đơn ứng tuyển theo job
        const applications = await getApplicationsByJob(job.id);

        // 2. Với mỗi application, lấy thông tin ứng viên
        const candidatesWithInfo = await Promise.all(
          applications.map(async (app) => {
            const candidate = await getCandidateById(app.candidateId);
            return {
              id: candidate.id,
              fullName: candidate.fullName,
              dob: candidate.dob,
              gender: candidate.gender,
              email: candidate.email,
              phone: candidate.phone,
              address: candidate.address,
              school: candidate.school,
              major: candidate.major,
              gpa: candidate.gpa,
              graduationYear: candidate.graduationYear,
              experience: candidate.experience,
              projects: candidate.projects,
              skills: candidate.skills,
              certificates: candidate.certificates,
              careerGoal: candidate.careerGoal,
              hobbies: candidate.hobbies,
              social: candidate.social,
              cvUrl: app.cvUrl, // 👉 lấy từ application
            };
          })
        );

        setAppliedCandidates(candidatesWithInfo);
      } catch (error) {
        console.error("❌ Lỗi khi load ứng viên đã ứng tuyển:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [job?.id]);

  if (loading) {
    return (
      <div className="p-28 pt-28 text-center text-lg font-semibold text-gray-600">
        ⏳ Đang tải danh sách ứng viên...
      </div>
    );
  }

  return (
    <div className="p-28 pt-28 space-y-4">
      {/* Thông tin job */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-700">
          {displayValue(job?.title)}
        </h1>
        <p className="text-gray-600 flex items-center gap-2 mt-1">
          <Building2 className="w-5 h-5 text-indigo-500" />
          {displayValue(job?.company)}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-gray-700">
          <p className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            {displayValue(job?.location)}
          </p>
          <p className="flex items-center gap-2 text-green-600 font-medium">
            <DollarSign className="w-5 h-5" />
            {displayValue(job?.salary)}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-500" />
            Bắt đầu: {displayValue(job?.startDate)}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-orange-500" />
            Kết thúc: {displayValue(job?.endDate)}
          </p>
        </div>
      </div>

      {/* Danh sách ứng viên */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 p-6 rounded-xl text-white">
        <h2 className="text-xl font-bold mb-4">
          Danh sách ứng viên đã ứng tuyển
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-md p-4 
                        flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <h3 className="text-lg font-bold text-yellow-300">
                  {candidate.fullName}
                </h3>
                <p className="text-sm opacity-90 font-bold">
                  {candidate.major}
                </p>
                <div className="mt-1 text-x space-y-0.5">
                  <div>
                    <span className="font-semibold">Kỹ năng: </span>
                    {displayValue(candidate.skills)}
                  </div>
                  <div>
                    <span className="font-semibold">Kinh nghiệm: </span>
                    {displayValue(candidate.experience)}
                  </div>
                  <div>
                    <span className="font-semibold">Tốt nghiệp: </span>
                    {displayValue(candidate.graduationYear)} (
                    {displayValue(candidate.gpa)})
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-3 sm:mt-0">
                <button
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setIsModalOpen(true);
                  }}
                  className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg shadow-md 
                             hover:bg-yellow-300 transition"
                >
                  Xem hồ sơ
                </button>
                <button
                  onClick={() => window.open(candidate.cvUrl, "_blank")}
                  className="bg-white/30 text-white px-4 py-2 rounded-lg shadow-md 
                             hover:bg-white/40 transition"
                >
                  Xem CV
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm">
            Đang xem {startIndex + 1} - {endIndex} trên tổng{" "}
            {appliedCandidates.length} ứng viên
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg bg-white/20 text-white hover:bg-white/30 disabled:opacity-40"
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
              className="px-3 py-1 rounded-lg bg-white/20 text-white hover:bg-white/30 disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modal hồ sơ */}
      <CandidateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidate={selectedCandidate}
      />
    </div>
  );
};

export default CandidatesHaveApplied;
