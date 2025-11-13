import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Users, Building2, Star, MessageSquare } from "lucide-react";
import { getEmployerById, getAvatarUrl } from "../../api/RecruiterApi";
import { getAllPublicJobs } from "../../api/JobApi";

const RecruiterPageView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recruiterId = location.state?.recruiterId;

  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [comments, setComments] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  // Lấy thông tin recruiter
  useEffect(() => {
    if (!recruiterId) return;
    const fetchRecruiter = async () => {
      try {
        const data = await getEmployerById(recruiterId);
        setRecruiter(data);

        const avatarLink = data.avatarUrl || (data.id ? await getAvatarUrl(data.id) : null);
        setAvatar(avatarLink);

        setComments(data.comments || []);
      } catch (err) {
        console.error("❌ Lỗi tải recruiter:", err);
      }
    };
    fetchRecruiter();
  }, [recruiterId]);

  // Lấy danh sách job đã APPROVED
  useEffect(() => {
    if (!recruiterId) return;
    const fetchJobs = async () => {
      try {
        const data = await getAllPublicJobs();
        setJobs(data.filter((job) => job.employerId === recruiterId));
      } catch (err) {
        console.error("❌ Lỗi khi lấy công việc:", err);
      }
    };
    fetchJobs();
  }, [recruiterId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    try {
      const commentData = {
        author: "Bạn", // Có thể thay bằng user login
        content: newComment,
        rating: newRating,
      };
      // await postComment(recruiterId, commentData); // API lưu comment nếu có
      setComments((prev) => [...prev, commentData]);
      setNewComment("");
      setNewRating(5);
    } catch (err) {
      console.error("❌ Lỗi gửi bình luận:", err);
    }
  };

  if (!recruiter) {
    return <p className="text-center text-gray-500 mt-10">Đang tải thông tin công ty...</p>;
  }

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
          {/* Giới thiệu + bình luận */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-blue-50 rounded-2xl shadow p-6 border border-blue-200">
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Giới thiệu công ty</h2>
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
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
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
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {recruiter.companySocial}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bình luận */}
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
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Viết bình luận của bạn</h3>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={20}
                      fill={n <= newRating ? "#facc15" : "#e5e7eb"}
                      onClick={() => setNewRating(n)}
                      className="cursor-pointer"
                    />
                  ))}
                </div>
                <textarea
                  className="w-full border p-2 rounded mb-2"
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận..."
                />
                <button
                  onClick={handleSubmitComment}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Gửi bình luận
                </button>
              </div>
            </div>
          </div>

          {/* Người đại diện */}
          <div className="bg-green-50 rounded-2xl shadow p-6 border border-green-200">
            <h2 className="text-lg font-semibold mb-3 text-green-600">Người đại diện</h2>
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
        // Tab Vị trí tuyển dụng 2 cột
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

                  <button
                    onClick={() =>
                      navigate(`/candidate/jobs/${job.id}`, { state: { job: { ...job, companyName: recruiter.companyName } } })
                    }
                    className="mt-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition"
                  >
                    Ứng tuyển
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecruiterPageView;
