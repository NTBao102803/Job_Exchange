// src/pages/RecruiterMessenger.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Send, Search, MoreHorizontal } from "lucide-react";
import {
  connectWebSocket,
  getStompClient,
  subscribeConversation,
  sendMessageWS,
  disconnectWebSocket,
} from "../../services/sockets/messageSocket";
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
  const subscribedConvRef = useRef(null);
  const stompClientRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageIdsRef = useRef(new Map());

  const token = useMemo(() => localStorage.getItem("token"), []);
  const autoSelectedRef = useRef(false);
  const isMountedRef = useRef(true);

  // === lifecycle mount/unmount ===
  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe(); // ✅ FIX
        subscriptionRef.current = null;
      }

      disconnectWebSocket(); // ✅ FIX
    };
  }, []);

  useEffect(() => {
    getEmployerProfile().catch(() => {});
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, selectedChat]);

  // WebSocket connect once
  useEffect(() => {
    if (!token) return;

    connectWebSocket(
      token,
      () => {
        stompClientRef.current = getStompClient();
        loadConversations({ force: true });
      },
      () => {}
    );
  }, [token]);

  // Load conversations
  const loadConversations = async ({ force = false } = {}) => {
    try {
      if (!force && conversations.length === 0) setLoading(true);
      const data = await getConversations({ force });
      const mapped = data.map((c) => ({
        id: c.id,
        otherName: c.otherUserName || "Ẩn danh",
        avatar: c.otherUserAvatar || "https://i.pravatar.cc/150?img=3",
        lastMessage: c.lastMessage || "Chưa có tin nhắn",
        lastMessageAt: c.lastMessageAt,
        unread: c.unreadCount || 0,
      }));
      if (isMountedRef.current) setConversations(mapped);
    } catch {
      if (isMountedRef.current) setError("Không thể tải danh sách chat.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations().catch(() => {});
  }, []);

  // Load messages
  const loadMessages = async (conversationId) => {
    try {
      const data = await getMessagesByConversation(conversationId);
      const mapped = (Array.isArray(data) ? data : []).map((m) => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        fromSelf: m.fromSelf,
        time: m.createdAt,
        avatar: m.senderAvatar || "https://i.pravatar.cc/150?img=5",
      }));
      const ids = new Set(mapped.map((m) => m.id).filter(Boolean));
      messageIdsRef.current.set(conversationId, ids);
      if (isMountedRef.current) setMessages(mapped);
    } catch {
      if (isMountedRef.current) setMessages([]);
    }
  };

  const setupSubscription = (conversationId) => {
    if (
      subscribedConvRef.current === conversationId &&
      subscriptionRef.current
    ) {
      return;
    }
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
      } catch {}
      subscriptionRef.current = null;
      subscribedConvRef.current = null;
    }

    try {
      const sub = subscribeConversation(conversationId, (msg) => {
        if (!msg || typeof msg !== "object") return;

        const idsSet = messageIdsRef.current.get(conversationId) || new Set();

        if (msg.id && idsSet.has(msg.id)) return;
        if (msg.id) idsSet.add(msg.id);
        messageIdsRef.current.set(conversationId, idsSet);

        const payload = {
          id: msg.id || `no-id-${Date.now()}`,
          content: msg.content,
          fromSelf: msg.senderType === "EMPLOYER",
          time: msg.createdAt || new Date().toISOString(),
          avatar: msg.senderAvatar,
          senderId: msg.senderId,
          conversationId: msg.conversationId,
        };

        if (String(msg.conversationId) === String(conversationId)) {
          setMessages((prev) => [...prev, payload]);

          setConversations((prev) =>
            prev.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    lastMessage: msg.content,
                    unread: 0,
                    lastMessageAt: msg.createdAt,
                  }
                : c
            )
          );
        } else {
          setConversations((prev) => {
            const found = prev.find(
              (c) => String(c.id) === String(msg.conversationId)
            );

            if (found) {
              return prev.map((c) =>
                String(c.id) === String(msg.conversationId)
                  ? {
                      ...c,
                      lastMessage: msg.content,
                      unread: (c.unread || 0) + 1,
                      lastMessageAt: msg.createdAt,
                    }
                  : c
              );
            }

            return [
              {
                id: msg.conversationId,
                otherName: msg.senderName || "Ẩn danh",
                avatar: msg.senderAvatar || "https://i.pravatar.cc/150?img=3",
                lastMessage: msg.content,
                lastMessageAt: msg.createdAt,
                unread: 1,
              },
              ...prev,
            ];
          });
        }
      });

      subscriptionRef.current = sub;
      subscribedConvRef.current = conversationId;
    } catch (e) {
      console.error("subscribeConversation error", e);
    }
  };

  const handleSelectChat = async (conv) => {
    setSelectedChat(conv);
    setMessages([]);

    // mở conversation (optional)
    try {
      const client = stompClientRef.current;
      if (client?.connected) {
        client.publish({
          destination: "/app/chat.open",
          body: JSON.stringify({ conversationId: conv.id }),
        });
      }
    } catch {}

    await loadMessages(conv.id);

    if (stompClientRef.current?.connected) {
      setupSubscription(conv.id);
    }

    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
    );
  };

  useEffect(() => {
    if (autoSelectedRef.current) return;
    if (loading) return;
    if (!conversations || conversations.length === 0) return;
    if (selectedChat) return;

    autoSelectedRef.current = true;
    const sorted = [...conversations].sort(
      (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
    );
    handleSelectChat(sorted[0]);
  }, [conversations, loading, selectedChat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const content = message.trim();
    const convId = selectedChat.id;

    setMessage("");

    try {
      sendMessageWS(convId, content);
    } catch {}
  };

  const filtered = conversations.filter((c) => {
    const matchSearch = c.otherName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter = filter === "unread" ? c.unread > 0 : true;
    return matchSearch && matchFilter;
  });

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
          <div className="p-4 border-b border-white/40 flex items-center justify-between bg-white/70 backdrop-blur-md shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">Đoạn chat</h2>
            <MoreHorizontal className="text-gray-500 cursor-pointer" />
          </div>

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
                className="p-4 border-t border-white/40 bg-white/70 flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 rounded-full bg-white/60 border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500 transition"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!stompClientRef.current?.connected}
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
                <Send size={24} className="opacity-50" /> Chọn một ứng viên để
                bắt đầu
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterMessenger;
