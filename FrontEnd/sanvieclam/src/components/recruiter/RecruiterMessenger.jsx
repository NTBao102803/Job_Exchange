import React, { useEffect, useState, useRef } from "react";
import { Send, Search, MoreHorizontal } from "lucide-react";
import { sendMessageWS } from "../../services/socket.js";
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

  const messagesContainerRef = useRef(null);
  const pollCountRef = useRef(0); // Đếm số lần polling
  const pollIntervalRef = useRef(null);

  const token = localStorage.getItem("token");

  // Cuộn mượt trong khung chat
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      if (Array.isArray(data)) {
        const mapped = data.map((c) => ({
          id: c.id,
          otherName: c.otherUserName || "Ẩn danh",
          avatar: c.otherUserAvatar || "https://i.pravatar.cc/150?img=3",
          lastMessage: c.lastMessage || "Chưa có tin nhắn",
          lastMessageAt: c.lastMessageAt,
          unread: c.unreadCount || 0,
        }));
        setConversations(mapped);
      }
    } catch (error) {
      console.error("Lỗi load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (id) => {
    try {
      const data = await getMessagesByConversation(id);
      const mapped = data.map((m) => ({
        id: m.id,
        content: m.content,
        fromSelf: m.fromSelf,
        time: m.createdAt,
        avatar: m.senderAvatar || "https://i.pravatar.cc/150?img=5",
      }));
      setMessages(mapped);
    } catch (error) {
      console.error("Lỗi load messages:", error);
    }
  };

  const handleSelectChat = async (conv) => {
    if (selectedChat?.id === conv.id) return;
    setSelectedChat(conv);
    await loadMessages(conv.id);
  };

  // BẮT ĐẦU POLLING 3s x 4 lần
  const startPolling = () => {
    pollCountRef.current = 0;
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(() => {
      loadConversations();
      pollCountRef.current += 1;

      if (pollCountRef.current >= 4) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }, 3000);
  };

  // TẢI LẦN ĐẦU + BẮT ĐẦU POLLING
  useEffect(() => {
    loadConversations();
    startPolling();
  }, []);

  // TỰ ĐỘNG CHỌN CHAT MỚI NHẤT
  useEffect(() => {
    if (conversations.length > 0 && !selectedChat && !loading) {
      const sorted = [...conversations].sort(
        (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
      );
      handleSelectChat(sorted[0]);
    }
  }, [conversations, selectedChat, loading]);

  // GỬI TIN NHẮN → RELOAD + BẬT LẠI POLLING 15s
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const content = message.trim();
    setMessage("");

    try {
      await sendMessageWS(selectedChat.id, content);
      await loadConversations();
      await loadMessages(selectedChat.id);

      // BẬT LẠI POLLING 15 GIÂY SAU KHI GỬI TIN
      startPolling();
    } catch (err) {
      alert("Gửi tin nhắn thất bại!");
      setMessage(content);
    }
  };

  const filtered = conversations.filter((c) => {
    const matchSearch = c.otherName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter = filter === "unread" ? c.unread > 0 : true;
    return matchSearch && matchFilter;
  });

  const formatTime = (iso) =>
    iso
      ? new Date(iso).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return (
    <div className="h-[calc(112vh-100px)] flex items-center justify-center p-4 pt-28 bg-gradient-to-br from-indigo-200/60 via-white/70 to-purple-200/60 backdrop-blur-sm">
      <div className="flex w-full max-w-6xl h-full rounded-3xl shadow-2xl overflow-hidden border border-white/30 bg-white/30 backdrop-blur-lg">
        {/* DANH SÁCH */}
        <div className="w-1/3 flex flex-col border-r border-white/40 bg-gradient-to-b from-purple-300/70 via-purple-200/60 to-white/70 backdrop-blur-md">
          {/* ... UI danh sách giữ nguyên 100% ... */}
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

              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
              >
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

              <form
                onSubmit={handleSend}
                className="p-4 border-t flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 border rounded-full px-4 py-2"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="p-2 bg-purple-600 text-white rounded-full"
                >
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