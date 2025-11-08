import React, { useState, useEffect } from "react";
import { MapPin, Users, Building2, Star, MessageSquare } from "lucide-react";
import { useParams } from "react-router-dom";
import { getEmployerProfile, getAllJobsByEmail, getAvatarUrl } from "../../api/RecruiterApi";
import JobPreviewModal from "./JobPreviewModal";

const RecruiterPage = () => {
  const { recruiterId } = useParams();

  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [comments, setComments] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [reply, setReply] = useState("");
  const [jobData, setJobData] = useState(null);
  const [showPreview, setShowPreview] = useState(false); 

  // Lấy thông tin công ty
  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        const data = await getEmployerProfile(recruiterId);
        setRecruiter(data);

        let avatarLink = data.avatarUrl || null;
        if (!avatarLink && data.id) {
          avatarLink = await getAvatarUrl(data.id);
        }
        setAvatar(avatarLink);

        // Giữ các comment cứng như trước, bạn có thể thay bằng API sau
        setComments([
          { author: "Nguyễn Minh", content: "Công ty uy tín, môi trường tốt", rating: 5, replies: [] },
          { author: "Lê Thảo", content: "HR thân thiện, phản hồi nhanh", rating: 4, replies: [] },
        ]);
      } catch (err) {
        console.error("❌ Lỗi tải recruiter:", err);
      }
    };
    fetchRecruiter();
  }, [recruiterId]);

  // Lấy danh sách job thực tế từ API (chỉ APPROVED)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobsByEmail();
        const approvedJobs = data.filter((job) => job.status === "APPROVED");
        setJobs(approvedJobs);
      } catch (err) {
        console.error("❌ Lỗi khi lấy công việc:", err);
      }
    };
    fetchJobs();
  }, []);

  const handleReply = (index) => {
    if (!reply.trim()) return;
    const updated = [...comments];
    updated[index].replies.push({
      author: recruiter.fullName,
      content: reply,
    });
    setComments(updated);
    setReply("");
  };

  if (!recruiter) return <p className="text-center text-gray-500 mt-10">Đang tải...</p>;

  const averageRating = comments.length
    ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 pt-32 font-sans">
      {/* HEADER */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={avatar || "/default-company.png"}
            alt="logo"
            className="w-28 h-28 rounded-xl object-cover border shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{recruiter.companyName}</h1>
            <div className="flex items-center gap-2 text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < Math.floor(averageRating) ? "#facc15" : "#e5e7eb"}
                />
              ))}
              <span className="text-gray-600 font-medium">{averageRating.toFixed(1)}/5</span>
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
              <span className="flex items-center gap-2">
                <Building2 size={18} /> {recruiter.companyField || "Chưa cập nhật"}
              </span>
              <span className="flex items-center gap-2">
                <Users size={18} /> {recruiter.companySize || "0 - 20 người"}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={18} /> {recruiter.companyAddress || "Không rõ"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TAB SWITCHER */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("about")}
          className={`px-5 py-3 font-medium transition ${
            activeTab === "about"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          Giới thiệu công ty
        </button>
        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-5 py-3 font-medium transition ${
            activeTab === "jobs"
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          Vị trí tuyển dụng
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "about" ? (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Giới thiệu công ty */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-blue-50 rounded-2xl shadow p-6 border border-blue-200">
              <h2 className="text-xl font-semibold mb-4 text-blue-600">
                Giới thiệu công ty
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {recruiter.companyDescription || "Chưa có mô tả công ty."}
              </p>
              {(recruiter.companyWebsite || recruiter.companySocial) && (
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  {recruiter.companyWebsite && (
                    <p>
                      🌐 Website:{" "}
                      <a
                        href={recruiter.companyWebsite}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {recruiter.companyWebsite}
                      </a>
                    </p>
                  )}
                  {recruiter.companySocial && (
                    <p>
                      🔗 Mạng xã hội:{" "}
                      <a
                        href={recruiter.companySocial}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {recruiter.companySocial}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Đánh giá & Bình luận */}
            <div className="bg-yellow-50 rounded-2xl shadow p-6 border border-yellow-200">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-yellow-600">
                <MessageSquare /> Đánh giá & Bình luận
              </h2>
              {comments.length === 0 ? (
                <p className="text-gray-500">Chưa có bình luận nào.</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((c, i) => (
                    <div key={i} className="border-b pb-3">
                      <p className="font-semibold">{c.author}</p>
                      <p className="text-gray-700">{c.content}</p>
                      <div className="flex gap-1 text-yellow-500 mt-1">
                        {[...Array(c.rating)].map((_, idx) => (
                          <Star key={idx} size={16} fill="#facc15" />
                        ))}
                      </div>
                      {c.replies?.map((r, idx) => (
                        <div
                          key={idx}
                          className="ml-6 mt-2 bg-gray-50 border-l-4 border-blue-300 pl-3 text-gray-700 text-sm rounded"
                        >
                          💬 <strong>{r.author}:</strong> {r.content}
                        </div>
                      ))}
                      <div className="mt-2 ml-6 flex gap-2">
                        <input
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          className="border p-1 rounded text-sm flex-1"
                          placeholder="Trả lời bình luận..."
                        />
                        <button
                          onClick={() => handleReply(i)}
                          className="text-sm bg-blue-600 text-white px-2 rounded"
                        >
                          Gửi
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Người đại diện */}
          <div className="bg-green-50 rounded-2xl shadow p-6 border border-green-200">
            <h2 className="text-lg font-semibold mb-3 text-green-600">
              Người đại diện
            </h2>
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xl">👤</span>
              </div>
              <div>
                <p className="font-semibold">{recruiter.fullName}</p>
                <p className="text-sm text-gray-500">{recruiter.position || "Chưa cập nhật"}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Tab Vị trí tuyển dụng
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Vị trí tuyển dụng</h2>
          {jobs.length === 0 ? (
            <p className="text-gray-500">Chưa có vị trí nào được đăng thành công.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col justify-between p-4 border rounded-xl hover:shadow-md transition bg-gray-50"
                  onClick={() => {
                        setJobData(job); // ✅ lưu job hiện tại
                        setShowPreview(true); // ✅ bật modal
                      }}
                >
                  <div className="space-y-1">
                    <h3
                      className="text-lg font-semibold text-indigo-700 truncate cursor-pointer"
                      title={job.title}
                    >
                      {job.title}
                    </h3>
                    <p
                      className="text-sm text-gray-600 truncate cursor-pointer hover:underline"
                      title={recruiter.companyName}
                    >
                      {recruiter.companyName}
                    </p>
                    <p className="text-sm text-gray-600">
                      📍 {job.location} | ⏰ {job.jobType}
                    </p>
                    <p className="text-sm text-green-600 font-medium">💰 {job.salary}</p>
                    {job.requirements?.skills && (
                      <p className="text-sm text-gray-700 truncate" title={job.requirements.skills}>
                        🛠 {job.requirements.skills}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Modal xem chi tiết  */}
      {showPreview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 relative overflow-y-scroll max-h-[90vh] scrollbar-hide">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
            >
              ✖
            </button>
            <JobPreviewModal
              job={jobData}
              onClose={() => setShowPreview(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterPage;
