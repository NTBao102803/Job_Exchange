// src/pages/RecruiterPage.jsx
import React, { useState, useEffect, useRef, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  Building2,
  MessageSquare,
  Star,
  Send,
  MessageCircle,
} from "lucide-react";
import { getEmployerById, getAvatarUrl } from "../../api/RecruiterApi";
import { getAllPublicJobs } from "../../api/JobApi";
import {
  getCommentsByEmployer,
  submitCandidateComment,
} from "../../api/CommentApi";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { createConversation } from "../../api/messageApi";

const RecruiterPageView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recruiterId = location.state?.recruiterId;

  const user = JSON.parse(localStorage.getItem("user"));

  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [comments, setComments] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [newComment, setNewComment] = useState("");
  const [commentRating, setCommentRating] = useState(0);

  const commentRefs = useRef({});
  const clientRef = useRef(null);

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

  const fetchComments = async (recruiterId) => {
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
        const data = await getEmployerById(recruiterId);
        setRecruiter(data);
        let link =
          data.avatarUrl || (data.id ? await getAvatarUrl(data.id) : null);
        setAvatar(link);
        fetchComments(data.authUserId);
      } catch (err) {
        console.error("Lỗi tải thông tin công ty:", err);
      }
    };
    load();
  }, [recruiterId]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await getAllPublicJobs();
        setJobs(data.filter((job) => job.employerId === recruiterId));
      } catch (err) {
        console.error("❌ Lỗi khi lấy công việc:", err);
      }
    };
    loadJobs();
  }, []);

  // ==================== WEBSOCKET ====================
  useEffect(() => {
    // 🔹 Chỉ khi đã có recruiter.authUserId
    if (!recruiter?.authUserId) {
      console.log(" chưa kết nối WS");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("❌ Không tìm thấy token, không thể kết nối WS");
      return;
    }

    const cleanToken = token.replace("Bearer ", "");
    const url = `http://localhost:8080/ws-comments?token=${encodeURIComponent(
      cleanToken
    )}`;
    console.log("🔗 Kết nối WS tới:", url);

    const client = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log(
        "✅ WebSocket connected! Subscribing to:",
        `/topic/comments/${recruiter.authUserId}`
      );

      client.subscribe(`/topic/comments/${recruiter.authUserId}`, (msg) => {
        const newComment = JSON.parse(msg.body);

        setComments((prev) => {
          if (prev.some((c) => c.id === newComment.id)) return prev;
          return addCommentToTree(prev, newComment);
        });
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log("🧹 Đóng kết nối WS");
      client.deactivate();
    };
  }, [recruiter?.authUserId]);

  // ==================== GỬI BÌNH LUẬN ====================
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    try {
      await submitCandidateComment({
        employerId: recruiter.authUserId,
        content: newComment.trim(),
        authorName: user.fullName,
        rating: commentRating === 0 ? null : commentRating,
        userId: user.id,
      });
      setNewComment("");
    } catch {
      alert("Gửi bình luận thất bại!");
    }
  };

  const handleSubmitReply = async (parentId, content) => {
    if (!content?.trim()) return;
    try {
      await submitCandidateComment({
        employerId: recruiter.authUserId,
        content: content.trim(),
        authorName: user.fullName,
        userId: user.id,
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

  const handleMessage = async () => {
    try {
      const conversation = await createConversation(jobs[0].id);

      navigate("/candidate/dashboard-candidatemessenger", {
        state: {
          conversationId: conversation.id,
          employerId: recruiter.authUserId,
        },
      });
    } catch (err) {
      console.error("❌ Lỗi tạo cuộc hội thoại:", err);
      alert("Không thể tạo cuộc hội thoại");
    }
  };

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
            <p className="text-xs text-gray-500 mt-2">
              {new Date(comment.createdAt).toLocaleString("vi-VN")}
            </p>

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
          onClick={handleMessage}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-md transition"
        >
          <MessageCircle size={18} />
          Nhắn tin
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
                <div className="flex justify-end items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">
                    Hãy đánh giá sao:
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={20}
                        fill={i <= commentRating ? "#facc15" : "#e5e7eb"}
                        className="cursor-pointer"
                        onClick={() => setCommentRating(i)}
                      />
                    ))}
                  </div>
                </div>
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
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Vị trí tuyển dụng
          </h2>
          {jobs.length === 0 ? (
            <p className="text-gray-500">
              Chưa có vị trí nào được đăng thành công.
            </p>
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
                    <p className="text-sm text-green-600 font-medium">
                      💰 {job.salary}
                    </p>
                    {job.requirements?.skills && (
                      <p
                        className="text-sm text-gray-700 truncate"
                        title={job.requirements.skills}
                      >
                        🛠 {job.requirements.skills}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/candidate/jobs/${job.id}`, {
                        state: {
                          job: { ...job, companyName: recruiter.companyName },
                        },
                      })
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
