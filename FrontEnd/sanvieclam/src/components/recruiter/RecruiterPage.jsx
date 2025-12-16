// src/pages/RecruiterPage.jsx
import React, { useState, useEffect, useRef, memo } from "react";
import {
  MapPin,
  Users,
  Building2,
  MessageSquare,
  Star,
  Send,
  Pencil,
} from "lucide-react";
import {
  getEmployerProfile,
  getAllJobsByEmail,
  getAvatarUrl,
} from "../../api/RecruiterApi";
import { getCommentsByEmployer, submitComment } from "../../api/CommentApi";
import JobPreviewModal from "./JobPreviewModal";
import { useNavigate } from "react-router-dom";
import {
  connectCommentSocket,
  subscribeComments,
  disconnectCommentSocket,
} from "../../services/sockets/commentSocket";

const RecruiterPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const recruiterId = user?.id;

  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [comments, setComments] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [newComment, setNewComment] = useState("");
  const [jobData, setJobData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const commentRefs = useRef({});
  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);

  // ==================== HELPER ====================
  const addCommentToTree = (tree, comment) => {
    if (!comment.parentId)
      return [...tree, { ...comment, replies: comment.replies || [] }];
    return tree.map((c) => {
      if (c.id === comment.parentId)
        return {
          ...c,
          replies: [...(c.replies || []), { ...comment, replies: [] }],
        };
      if (c.replies?.length)
        return { ...c, replies: addCommentToTree(c.replies, comment) };
      return c;
    });
  };

  const fetchComments = async () => {
    try {
      const data = await getCommentsByEmployer(recruiterId);
      setComments(data);
    } catch (err) {
      console.error("Lỗi tải bình luận:", err);
    }
  };

  // ==================== LOAD DATA ====================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getEmployerProfile(recruiterId);
        setRecruiter(data);
        let link =
          data.avatarUrl ||
          (data.authUserId ? await getAvatarUrl(data.authUserId) : null);
        setAvatar(link);
        fetchComments();
      } catch (err) {
        console.error("Lỗi tải thông tin công ty:", err);
      }
    };
    load();
  }, [recruiterId]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getAllJobsByEmail();
        setJobs(data.filter((j) => j.status === "APPROVED"));
      } catch (err) {
        console.error("Lỗi tải việc làm:", err);
      }
    };
    loadJobs();
  }, []);

  // ==================== WEBSOCKET ====================
  const token = localStorage.getItem("token"); // Lấy token

  useEffect(() => {
    if (!recruiterId || !token) return;

    connectCommentSocket(token, () => {
      // ← Truyền token vào
      if (subscriptionRef.current) return;

      subscriptionRef.current = subscribeComments(recruiterId, (newComment) => {
        setComments((prev) => {
          if (prev.some((c) => c.id === newComment.id)) return prev;
          return addCommentToTree(prev, newComment);
        });

        // Scroll vào comment mới
        setTimeout(() => {
          const el =
            commentRefs.current[newComment.id] ||
            commentRefs.current[newComment.parentId];
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      });
    });

    return () => {
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
        } catch {}
        subscriptionRef.current = null;
      }
      disconnectCommentSocket();
    };
  }, [recruiterId, token]);

  // ==================== GỬI BÌNH LUẬN ====================
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    try {
      await submitComment({
        employerId: recruiterId,
        content: newComment.trim(),
        authorName: recruiter.companyName,
      });
      setNewComment("");
    } catch {
      alert("Gửi bình luận thất bại!");
    }
  };

  const handleSubmitReply = async (parentId, content) => {
    if (!content?.trim()) return;
    try {
      await submitComment({
        employerId: recruiterId,
        content: content.trim(),
        authorName: recruiter.companyName,
        parentId,
      });
    } catch {
      alert("Trả lời thất bại!");
    }
  };

  // ==================== TÍNH ĐIỂM TRUNG BÌNH ====================
  const companyRating = (() => {
    if (!comments.length) return 0;
    const rated = comments.filter((c) => c.rating != null);
    if (!rated.length) return 0;
    const avg = rated.reduce((s, c) => s + c.rating, 0) / rated.length;

    return Math.round(avg);
  })();

  // tính thời gian
  const displayTime = new Date(comment.createdAt).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Tùy chọn, dùng định dạng 24h
  });
  // ==================== COMPONENT COMMENT ====================
  const CommentItem = memo(({ comment }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [showReplies, setShowReplies] = useState(false);
    const sendReply = () => {
      handleSubmitReply(comment.id, replyText);
      setReplyText("");
      setShowReplyForm(false);
    };

    return (
      <div
        ref={(el) => (commentRefs.current[comment.id] = el)}
        className="border-b border-gray-200 pb-6 scroll-mt-32"
      >
        <div className="flex gap-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            {comment.authorName?.[0] || "?"}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="font-bold text-gray-800">{comment.authorName}</p>
              {comment.rating != null && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < comment.rating ? "#facc15" : "#e5e7eb"}
                      strokeWidth={1.5}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">
                    ({comment.rating})
                  </span>
                </div>
              )}
            </div>

            <p
              className="text-gray-700 mt-2 leading-relaxed"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {comment.content}
            </p>
            <p className="text-xs text-gray-500 mt-2">{displayTime}</p>

            <div className="flex gap-6 mt-3 text-sm">
              <button
                onClick={() => setShowReplyForm((v) => !v)}
                className="text-blue-600 hover:text-blue-800 font-medium transition"
              >
                Trả lời
              </button>
              {comment.replies?.length > 0 && (
                <button
                  onClick={() => setShowReplies((v) => !v)}
                  className="text-gray-600 hover:text-gray-800 font-medium transition"
                >
                  {showReplies ? "Ẩn" : `Xem ${comment.replies.length} trả lời`}
                </button>
              )}
            </div>

            {showReplyForm && (
              <div className="mt-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold shadow">
                  C
                </div>
                <div className="flex-1">
                  <textarea
                    autoFocus
                    rows={3}
                    placeholder="Viết câu trả lời của công ty..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendReply();
                      }
                    }}
                  />
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={() => {
                        setReplyText("");
                        setShowReplyForm(false);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={sendReply}
                      disabled={!replyText.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 shadow-md"
                    >
                      <Send size={16} /> Gửi trả lời
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showReplies && comment.replies?.length > 0 && (
              <div className="ml-14 mt-6 space-y-6 border-l-2 border-blue-100 pl-6">
                {comment.replies.map((r) => (
                  <CommentItem key={r.id} comment={r} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });

  if (!recruiter)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Đang tải thông tin công ty...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 pt-32 font-sans bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 mb-8 flex flex-col md:flex-row items-center gap-6 justify-between">
        {/* LEFT: Avatar + Info */}
        <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
          <img
            src={avatar || "/default-company.png"}
            alt="Logo"
            className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-2xl"
          />

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {recruiter.companyName}
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
              {companyRating !== 0 ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < companyRating ? "#facc15" : "#e5e7eb"}
                    />
                  ))}
                  <span className="text-md font-medium text-gray-700 ml-2">
                    {companyRating} / 5
                  </span>
                </>
              ) : (
                <span className="text-md font-medium text-gray-500 ml-2">
                  Chưa có đánh giá
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 text-sm">
              <span className="flex items-center gap-1">
                <Building2 size={18} />{" "}
                {recruiter.companyField || "Chưa cập nhật"}
              </span>
              <span className="flex items-center gap-1">
                <Users size={18} /> {recruiter.companySize || "0-20"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={18} /> {recruiter.companyAddress || "Không rõ"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Edit Button */}
        <button
          onClick={() => navigate("/recruiter/recruiterprofile")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition"
        >
          <Pencil size={18} />
          Chỉnh sửa
        </button>
      </div>

      {/* TAB */}
      <div className="flex border-b-2 border-gray-300 mb-8">
        <button
          onClick={() => setActiveTab("about")}
          className={`px-6 py-3 text-lg font-semibold transition ${
            activeTab === "about"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Giới thiệu
        </button>
        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-6 py-3 text-lg font-semibold transition ${
            activeTab === "jobs"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Vị trí tuyển dụng
        </button>
      </div>

      {activeTab === "about" ? (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 shadow">
              <h2 className="text-xl font-bold text-blue-700 mb-2">
                Giới thiệu công ty
              </h2>
              <p className="text-gray-700 text-sm whitespace-pre-line">
                {recruiter.companyDescription || "Chưa có mô tả công ty."}
              </p>
              {(recruiter.companyWebsite || recruiter.companySocial) && (
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  {recruiter.companyWebsite && (
                    <p>
                      Website:{" "}
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
                      Mạng xã hội:{" "}
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

            <div className="bg-white rounded-2xl shadow p-5 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare className="text-yellow-600" size={24} /> Bình
                luận & đánh giá
              </h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-8 text-sm">
                    Chưa có bình luận nào
                  </p>
                ) : (
                  comments.map((c) => <CommentItem key={c.id} comment={c} />)
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <textarea
                  className="w-full border-2 border-gray-300 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                  rows={3}
                  placeholder="Viết bình luận công khai..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSubmitComment}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow transition flex items-center gap-2"
                  >
                    <Send size={16} /> Gửi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
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
                <p className="text-sm text-gray-500">
                  {recruiter.position || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow p-5 border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Vị trí tuyển dụng
          </h2>
          {jobs.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-sm">
              Chưa có tin tuyển dụng nào được duyệt.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setJobData(job);
                    setShowPreview(true);
                  }}
                  className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition cursor-pointer transform hover:scale-105"
                >
                  <h3 className="text-lg font-bold text-indigo-700 mb-1">
                    {job.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">
                    {recruiter.companyName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Location: {job.location} • {job.jobType}
                  </p>
                  <p className="text-green-600 font-bold text-sm">
                    Salary: {job.salary}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-3xl font-bold z-10"
            >
              ×
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
