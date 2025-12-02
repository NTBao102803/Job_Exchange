// src/pages/RecruiterPageView.tsx
import { Client } from "@stomp/stompjs";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Building2, MapPin, MessageCircle, Send, Star, Users } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import SockJS from "sockjs-client";
import { getCommentsByEmployer, submitCandidateComment } from "../api/CommentApi";
import { getAllPublicJobs } from "../api/JobApi";
import { getAvatarUrl, getEmployerById } from "../api/RecruiterApi";
import JobDetail from "../components/jobdetail";
import { useMenu } from "../context/MenuContext";

interface RecruiterPageViewProps {
  employerId: number;
  onBack: () => void;
}

export default function RecruiterPageView({ employerId, onBack }: RecruiterPageViewProps) {
  const { openMenu } = useMenu();
  const router = useRouter();
  const recruiterId = employerId;

  const [recruiter, setRecruiter] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "jobs">("about");
  const [newComment, setNewComment] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const clientRef = useRef<Client | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  // ==================== Load user info ====================
  useEffect(() => {
    const loadUser = async () => {
      const id = await SecureStore.getItemAsync("userId");
      const name = await SecureStore.getItemAsync("userName");
      setUserId(id);
      setUserName(name);
    };
    loadUser();
  }, []);

  // ==================== Load recruiter info + avatar + comments ====================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await getEmployerById(recruiterId);
        setRecruiter(r);
        const ava = r.avatarUrl || (r.id ? await getAvatarUrl(r.id) : null);
        setAvatar(ava);

        const c = await getCommentsByEmployer(r.authUserId);
        setComments(c);
      } catch (err) {
        console.log("Error load recruiter:", err);
      }
    };
    fetchData();
  }, [recruiterId]);

  // ==================== Load jobs ====================
  useEffect(() => {
    const loadJobs = async () => {
      const data = await getAllPublicJobs();
      setJobs(data.filter(j => j.employerId === recruiterId));
    };
    loadJobs();
  }, [recruiterId]);

  // ==================== Helpers ====================
  const addReplyToTree = (tree: any[], reply: any): any[] => {
    if (!reply.parentId) return [...tree, { ...reply, replies: [] }];
    return tree.map(c => {
      if (c.id === reply.parentId) {
        return { ...c, replies: [...(c.replies || []), { ...reply, replies: [] }] };
      }
      if (c.replies?.length) {
        return { ...c, replies: addReplyToTree(c.replies, reply) };
      }
      return c;
    });
  };

  const mergeComment = (prev: any[], incoming: any): any[] => {
    const exists = (arr: any[], id: any): boolean =>
      arr.some(c => c.id === id || (c.replies && exists(c.replies, id)));

    if (exists(prev, incoming.id)) return prev;

    if (incoming.parentId) {
      return addReplyToTree(prev, incoming);
    }

    return [...prev, { ...incoming, replies: [] }];
  };

  // ==================== WebSocket STOMP + SockJS ====================
  useEffect(() => {
    if (!recruiter?.authUserId) return;

    const connectWS = async () => {
      const tokenRaw = await SecureStore.getItemAsync("token");
      if (!tokenRaw) return;
      const token = tokenRaw.replace("Bearer ", "");
      const url = `http://192.168.1.200:8080/ws-comments?token=${encodeURIComponent(token)}`;

      const client = new Client({
        webSocketFactory: () => new SockJS(url),
        reconnectDelay: 5000,
      });

      client.onConnect = () => {
        console.log("✅ WS connected via STOMP!");
        client.subscribe(`/topic/comments/${recruiter.authUserId}`, (msg) => {
          try {
            const incomingComment = JSON.parse(msg.body);
            setComments(prev => mergeComment(prev, incomingComment));

            // Auto scroll khi có comment mới
            setTimeout(() => {
              scrollRef.current?.scrollToEnd({ animated: true });
            }, 100);
          } catch (err) {
            console.log("❌ WS message parse error:", err);
          }
        });
      };

      client.onStompError = (frame) => {
        console.log("❌ STOMP error:", frame);
      };

      client.activate();
      clientRef.current = client;
    };

    connectWS();

    return () => {
      console.log("🧹 WS disconnecting...");
      clientRef.current?.deactivate();
    };
  }, [recruiter?.authUserId]);

  // ==================== Submit comment ====================
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !userId) return;
    try {
      const newCmt = {
        employerId: recruiter.authUserId,
        content: newComment.trim(),
        authorName: userName || "Người dùng",
        rating: commentRating || null,
        userId: Number(userId),
      };
      await submitCandidateComment(newCmt);

      // Hiển thị ngay
      setNewComment("");
      setCommentRating(0);

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch {
      alert("Gửi bình luận thất bại!");
    }
  };

  // ==================== Company rating ====================
  const companyRating = (() => {
    if (!comments.length) return 0;
    const rated = comments.filter(c => c.rating != null);
    if (!rated.length) return 0;
    return Math.round(rated.reduce((sum, c) => sum + c.rating, 0) / rated.length);
  })();

  // ==================== Message recruiter ====================
  const handleMessage = () => {
    router.replace("/messages");
  };

  // ==================== CommentItem ====================
  const CommentItem = ({ comment }: { comment: any }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [showReplies, setShowReplies] = useState(false);

    const handleSubmitReply = async () => {
      if (!replyText.trim() || !userId) return;
      try {
        const newReply = {
          employerId: recruiter.authUserId,
          content: replyText.trim(),
          authorName: userName || "Người dùng",
          userId: Number(userId),
          parentId: comment.id,
        };
        await submitCandidateComment(newReply);

        setShowReplyForm(false);
        setShowReplies(true);

        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } catch {
        alert("Gửi trả lời thất bại!");
      }
    };

    return (
      <View className="border-b border-gray-200 pb-4 mb-2">
        <View className="flex-row gap-3 items-center mb-2">
          <View className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Text className="text-white font-bold text-lg">{comment.authorName?.[0]}</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-gray-800">{comment.authorName}</Text>
            {comment.rating != null && (
              <View className="flex-row mt-1 items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < comment.rating ? "#facc15" : "#e5e7eb"} />
                ))}
                <Text className="text-gray-600 text-sm ml-1">({comment.rating})</Text>
              </View>
            )}
          </View>
        </View>

        <Text className="text-gray-700 mb-2">{comment.content}</Text>

        <View className="flex-row justify-start items-center gap-4 mb-2">
          {comment.replies?.length > 0 && (
            <TouchableOpacity onPress={() => setShowReplies(!showReplies)}>
              <Text className="text-blue-600 text-sm">
                {showReplies ? "Ẩn trả lời" : `Xem ${comment.replies.length} trả lời`}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setShowReplyForm(!showReplyForm)}>
            <Text className="text-blue-600 text-sm">Trả lời</Text>
          </TouchableOpacity>
        </View>

        {showReplyForm && (
          <View className="ml-12 mb-2">
            <TextInput
              placeholder="Viết trả lời..."
              value={replyText}
              onChangeText={setReplyText}
              multiline
              className="w-full p-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200"
            />
            <TouchableOpacity
              onPress={handleSubmitReply}
              className="mt-1 bg-blue-600 px-3 py-1 rounded-xl flex-row items-center justify-center gap-1"
            >
              <Send size={14} color="white" />
              <Text className="text-white text-sm font-bold">Gửi</Text>
            </TouchableOpacity>
          </View>
        )}

        {showReplies &&
          comment.replies?.map((r: any) => (
            <View key={r.id} className="ml-12">
              <CommentItem comment={r} />
            </View>
          ))}
      </View>
    );
  };

  // ==================== Render ====================
  if (!recruiter)
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text>Đang tải thông tin công ty...</Text>
      </View>
    );

  if (selectedJob) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F7F7F9" }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <JobDetail
            job={selectedJob}
            employer={{
              fullName: selectedJob.companyName || "Công ty chưa có",
              email: selectedJob.employerEmail || "",
              phone: selectedJob.employerPhone || "",
            }}
            onClose={() => setSelectedJob(null)}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        className="flex-1 bg-gray-50 pt-1 px-4"
        contentContainerStyle={{ paddingBottom: 70 }}
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={onBack}>
          <Text className="text-blue-600 mb-3 text-lg">← Quay lại</Text>
        </TouchableOpacity>

        {/* Header */}
        <View className="bg-white rounded-2xl shadow p-4 flex-row items-center gap-4 mb-6">
          <Image
            source={{ uri: avatar || "https://placehold.co/100" }}
            className="w-20 h-20 rounded-xl border-2 border-white"
          />
          <View className="flex-1">
            <Text className="text-l font-bold text-gray-800">{recruiter.companyName}</Text>
            <View className="flex-row items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < companyRating ? "#facc15" : "#e5e7eb"} />
              ))}
              <Text className="text-gray-700 ml-2 text-sm">{companyRating > 0 ? `${companyRating} / 5` : "Chưa có đánh giá"}</Text>
            </View>
            <View className="flex-row flex-wrap gap-2 mt-2">
              <View className="flex-row items-center gap-1">
                <Building2 size={14} />
                <Text className="text-gray-600 text-sm">{recruiter.companyField || "Chưa cập nhật"}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Users size={14} />
                <Text className="text-gray-600 text-sm">{recruiter.companySize || "0-20"}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MapPin size={14} />
                <Text className="text-gray-600 text-sm">{recruiter.companyAddress || "Không rõ"}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleMessage} className="mt-2 bg-green-600 px-4 py-2 rounded-xl flex-row items-center justify-center gap-1">
              <MessageCircle size={16} color="white" />
              <Text className="text-white font-medium text-sm">Nhắn tin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-gray-300 mb-4">
          <TouchableOpacity onPress={() => setActiveTab("about")} className="mr-6 pb-2">
            <Text className={`text-base font-semibold ${activeTab === "about" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}>Giới thiệu</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("jobs")} className="pb-2">
            <Text className={`text-base font-semibold ${activeTab === "jobs" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}>Vị trí tuyển dụng</Text>
          </TouchableOpacity>
        </View>

        {activeTab === "about" ? (
          <View className="space-y-6">
            {/* Company info */}
            <View className="bg-white rounded-xl p-4 border border-blue-200 shadow">
              <Text className="text-lg font-bold text-blue-700 mb-2">Giới thiệu công ty</Text>
              <Text className="text-gray-700 text-sm">{recruiter.companyDescription || "Chưa có mô tả công ty."}</Text>
              {(recruiter.companyWebsite || recruiter.companySocial) && (
                <View className="mt-3 space-y-1">
                  {recruiter.companyWebsite && <Text className="text-blue-500 underline text-sm">Website: {recruiter.companyWebsite}</Text>}
                  {recruiter.companySocial && <Text className="text-blue-500 underline text-sm">Mạng xã hội: {recruiter.companySocial}</Text>}
                </View>
              )}
            </View>

            {/* Comments & Ratings */}
            <View className="bg-white rounded-xl p-4 border border-gray-200 shadow space-y-3">
              <Text className="text-lg font-bold text-blue-700 mb-2">Đánh giá & Bình luận</Text>

              {comments.length === 0 ? (
                <Text className="text-gray-500 text-center py-4 text-sm">Chưa có bình luận nào</Text>
              ) : comments.map(c => <CommentItem key={c.id} comment={c} />)}

              <View className="mt-3">
                <View className="flex-row items-center gap-2 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <TouchableOpacity key={i} onPress={() => setCommentRating(i)}>
                      <Star size={18} fill={i <= commentRating ? "#facc15" : "#e5e7eb"} />
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  value={newComment}
                  onChangeText={setNewComment}
                  placeholder="Viết bình luận..."
                  multiline
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 text-sm"
                  onFocus={() => {
                    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
                  }}
                />
                <TouchableOpacity onPress={handleSubmitComment} className="mt-2 bg-blue-600 px-4 py-2 rounded-xl items-center flex-row justify-center gap-1">
                  <Send size={16} color="white"/>
                  <Text className="text-white font-bold text-sm">Gửi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View className="space-y-4">
            {jobs.length === 0 ? (
              <Text className="text-gray-500 text-sm">Chưa có vị trí nào được đăng thành công.</Text>
            ) : jobs.map(job => (
              <View key={job.id} className="p-4 bg-white rounded-xl border border-gray-200 shadow mb-2">
                <Text className="text-indigo-700 font-semibold text-base mb-1">{job.title}</Text>
                <Text className="text-gray-600 text-sm mb-1">📍 {job.location} | ⏰ {job.jobType}</Text>
                <Text className="text-green-600 font-medium text-sm mb-2">💰 {job.salary}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedJob(job)}
                  className="bg-blue-600 px-3 py-2 rounded-xl items-center"
                >
                  <Text className="text-white font-bold text-sm">Ứng tuyển</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
  },
});
