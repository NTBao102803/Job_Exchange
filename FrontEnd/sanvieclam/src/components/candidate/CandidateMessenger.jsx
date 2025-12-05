import React, { useEffect, useState, useRef } from "react";
import { Send, Search, MoreHorizontal } from "lucide-react";
import {
  connectWebSocket,
  subscribeConversation,
  sendMessageWS,
} from "../../services/socket";
import {
  getConversations,
  getMessagesByConversation,
} from "../../api/messageApi";
import { useLocation } from "react-router-dom";

const CandidateMessenger = () => {
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
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const candidateId = Number(localStorage.getItem("userId"));

  const location = useLocation();
  const navigatedConversationId = location.state?.conversationId;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // LOG 2: WebSocket kết nối
  useEffect(() => {
    if (token) {
      connectWebSocket(
        token,
        () => {
          stompClientRef.current = window.stompClient; // Lấy từ global
        },
        (err) => console.error("WebSocket error:", err)
      );
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
        otherName: c.otherUserName || "Ẩn danh", // ĐÚNG FIELD
        avatar: c.otherUserAvatar || "https://i.pravatar.cc/150?img=1",
        lastMessage: c.lastMessage || "Chưa có tin nhắn",
        lastMessageAt: c.lastMessageAt, // ĐÚNG FIELD
        unread: c.unreadCount || 0, // ĐÚNG FIELD
      }));

      setConversations(mapped);
    } catch (error) {
      console.error("CandidateMessenger - Lỗi load conversations:", error);
      setError("Không tải được tin nhắn. Vui lòng thử lại.");
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
        fromSelf: m.fromSelf,
        time: m.createdAt,
        avatar: m.senderAvatar || "https://i.pravatar.cc/150?img=5",
      }));

      setMessages(mapped);
    } catch (error) {
      console.error("CandidateMessenger - Lỗi load messages:", error);
    }
  };

  /** Chọn chat */
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
          fromSelf: msg.fromSelf, // DÙNG TỪ BACKEND
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

  // ✅ 2. TỰ ĐỘNG CHỌN CUỘC HỘI THOẠI: Ưu tiên conversationId từ navigation state
  useEffect(() => {
    // Chỉ chạy khi danh sách đã tải xong, chưa có chat nào được chọn, và không còn loading
    if (conversations.length > 0 && !selectedChat && !loading) {
      let conversationToSelect = null;

      // 1. Ưu tiên: Conversation ID từ navigation state (khi click nút Nhắn tin)
      if (navigatedConversationId) {
        conversationToSelect = conversations.find(
          (c) => c.id === navigatedConversationId
        );
        if (conversationToSelect) {
          console.log(
            "CandidateMessenger - Trỏ tới cuộc hội thoại đã tạo từ navigation state:",
            navigatedConversationId
          );
        }
      }

      // 2. Fallback: Cuộc hội thoại gần nhất (khi click icon Message trên Header)
      if (!conversationToSelect) {
        const sorted = [...conversations].sort(
          (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
        );
        conversationToSelect = sorted[0];
      }

      // 3. Tiến hành chọn
      if (conversationToSelect) {
        handleSelectChat(conversationToSelect);
      }
    }
  }, [conversations, selectedChat, loading, navigatedConversationId]);

  /** Gửi tin nhắn */
  const handleSend = async (e) => {
    // <-- thêm async
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const content = message.trim();
    const convId = selectedChat.id;

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
  const filteredConversations = conversations.filter((c) => {
    const matchSearch = c.otherName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter = filter === "unread" ? c.unread > 0 : true;
    return matchSearch && matchFilter;
  });

  // Format time
  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-[calc(112vh-100px)] flex items-center justify-center p-4 pt-28 bg-gradient-to-br from-blue-200/60 via-white/70 to-indigo-200/60 backdrop-blur-sm">
      <div className="flex w-full max-w-6xl h-full rounded-3xl shadow-2xl overflow-hidden border border-white/30 bg-white/30 backdrop-blur-lg">
        {/* LIST */}
        <div className="w-1/3 flex flex-col border-r border-white/40 bg-gradient-to-b from-blue-300/70 via-blue-200/60 to-white/70 backdrop-blur-md relative">
          <div className="p-4 border-b border-white/40 flex items-center justify-between bg-white/70 backdrop-blur-md shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">Đoạn chat</h2>
            <MoreHorizontal className="text-gray-500" />
          </div>

          {/* Filter */}
          <div className="flex justify-around border-b border-white/40 text-sm font-medium text-gray-600 bg-white/40 backdrop-blur-sm">
            <button
              onClick={() => setFilter("all")}
              className={`w-1/2 py-2 transition ${
                filter === "all"
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : "hover:text-gray-800"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`w-1/2 py-2 transition ${
                filter === "unread"
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : "hover:text-gray-800"
              }`}
            >
              Chưa đọc
            </button>
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="flex items-center bg-white/70 rounded-full px-3 py-2 shadow-inner backdrop-blur-sm border border-white/30">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="bg-transparent flex-1 ml-2 outline-none text-sm text-gray-700 placeholder-gray-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* LIST */}
          <div className="overflow-y-auto flex-1 p-2 scrollbar-thin scrollbar-thumb-gray-300/60 scrollbar-track-transparent">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectChat(conv)}
                className={`relative flex items-center gap-3 p-3 cursor-pointer rounded-xl mx-1 mb-2 transition ${
                  selectedChat?.id === conv.id
                    ? "bg-blue-500/20 border border-blue-400/40"
                    : "hover:bg-white/40"
                }`}
              >
                <img
                  src={conv.avatar}
                  className="w-12 h-12 rounded-full border border-white shadow-md"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-gray-800">
                    {conv.otherName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {conv.lastMessage}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatTime(conv.lastMessageAt)} {/* ĐÚNG FIELD */}
                  </span>
                  {conv.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT PANEL */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-white/80 via-blue-100/80 to-indigo-200/70 backdrop-blur-md relative">
          {selectedChat ? (
            <>
              {/* HEADER */}
              <div className="flex items-center gap-3 p-4 border-b border-white/40 bg-white/70 shadow">
                <img
                  src={selectedChat.avatar}
                  className="w-10 h-10 rounded-full border border-white shadow-md"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {selectedChat.otherName}
                  </p>
                  <p className="text-xs text-green-500 font-medium">
                    Đang hoạt động
                  </p>
                </div>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.fromSelf ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow ${
                        m.fromSelf
                          ? "bg-blue-600 text-white"
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
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <form
                onSubmit={handleSend}
                className="p-4 border-t border-white/40 bg-white/70 flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 rounded-full bg-white/60 border border-gray-300 outline-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-full shadow-md"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
              Chọn một cuộc trò chuyện để bắt đầu
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateMessenger;
