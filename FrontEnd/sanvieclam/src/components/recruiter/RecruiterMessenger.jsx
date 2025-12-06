import React, { useEffect, useState, useRef } from "react";
import { Send, Search, MoreHorizontal } from "lucide-react";
import {
  connectWebSocket,
  getStompClient,
  subscribeConversation,
  sendMessageWS,
  disconnectWebSocket,
} from "../../services/socket";
import {
  getConversations,
  getMessagesByConversation,
} from "../../api/messageApi";
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
  const messagesContainerRef = useRef(null);
  const autoSelectedRef = useRef(false);

  const token = localStorage.getItem("token");

  // Load recruiter profile once
  useEffect(() => {
    getEmployerProfile().catch(() => {});
  }, []);

  // Scroll bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, selectedChat]);

  // WebSocket Connect ONCE
  useEffect(() => {
    if (!token) return;

    connectWebSocket(
      token,
      () => {
        stompClientRef.current = getStompClient();
      },
      () => {}
    );

    return () => {
      subscriptionRef.current?.unsubscribe?.();
      disconnectWebSocket();
    };
  }, [token]);

  // Load conversations with cache + fallback refresh
  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();

      setConversations(
        data.map((c) => ({
          id: c.id,
          otherName: c.otherUserName,
          avatar: c.otherUserAvatar,
          lastMessage: c.lastMessage || "Chưa có tin nhắn",
          unread: c.unreadCount || 0,
          lastMessageAt: c.lastMessageAt,
        }))
      );
    } catch (err) {
      setError("Không thể tải hội thoại");
    } finally {
      setLoading(false);
    }
  };

  // Load messages of selected conversation
  const loadMessages = async (conversationId) => {
    try {
      const data = await getMessagesByConversation(conversationId);
      setMessages(
        data.map((m) => ({
          id: m.id,
          content: m.content,
          fromSelf: m.fromSelf,
          time: m.createdAt,
        }))
      );
    } catch {
      setMessages([]);
    }
  };

  // Websocket subscription
  const setupSubscription = (conversationId) => {
    subscriptionRef.current?.unsubscribe?.();
    subscriptionRef.current = subscribeConversation(conversationId, (msg) => {
      const mapped = {
        id: msg.id,
        content: msg.content,
        fromSelf: msg.fromSelf,
        time: msg.createdAt,
      };

      if (selectedChat?.id === msg.conversationId) {
        setMessages((prev) => [...prev, mapped]);
      }

      setConversations((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId
            ? {
                ...c,
                lastMessage: msg.content,
                lastMessageAt: msg.createdAt,
                unread:
                  selectedChat?.id === msg.conversationId ? 0 : c.unread + 1,
              }
            : c
        )
      );
    });
  };

  const handleSelectChat = async (conv) => {
    setSelectedChat(conv);
    setMessages([]);

    stompClientRef.current?.publish({
      destination: "/app/chat.open",
      body: JSON.stringify({ conversationId: conv.id }),
    });

    await loadMessages(conv.id);

    if (stompClientRef.current?.connected) {
      setupSubscription(conv.id);
    }

    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
    );
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 20000);
    return () => clearInterval(interval);
  }, []);

  // Auto select latest chat once
  useEffect(() => {
    if (!autoSelectedRef.current && conversations.length > 0 && !loading) {
      autoSelectedRef.current = true;
      const sorted = [...conversations].sort(
        (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
      );
      handleSelectChat(sorted[0]);
    }
  }, [conversations, loading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const text = message.trim();
    const convId = selectedChat.id;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: text,
        fromSelf: true,
        time: new Date().toISOString(),
      },
    ]);

    sendMessageWS(convId, text);
    setMessage("");
  };

  const filtered = conversations.filter(
    (c) =>
      c.otherName.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || c.unread > 0)
  );

  const formatTime = (t) =>
    t
      ? new Date(t).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return (
    <div className="h-[calc(112vh-100px)] flex items-center justify-center p-4 pt-28 bg-gradient-to-br from-indigo-200/60 via-white/70 to-purple-200/60 backdrop-blur-sm">
      <div className="flex w-full max-w-6xl h-full rounded-3xl shadow-2xl overflow-hidden border border-white/30 bg-white/30 backdrop-blur-lg">
        {/* LIST */}
        <div className="w-1/3 flex flex-col border-r border-white/40 bg-gradient-to-b from-purple-300/70 via-purple-200/60 to-white/70 backdrop-blur-md">
          <div className="p-4 border-b border-white/40 flex items-center justify-between bg-white/70 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">Đoạn chat</h2>
            <MoreHorizontal className="text-gray-500 cursor-pointer" />
          </div>

          {/* Filter */}
          <div className="flex justify-around border-b border-white/40 text-sm font-medium text-gray-600 bg-white/40">
            <button
              className={`w-1/2 py-2 ${
                filter === "all"
                  ? "border-b-2 border-purple-600 text-purple-600 font-semibold"
                  : "hover:text-gray-800"
              }`}
              onClick={() => setFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={`w-1/2 py-2 ${
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

          {/* Conversation List */}
          <div className="overflow-y-auto flex-1 p-2 scrollbar-thin scrollbar-thumb-purple-400/50">
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectChat(c)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                  selectedChat?.id === c.id
                    ? "bg-purple-500/20 border border-purple-400/40"
                    : "hover:bg-white/40"
                }`}
              >
                <img
                  src={c.avatar}
                  className="w-12 h-12 rounded-full object-cover border shadow-md"
                />
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      c.unread ? "text-gray-800" : "text-gray-600"
                    }`}
                  >
                    {c.otherName}
                  </p>
                  <p
                    className={`text-sm truncate ${
                      c.unread ? "text-gray-700 font-medium" : "text-gray-500"
                    }`}
                  >
                    {c.lastMessage}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">
                    {formatTime(c.lastMessageAt)}
                  </span>
                  {c.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-white/80 via-purple-100/80 to-indigo-200/70 backdrop-blur-md">
          {selectedChat ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-white/40 bg-white/70 shadow">
                <img
                  src={selectedChat.avatar}
                  className="w-10 h-10 rounded-full border shadow-md"
                />
                <div>
                  <p className="font-semibold">{selectedChat.otherName}</p>
                  <p className="text-xs text-green-500">Đang hoạt động</p>
                </div>
              </div>

              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-300"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.fromSelf ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 text-sm rounded-2xl shadow ${
                        m.fromSelf
                          ? "bg-purple-600 text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-tl-sm"
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
                className="p-4 flex gap-3 bg-white/70 border-t"
              >
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-full bg-white/60 border outline-none"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <span className="flex items-center gap-2">
                <Send size={24} />
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
