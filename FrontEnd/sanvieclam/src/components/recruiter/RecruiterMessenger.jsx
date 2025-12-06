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
import { getEmployerProfile } from "../../api/RecruiterApi";

const RecruiterMessenger = () => {
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
  const messagesContainerRef = useRef(null); // Ref cho khu vực tin nhắn

  const token = localStorage.getItem("token");
  // const [recruiterId, setRecruiterId] = useState(null); // Không sử dụng trong logic chat

  // Tải Recruiter ID (Nếu cần dùng ID để xác định người gửi ở FE)
  const loadRecruiterId = async () => {
    try {
      const data = await getEmployerProfile();
      if (data?.id) {
        // setRecruiterId(data.id); // Giữ lại nếu cần
        // console.log("Recruiter ID loaded:", data.id); // Đã xóa log không cần thiết
      }
    } catch (error) {
      console.error("Lỗi lấy employer profile:", error);
    }
  };

  useEffect(() => {
    loadRecruiterId();
  }, []);

  // Cuộn xuống dưới cùng khi có tin mới hoặc khi tải chat lần đầu
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, selectedChat]);

  // Kết nối WebSocket chỉ 1 lần khi component mount
  useEffect(() => {
    if (token) {
      // console.log("Kết nối WebSocket với token:", token.substring(0, 20) + "..."); // Đã xóa log
      connectWebSocket(
        token,
        () => {
          // console.log("WebSocket connected"); // Đã xóa log
          stompClientRef.current = window.stompClient; // Lấy từ global
        },
        (err) => console.error("WebSocket connection error:", err)
      );
    } else {
      console.warn("Không có token → Không kết nối WebSocket");
    }

    // Cleanup WebSocket khi component unmount
    return () => {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [token]);

  /** LOAD danh sách hội thoại */
  const loadConversations = async () => {
    try {
      // Chỉ set loading/error cho lần tải ban đầu
      if (conversations.length === 0) {
        setLoading(true);
        setError(null);
      }

      const data = await getConversations();

      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu hội thoại không hợp lệ");
      }

      const mapped = data.map((c) => ({
        id: c.id,
        otherName: c.otherUserName || "Ẩn danh",
        avatar: c.otherUserAvatar || "https://i.pravatar.cc/150?img=3",
        lastMessage: c.lastMessage || "Chưa có tin nhắn",
        lastMessageAt: c.lastMessageAt,
        unread: c.unreadCount || 0,
      }));

      setConversations(mapped);
    } catch (error) {
      console.error("RecruiterMessenger - Error loading conversations:", error);
      setError(
        "Không thể tải danh sách chat. Vui lòng kiểm tra kết nối hoặc đăng nhập lại."
      );
    } finally {
      setLoading(false);
    }
  };

  /** LOAD tin nhắn */
  const loadMessages = async (id) => {
    try {
      // console.log(`Tải tin nhắn cho conversation ID: ${id}`); // Đã xóa log
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
      console.error("Lỗi tải tin nhắn:", error);
      setMessages([]);
    }
  };

  /** Khi chọn chat */
  const handleSelectChat = async (conv) => {
    // console.log("Chọn conversation:", conv); // Đã xóa log
    setSelectedChat(conv);
    setMessages([]); // Xóa tin nhắn cũ ngay lập tức

    // 1. GỌI /app/chat.open → đánh dấu đã đọc
    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: "/app/chat.open",
        body: JSON.stringify({ conversationId: conv.id }),
      });
      // console.log("Gửi /app/chat.open cho conv:", conv.id); // Đã xóa log
    } else {
      console.warn("WebSocket chưa kết nối → Không gửi chat.open");
    }

    // 2. Load tin nhắn qua REST
    await loadMessages(conv.id);

    // 3. Hủy subscribe cũ
    if (subscriptionRef.current) {
      // console.log("Hủy subscribe cũ"); // Đã xóa log
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    // 4. Subscribe real-time
    // console.log("Đăng ký WebSocket cho conversation:", conv.id); // Đã xóa log
    subscriptionRef.current = subscribeConversation(conv.id, (msg) => {
      // console.log("Tin nhắn mới từ WebSocket:", msg); // Đã xóa log
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          content: msg.content,
          fromSelf: msg.fromSelf,
          time: msg.createdAt,
          avatar: msg.senderAvatar,
        },
      ]);
      // Cập nhật lại danh sách conversations khi có tin nhắn mới đến
      loadConversations();
    });

    // 5. Reload danh sách để cập nhật unread = 0 sau khi load messages
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
    return () => {
      clearInterval(intervalId);
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  // ✅ 2. TỰ ĐỘNG CHỌN CUỘC HỘI THOẠI GẦN NHẤT KHI VÀO UI
  useEffect(() => {
    // Chỉ chạy khi danh sách đã tải xong, có dữ liệu và chưa có chat nào được chọn
    if (conversations.length > 0 && !selectedChat && !loading) {
      // console.log("RecruiterMessenger - Tự động chọn cuộc hội thoại gần nhất."); // Đã xóa log

      // Sắp xếp theo thời gian tin nhắn cuối cùng (mới nhất đầu tiên)
      const sorted = [...conversations].sort(
        (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
      );

      // Tự động chọn
      handleSelectChat(sorted[0]);
    }
  }, [conversations, selectedChat, loading]);

  /** Gửi tin nhắn */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    // Kiểm tra kết nối WS trước khi gửi
    if (!stompClientRef.current?.connected) {
      console.error("WebSocket is not connected. Message not sent.");
      // Có thể thêm thông báo lỗi cho người dùng ở đây
      return;
    }

    const content = message.trim();
    const convId = selectedChat.id;

    // console.log("Gửi tin nhắn:", { convId, content }); // Đã xóa log
    sendMessageWS(convId, content);

    // Optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(), // ID tạm thời
        content,
        fromSelf: true,
        time: new Date().toISOString(),
        avatar: selectedChat.avatar, // Dùng tạm avatar của người kia, hoặc lấy avatar của nhà tuyển dụng nếu có
      },
    ]);

    setMessage("");

    // Chờ 1 chút rồi reload danh sách conversations để cập nhật lastMessage
    setTimeout(() => {
      loadConversations();
    }, 500);

    // Không cần gọi loadMessages(convId) ở đây vì tin nhắn gửi đi sẽ được WebSocket push về (Optimistic UI)
    // hoặc được cập nhật qua WS, tránh race condition.
  };

  // Lọc danh sách
  const filtered = conversations.filter((c) => {
    const matchSearch = c.otherName
      .toLowerCase()
      .includes(search.toLowerCase());
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
              className={`w-1/2 py-2 transition ${
                filter === "all"
                  ? "border-b-2 border-purple-600 text-purple-600 font-semibold"
                  : "hover:text-gray-800"
              }`}
              onClick={() => setFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={`w-1/2 py-2 transition ${
                filter === "unread"
                  ? "border-b-2 border-purple-600 text-purple-600 font-semibold"
                  : "hover:text-gray-800"
              }`}
              onClick={() => setFilter("unread")}
            >
              Chưa đọc ({conversations.filter((c) => c.unread > 0).length})
            </button>
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="flex items-center bg-white/70 rounded-full px-3 py-2 shadow-inner border border-white/30">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm ứng viên..."
                className="bg-transparent flex-1 ml-2 outline-none text-sm text-gray-700 placeholder-gray-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* LIST */}
          {/* ✅ Thêm scrollbar-thin */}
          <div className="overflow-y-auto flex-1 p-2 scrollbar-thin scrollbar-thumb-purple-400/50 scrollbar-track-transparent">
            {loading && (
              <div className="text-center p-4 text-gray-500">Đang tải...</div>
            )}
            {error && (
              <div className="text-center p-4 text-red-500">{error}</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-center p-4 text-gray-500">
                Không tìm thấy hội thoại.
              </div>
            )}
            {filtered.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectChat(conv)}
                className={`relative flex items-center gap-3 p-3 cursor-pointer rounded-xl mx-1 mb-2 transition ${
                  selectedChat?.id === conv.id
                    ? "bg-purple-500/20 border border-purple-400/40"
                    : "hover:bg-white/40"
                }`}
              >
                <img
                  src={conv.avatar}
                  className="w-12 h-12 rounded-full object-cover border border-white shadow-md"
                  alt={conv.otherName}
                />

                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold truncate ${
                      conv.unread > 0 ? "text-gray-800" : "text-gray-600"
                    }`}
                  >
                    {conv.otherName}
                  </p>
                  <p
                    className={`text-sm ${
                      conv.unread > 0
                        ? "text-gray-700 font-medium"
                        : "text-gray-500"
                    } truncate`}
                  >
                    {conv.lastMessage}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatTime(conv.lastMessageAt)}
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

        {/* KHUNG CHAT */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-white/80 via-purple-100/80 to-indigo-200/70 backdrop-blur-md">
          {selectedChat ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-white/40 bg-white/70 shadow">
                <img
                  src={selectedChat.avatar}
                  className="w-10 h-10 rounded-full border border-white shadow-md object-cover"
                  alt={selectedChat.otherName}
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
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-400/50 scrollbar-track-transparent"
              >
                {messages.map((m, i) => (
                  <div
                    key={m.id || i}
                    className={`flex ${
                      m.fromSelf ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow ${
                        m.fromSelf
                          ? "bg-purple-600 text-white"
                          : "bg-white text-gray-800"
                      } ${m.fromSelf ? "rounded-br-sm" : "rounded-tl-sm"}`}
                    >
                      {m.content}
                      <div className="text-[10px] mt-1 text-right opacity-70">
                        {formatTime(m.time)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSend}
                className="p-4 border-t border-white/40 bg-white/70 flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 rounded-full bg-white/60 border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500 transition"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!stompClientRef.current?.connected} // Disable nếu WS chưa kết nối
                />
                <button
                  type="submit"
                  className="p-2 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition disabled:bg-gray-400"
                  disabled={
                    !message.trim() || !stompClientRef.current?.connected
                  }
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
              <span className="flex items-center gap-2">
                <Send size={24} className="opacity-50" />
                Chọn một ứng viên để bắt đầu
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterMessenger;