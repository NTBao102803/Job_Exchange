import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Building2, MapPin, DollarSign, CalendarDays } from "lucide-react";
import CandidateProfileModal from "../candidate/CandidateProfileModal";
import {
  getApplicationsByJob,
  approveApplication,
  rejectApplication,
} from "../../api/ApplicationApi";
import { getCandidateById } from "../../api/CandidateApi";

const CandidatesHaveApplied = () => {
  const location = useLocation();
  const job = location.state?.job;

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [appliedCandidates, setAppliedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [candidateToApprove, setCandidateToApprove] = useState(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

const [interviewForm, setInterviewForm] = useState({
  fullName: "",
  phone: "",
  date: "",
  time: "",
  location: "",
});


  const [filterStatus, setFilterStatus] = useState("ALL"); // 🆕 filter dropdown

  const candidatesPerPage = 4;

  const displayValue = (val) => (val && val !== "" ? val : "Chưa có thông tin");

  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        if (!job?.id) return;

        const applications = await getApplicationsByJob(job.id);

        const candidatesWithInfo = await Promise.all(
          applications.map(async (app) => {
            const candidate = await getCandidateById(app.candidateId);
            const obj = {
              ...candidate,
              cvUrl: app.cvUrl,
              approvalStatus: app.status?.toUpperCase() || "PENDING",
              applicationId: app.id,
            };
            console.log("📥 Loaded candidate:", obj);
            return obj;
          })
        );

        // ✅ Ưu tiên PENDING lên đầu, sau đó APPROVE, cuối cùng REJECT
        const sortedCandidates = candidatesWithInfo.sort((a, b) => {
          const order = { PENDING: 1, APPROVED: 2, REJECTED: 3 };
          return order[a.approvalStatus] - order[b.approvalStatus];
        });

        setAppliedCandidates(sortedCandidates);
      } catch (error) {
        console.error("❌ Lỗi khi load ứng viên:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [job?.id]);

  // 🆕 Lọc theo trạng thái từ dropdown
  const filteredCandidates =
    filterStatus === "ALL"
      ? appliedCandidates
      : appliedCandidates.filter((c) => c.approvalStatus === filterStatus);

  // Tính toán phân trang sau khi lọc
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  const startIndex = (page - 1) * candidatesPerPage;
  const endIndex = Math.min(
    startIndex + candidatesPerPage,
    filteredCandidates.length
  );
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="p-28 pt-28 text-center text-lg font-semibold text-gray-600">
        ⏳ Đang tải danh sách ứng viên...
      </div>
    );
  }

  const handleApproveClick = (candidate) => {
    setCandidateToApprove(candidate);
    setIsApprovalModalOpen(true);
  };

  const handleApprovalDecision = async (decision) => {
    if (!candidateToApprove?.applicationId) return;

    const applicationId = candidateToApprove.applicationId;

    try {
      if (decision) {
        await approveApplication(applicationId);
      } else {
        await rejectApplication(applicationId);
      }

      // ✅ Cập nhật và sắp xếp lại danh sách
      setAppliedCandidates((prev) => {
        const updated = prev.map((c) =>
          c.applicationId === applicationId
            ? { ...c, approvalStatus: decision ? "APPROVED" : "REJECTED" }
            : c
        );

        const order = { PENDING: 1, APPROVED: 2, REJECTED: 3 };
        return updated.sort(
          (a, b) => order[a.approvalStatus] - order[b.approvalStatus]
        );
      });
    } catch (error) {
      alert("Không thể duyệt hồ sơ. Vui lòng thử lại!");
    } finally {
      setIsApprovalModalOpen(false);
      setCandidateToApprove(null);
    }
  };

  return (
    <div className="p-28 pt-28 space-y-4 text-lg">
      {/* Thông tin job */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-indigo-700">
          {displayValue(job?.title)}
        </h1>
        <p className="text-gray-600 flex items-center gap-2 mt-2 text-lg">
          <Building2 className="w-5 h-5 text-indigo-500" />
          {displayValue(job?.company)}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-gray-700 text-lg">
          <p className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            {displayValue(job?.location)}
          </p>
          <p className="flex items-center gap-2 text-green-600 font-semibold">
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
      <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 p-7 rounded-xl text-white">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">
            Danh sách ứng viên đã ứng tuyển
          </h2>

          {/* 🆕 Dropdown lọc trạng thái */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-md focus:outline-none"
          >
            <option value="ALL">Tất cả</option>
            <option value="PENDING">Chưa duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Từ chối</option>
          </select>
        </div>

        {filteredCandidates.length === 0 ? (
          <p className="text-center text-lg">Không có ứng viên nào.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentCandidates.map((candidate) => (
              <div
                key={candidate.applicationId}
                className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-md p-5 
                           flex flex-col sm:flex-row justify-between items-start sm:items-center text-lg"
              >
                <div className="w-full sm:w-[65%] space-y-2">
                  <h3
                    className="text-xl font-bold text-yellow-300 truncate"
                    title={candidate.fullName}
                  >
                    {candidate.fullName}
                  </h3>
                  <p
                    className="text-base opacity-90 font-semibold truncate"
                    title={candidate.major}
                  >
                    {displayValue(truncateText(candidate.major, 50))}
                  </p>

                  <div className="mt-2 text-base space-y-1">
                    <div className="truncate" title={candidate.skills}>
                      <span className="font-semibold">Kỹ năng: </span>
                      {displayValue(truncateText(candidate.skills, 80))}
                    </div>
                    <div className="truncate" title={candidate.experience}>
                      <span className="font-semibold">Kinh nghiệm: </span>
                      {displayValue(truncateText(candidate.experience, 80))}
                    </div>
                    <div>
                      <span className="font-semibold">Tốt nghiệp: </span>
                      {displayValue(candidate.graduationYear)} (
                      {displayValue(candidate.gpa)})
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4 sm:mt-0 w-full sm:w-auto sm:items-end">
                  <button
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setIsModalOpen(true);
                    }}
                    className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg shadow-md hover:bg-yellow-300 transition text-base"
                  >
                    Xem hồ sơ
                  </button>

                  <button
                    onClick={() => window.open(candidate.cvUrl, "_blank")}
                    className="bg-white/30 text-white px-4 py-2 rounded-lg shadow-md hover:bg-white/40 transition text-base"
                  >
                    Xem CV
                  </button>

                  {candidate.approvalStatus === "PENDING" ? (
                    <button
                      onClick={() => handleApproveClick(candidate)}
                      className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:bg-green-400 transition text-base"
                    >
                      Xét duyệt
                    </button>
                  ) : candidate.approvalStatus === "APPROVED" ? (
                    <button
                      onClick={() => setIsInterviewModalOpen(true)}
                      className="bg-green-700 text-white font-bold px-4 py-2 rounded-lg shadow-md cursor-default text-base"
                    >
                      Lịch phỏng vấn ✅
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-500 text-white font-bold px-4 py-2 rounded-lg shadow-md cursor-default text-base"
                    >
                      Hồ sơ chưa phù hợp ❌
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phân trang */}
        {filteredCandidates.length > 0 && (
          <div className="flex justify-between items-center mt-8 text-base">
            <p>
              Đang xem {startIndex + 1} - {endIndex} trên tổng{" "}
              {filteredCandidates.length} ứng viên
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
        )}
      </div>

      {/* Modal xem hồ sơ */}
      <CandidateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidate={selectedCandidate}
      />

      {/* Modal xác nhận xét duyệt */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Bạn có muốn xét duyệt hồ sơ của ứng viên{" "}
              <span className="font-bold text-indigo-600">
                {candidateToApprove?.fullName}
              </span>{" "}
              không?
            </h3>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => {setIsApprovalModalOpen(false),setIsInterviewModalOpen(true);}}
                className="bg-green-500 hover:bg-green-400 text-white px-5 py-2 rounded-lg font-bold"
              >
                Có
              </button>
              <button
                onClick={() => handleApprovalDecision(false)}
                className="bg-red-500 hover:bg-red-400 text-white px-5 py-2 rounded-lg font-bold"
              >
                Không
              </button>
              <button
                onClick={() => setIsApprovalModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-lg font-bold"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal lịch phỏng vấn (UI only) */}
{isInterviewModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-[420px]">
      <h3 className="text-2xl font-bold text-indigo-600 mb-5 text-center">
        Lịch phỏng vấn
      </h3>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Họ và tên"
          className="w-full border rounded-lg px-3 py-2"
          value={interviewForm.fullName}
          onChange={(e) =>
            setInterviewForm({ ...interviewForm, fullName: e.target.value })
          }
        />

        <input
          type="tel"
          placeholder="Số điện thoại"
          className="w-full border rounded-lg px-3 py-2"
          value={interviewForm.phone}
          onChange={(e) =>
            setInterviewForm({ ...interviewForm, phone: e.target.value })
          }
        />

        <div className="flex gap-2">
          <input
            type="date"
            className="w-1/2 border rounded-lg px-3 py-2"
            value={interviewForm.date}
            onChange={(e) =>
              setInterviewForm({ ...interviewForm, date: e.target.value })
            }
          />
          <input
            type="time"
            className="w-1/2 border rounded-lg px-3 py-2"
            value={interviewForm.time}
            onChange={(e) =>
              setInterviewForm({ ...interviewForm, time: e.target.value })
            }
          />
        </div>

        <input
          type="text"
          placeholder="Địa điểm phỏng vấn"
          className="w-full border rounded-lg px-3 py-2"
          value={interviewForm.location}
          onChange={(e) =>
            setInterviewForm({ ...interviewForm, location: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setIsInterviewModalOpen(false)}
          className="bg-gray-300 px-4 py-2 rounded-lg font-bold"
        >
          Huỷ
        </button>
        <button
          onClick={() => {
            console.log("Interview UI:", interviewForm);
            setIsInterviewModalOpen(false);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold"
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default CandidatesHaveApplied;