import React, { useEffect, useState, useRef } from "react";
import { Send, Search, MoreHorizontal } from "lucide-react";
import {
  connectWebSocket,
  subscribeConversation,
  sendMessageWS,
} from "../../services/socket.js";
import {
  getConversations,
  getMessagesByConversation,
} from "../../api/messageApi.jsx";
import {getEmployerProfile} from "../../api/RecruiterApi";

const RecruiterMessenger = () => {
  const [recruiterId, setRecruiterId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subscriptionRef = useRef(null);
  const stompClientRef = useRef(null);

  const token = localStorage.getItem("token");
  const loadRecruiterId = async () => {
    try {
      const data = await getEmployerProfile();
      if (data?.id) {
        setRecruiterId(data.id);
      }
    } catch (error) {
      console.error("Lỗi lấy employer profile:", error);
    }
  };

  useEffect(() => {
    loadRecruiterId();
  }, []);
  // LOG 2: WebSocket kết nối
  useEffect(() => {
    if (token) {
      console.log("Kết nối WebSocket với token:", token.substring(0, 20) + "...");
      connectWebSocket(
        token,
        () => {
          console.log("WebSocket connected");
          stompClientRef.current = window.stompClient;
        },
        (err) => console.error("WebSocket error:", err)
      );
    } else {
      console.warn("Không có token → Không kết nối WebSocket");
    }
  }, [token]);

  /** LOAD danh sách hội thoại */
  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getConversations();
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu hội thoại không hợp lệ");
      }

      const mapped = data.map((c) => ({
        id: c.id,
        otherName: c.otherUserName || "Ẩn danh",           // ĐÚNG FIELD
        avatar: c.otherUserAvatar || "https://i.pravatar.cc/150?img=3",
        lastMessage: c.lastMessage || "Chưa có tin nhắn",
        lastMessageAt: c.lastMessageAt,
        unread: c.unreadCount || 0,                    // ĐÚNG FIELD
      }));

      setConversations(mapped);
    } catch (error) {
      console.error("Lỗi khi tải danh sách hội thoại:", error);
      setError("Không thể tải danh sách chat. Vui lòng kiểm tra kết nối hoặc đăng nhập lại.");
    } finally {
      setLoading(false);
    }
  };

  /** LOAD tin nhắn */
  const loadMessages = async (id) => {
    try {
      const data = await getMessagesByConversation(id);
      const mapped = data.map((m) => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        fromSelf: m.fromSelf,                          // DÙNG TỪ BACKEND
        time: m.createdAt,
        avatar: m.senderAvatar || "https://i.pravatar.cc/150?img=5",
      }));

      setMessages(mapped);
    } catch (error) {
      console.error("Lỗi tải tin nhắn:", error);
    }
  };

  /** Khi chọn chat */
  const handleSelectChat = async (conv) => {
    setSelectedChat(conv);

    // 1. GỌI /app/chat.open → đánh dấu đã đọc + load tin nhắn
    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: "/app/chat.open",
        body: JSON.stringify({ conversationId: conv.id }),
      });
    } else {
      console.warn("WebSocket chưa kết nối → dùng REST");
    }

    // 2. Load tin nhắn qua REST
    await loadMessages(conv.id);

    // 3. Hủy subscribe cũ
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // 4. Subscribe real-time
    subscriptionRef.current = subscribeConversation(conv.id, (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          content: msg.content,
          fromSelf: msg.fromSelf,                  // DÙNG TỪ BACKEND
          time: msg.createdAt,
          avatar: msg.senderAvatar,
        },
      ]);
    });
    await loadConversations();
  };

  // ✅ 1. TẢI DANH SÁCH BAN ĐẦU VÀ CẬP NHẬT MỖI 3 GIÂY
  useEffect(() => {
    loadConversations(); // Initial load

    // Cài đặt interval 3s
    const intervalId = setInterval(() => {
      loadConversations();
    }, 3000); 

    // Cleanup khi component unmount
    return () => clearInterval(intervalId); 
  }, []);

  // ✅ 2. TỰ ĐỘNG CHỌN CUỘC HỘI THOẠI GẦN NHẤT KHI VÀO UI
  useEffect(() => {
    // Chỉ chạy khi danh sách đã tải xong, có dữ liệu và chưa có chat nào được chọn
    if (conversations.length > 0 && !selectedChat && !loading) {
      console.log("RecruiterMessenger - Tự động chọn cuộc hội thoại gần nhất.");

      // Sắp xếp theo thời gian tin nhắn cuối cùng (mới nhất đầu tiên)
      const sorted = [...conversations].sort(
        (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
      );

      // Tự động chọn
      handleSelectChat(sorted[0]);
    }
  }, [conversations, selectedChat, loading]);

  /** Gửi tin nhắn */
    const handleSend = async (e) => {   // <-- thêm async
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;
  
    const content = message.trim();
    const convId = selectedChat.id;
  
    console.log("Gửi tin nhắn:", { convId, content });
    sendMessageWS(convId, content);
  
    // Optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content,
        fromSelf: true,
        time: new Date().toISOString(),
        avatar: "https://i.pravatar.cc/150?img=1",
      },
    ]);
  
    setMessage("");
  
    // Reload dữ liệu: tin nhắn + danh sách conversation
    try {
      await loadMessages(convId);
      await loadConversations();
    } catch (err) {
      console.error("Lỗi khi reload sau gửi tin nhắn:", err);
    }
  };

  // Tải danh sách khi mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Lọc danh sách
  const filtered = conversations.filter((c) => {
    const matchSearch = c.otherName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "unread" ? c.unread > 0 : true;
    return matchSearch && matchFilter;
  });

  // Format thời gian
  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log("Danh sách sau lọc:", filtered.length);

  return (
    <div className="h-[calc(112vh-100px)] flex items-center justify-center p-4 pt-28 bg-gradient-to-br from-indigo-200/60 via-white/70 to-purple-200/60 backdrop-blur-sm">
      <div className="flex w-full max-w-6xl h-full rounded-3xl shadow-2xl overflow-hidden border border-white/30 bg-white/30 backdrop-blur-lg">

        {/* DANH SÁCH */}
        <div className="w-1/3 flex flex-col border-r border-white/40 bg-gradient-to-b from-purple-300/70 via-purple-200/60 to-white/70 backdrop-blur-md">

          {/* Header */}
          <div className="p-4 border-b border-white/40 flex items-center justify-between bg-white/70 backdrop-blur-md shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">Đoạn chat</h2>
            <MoreHorizontal className="text-gray-500 cursor-pointer" />
          </div>

          {/* Filter */}
          <div className="flex justify-around border-b border-white/40 text-sm font-medium text-gray-600 bg-white/40">
            <button
              className={`w-1/2 py-2 ${filter === "all" ? "border-b-2 border-purple-600 text-purple-600" : ""}`}
              onClick={() => setFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={`w-1/2 py-2 ${filter === "unread" ? "border-b-2 border-purple-600 text-purple-600" : ""}`}
              onClick={() => setFilter("unread")}
            >
              Chưa đọc
            </button>
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="flex items-center bg-white/70 rounded-full px-3 py-2 shadow-inner">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm ứng viên..."
                className="bg-transparent flex-1 ml-2 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* LIST */}
          <div className="overflow-y-auto flex-1 p-2">
            {filtered.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectChat(conv)}
                className={`relative flex items-center gap-3 p-3 cursor-pointer rounded-xl mx-1 mb-2 ${
                  selectedChat?.id === conv.id
                    ? "bg-purple-500/20 border border-purple-400"
                    : "hover:bg-white/40"
                }`}
              >
                <img
                  src={conv.avatar}
                  className="w-12 h-12 rounded-full object-cover border"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{conv.otherName}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {conv.lastMessage}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400">
                    {formatTime(conv.lastMessageAt)}
                  </span>
                  {conv.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KHUNG CHAT */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-white/80 via-purple-100/80 to-indigo-200/70">
          {selectedChat ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-white/40">
                <img
                  src={selectedChat.avatar}
                  className="w-10 h-10 rounded-full border"
                />
                <div>
                  <p className="font-semibold">{selectedChat.otherName}</p>
                  <p className="text-xs text-green-500">Đang hoạt động</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.fromSelf ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow ${
                        m.fromSelf
                          ? "bg-purple-600 text-white"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      {m.content}
                      <div className="text-[10px] mt-1 text-right opacity-70">
                        {formatTime(m.time)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="p-4 border-t flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 border rounded-full px-4 py-2"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="p-2 bg-purple-600 text-white rounded-full">
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Chọn một ứng viên để bắt đầu
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterMessenger;