import React, { useEffect, useState, useRef, useMemo } from "react";
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
  clearConversationCache,
} from "../../api/messageApi";
import { getEmployerProfile } from "../../api/RecruiterApi";

// RecruiterMessenger - refactored & optimized
// - Keep UI identical to your original
// - No polling
// - Single WS connection (connect once)
// - Subscribe only when conversation changes; prevent duplicate subscriptions
// - No optimistic UI (frontend waits for backend WS push)
// - Deduplicate incoming messages by id

const RecruiterMessenger = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subscriptionRef = useRef(null); // stomp subscription object
  const subscribedConvRef = useRef(null); // conversationId currently subscribed
  const stompClientRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // track which message ids we've seen per conversation to avoid duplicates
  const messageIdsRef = useRef(new Map());

  const token = useMemo(() => localStorage.getItem("token"), []);
  const autoSelectedRef = useRef(false); // ensure auto select only once
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // load recruiter id if needed (keep as before)
  useEffect(() => {
    const loadRecruiterId = async () => {
      try {
        await getEmployerProfile();
      } catch (err) {
        console.error("Lỗi lấy employer profile:", err);
      }
    };
    loadRecruiterId();
  }, []);

  // scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, selectedChat]);

  // -------------------
  // WebSocket connect once
  // -------------------
  useEffect(() => {
    if (!token) {
      console.warn("No token, WS will not connect");
      return;
    }

    connectWebSocket(
      token,
      () => {
        // onConnected
        stompClientRef.current = getStompClient();
        // After connect, ensure we have conversation list fresh
        loadConversations({ force: true }).catch(() => {});
        console.log("WS connected");
      },
      (err) => {
        console.error("WS error", err);
      }
    );

    return () => {
      // Cleanup on unmount
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
        } catch (e) {
          // ignore
        }
        subscriptionRef.current = null;
        subscribedConvRef.current = null;
      }
      disconnectWebSocket();
      stompClientRef.current = null;
    };
    // only on mount/unmount
  }, [token]);

  // -------------------
  // Conversations loader (no polling)
  // -------------------
  const loadConversations = async ({ force = false } = {}) => {
    try {
      if (!force && conversations.length === 0) {
        setLoading(true);
        setError(null);
      }
      const data = await getConversations({ force });
      if (!Array.isArray(data)) throw new Error("Invalid conversations");

      const mapped = data.map((c) => ({
        id: c.id,
        otherName: c.otherUserName || "Ẩn danh",
        avatar: c.otherUserAvatar || "https://i.pravatar.cc/150?img=3",
        lastMessage: c.lastMessage || "Chưa có tin nhắn",
        lastMessageAt: c.lastMessageAt,
        unread: c.unreadCount || 0,
      }));

      if (isMountedRef.current) setConversations(mapped);
    } catch (err) {
      console.error("RecruiterMessenger - Error loading conversations:", err);
      if (isMountedRef.current) setError("Không thể tải danh sách chat.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  // initial conversations load once (connect effect also forces a refresh)
  useEffect(() => {
    loadConversations();
  }, []);

  // -------------------
  // Load messages for conversation (uses messageApi cache)
  // -------------------
  const loadMessages = async (conversationId) => {
    try {
      const data = await getMessagesByConversation(conversationId);
      const mapped = data.map((m) => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        fromSelf: m.fromSelf,
        time: m.createdAt,
        avatar: m.senderAvatar || "https://i.pravatar.cc/150?img=5",
      }));

      // populate seen ids map for this conversation
      const ids = new Set(mapped.map((m) => m.id));
      messageIdsRef.current.set(conversationId, ids);

      if (isMountedRef.current) setMessages(mapped);
    } catch (err) {
      console.error("Error loading messages", err);
      if (isMountedRef.current) setMessages([]);
    }
  };

  // -------------------
  // Subscribe to a conversation safely (prevent duplicate subs)
  // -------------------
  const setupSubscription = (conversationId) => {
    // If already subscribed to same conversation, nothing to do
    if (subscribedConvRef.current === conversationId && subscriptionRef.current) return;

    // Unsubscribe old
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
      } catch (e) {
        // ignore
      }
      subscriptionRef.current = null;
      subscribedConvRef.current = null;
    }

    // Subscribe new
    const sub = subscribeConversation(conversationId, (msg) => {
      // msg should include: id, conversationId, content, createdAt, fromSelf, senderAvatar, senderId

      // Deduplicate by message id for this conversation
      const idsSet = messageIdsRef.current.get(conversationId) || new Set();
      if (msg.id && idsSet.has(msg.id)) return; // already have it
      if (msg.id) idsSet.add(msg.id);
      messageIdsRef.current.set(conversationId, idsSet);

      const payload = {
        id: msg.id,
        content: msg.content,
        fromSelf: msg.fromSelf,
        time: msg.createdAt,
        avatar: msg.senderAvatar,
        senderId: msg.senderId,
      };

      // If the message belongs to current selected conversation, append to messages
      if (selectedChat && msg.conversationId === selectedChat.id) {
        setMessages((prev) => [...prev, payload]);

        // mark conversation unread=0 locally
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedChat.id
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
        // Message belongs to other conversation: update the conversations list locally
        setConversations((prev) => {
          const found = prev.find((c) => c.id === msg.conversationId);
          if (found) {
            return prev.map((c) =>
              c.id === msg.conversationId
                ? {
                    ...c,
                    lastMessage: msg.content,
                    unread: (c.unread || 0) + 1,
                    lastMessageAt: msg.createdAt,
                  }
                : c
            );
          } else {
            // If not present, prepend a new conversation entry (lightweight)
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
          }
        });
      }
    });

    subscriptionRef.current = sub;
    subscribedConvRef.current = conversationId;
  };

  // -------------------
  // Handle selecting a chat
  // -------------------
  const handleSelectChat = async (conv) => {
    // immediate UI updates
    setSelectedChat(conv);
    setMessages([]);

    // send chat.open to mark read on server (if connected)
    const client = stompClientRef.current;
    if (client?.connected) {
      try {
        client.publish({
          destination: "/app/chat.open",
          body: JSON.stringify({ conversationId: conv.id }),
        });
      } catch (e) {
        console.warn("chat.open publish failed", e);
      }
    }

    // load messages (cache-enabled) — this will also populate messageIdsRef for dedupe
    await loadMessages(conv.id);

    // subscription for real-time updates (safe)
    if (client?.connected) {
      setupSubscription(conv.id);
    }

    // locally set unread to 0 for this conversation to avoid extra fetch
    setConversations((prev) => prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c)));
  };

  // -------------------
  // Auto-select one conversation only once
  // -------------------
  useEffect(() => {
    if (autoSelectedRef.current) return;
    if (loading) return;
    if (conversations.length === 0) return;
    if (selectedChat) return;

    autoSelectedRef.current = true;
    const sorted = [...conversations].sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    handleSelectChat(sorted[0]);
  }, [conversations, loading, selectedChat]);

  // -------------------
  // Send message — no optimistic UI. Rely on backend push via WS
  // -------------------
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const content = message.trim();
    const convId = selectedChat.id;

    // Clear input immediately (UX), but DO NOT append optimistic message
    setMessage("");

    // Send via WS or REST depending on your backend API. We call sendMessageWS (existing util)
    // Backend must persist and then broadcast to topic; UI will update when WS pushes the message back.
    const ok = sendMessageWS(convId, content);
    if (!ok) {
      console.error("WS send failed — consider retry or REST fallback");
      // Optionally call REST fallback here if you have one
      // await sendMessageREST({ conversationId: convId, content });
    }
  };

  // -------------------
  // Filtered conversations derived locally
  // -------------------
  const filtered = conversations.filter((c) => {
    const matchSearch = c.otherName.toLowerCase().includes(search.toLowerCase());
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
          {/* Header */}
          <div className="p-4 border-b border-white/40 flex items-center justify-between bg-white/70 backdrop-blur-md shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">Đoạn chat</h2>
            <MoreHorizontal className="text-gray-500 cursor-pointer" />
          </div>

          {/* Filter */}
          <div className="flex justify-around border-b border-white/40 text-sm font-medium text-gray-600 bg-white/40">
            <button
              className={`w-1/2 py-2 transition ${
                filter === "all" ? "border-b-2 border-purple-600 text-purple-600 font-semibold" : "hover:text-gray-800"
              }`}
              onClick={() => setFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={`w-1/2 py-2 transition ${
                filter === "unread" ? "border-b-2 border-purple-600 text-purple-600 font-semibold" : "hover:text-gray-800"
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
          <div className="overflow-y-auto flex-1 p-2 scrollbar-thin scrollbar-thumb-purple-400/50 scrollbar-track-transparent">
            {loading && <div className="text-center p-4 text-gray-500">Đang tải...</div>}
            {error && <div className="text-center p-4 text-red-500">{error}</div>}
            {!loading && filtered.length === 0 && (
              <div className="text-center p-4 text-gray-500">Không tìm thấy hội thoại.</div>
            )}

            {filtered.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectChat(conv)}
                className={`relative flex items-center gap-3 p-3 cursor-pointer rounded-xl mx-1 mb-2 transition ${
                  selectedChat?.id === conv.id ? "bg-purple-500/20 border border-purple-400/40" : "hover:bg-white/40"
                }`}
              >
                <img
                  src={conv.avatar}
                  className="w-12 h-12 rounded-full object-cover border border-white shadow-md"
                  alt={conv.otherName}
                />

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${conv.unread > 0 ? "text-gray-800" : "text-gray-600"}`}>
                    {conv.otherName}
                  </p>
                  <p className={`text-sm ${conv.unread > 0 ? "text-gray-700 font-medium" : "text-gray-500"} truncate`}>
                    {conv.lastMessage}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(conv.lastMessageAt)}</span>
                  {conv.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">{conv.unread}</span>
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
                <img src={selectedChat.avatar} className="w-10 h-10 rounded-full border border-white shadow-md object-cover" alt={selectedChat.otherName} />
                <div>
                  <p className="font-semibold text-gray-800">{selectedChat.otherName}</p>
                  <p className="text-xs text-green-500 font-medium">Đang hoạt động</p>
                </div>
              </div>

              {/* MESSAGES */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-400/50 scrollbar-track-transparent">
                {messages.map((m, i) => (
                  <div key={m.id || i} className={`flex ${m.fromSelf ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow ${m.fromSelf ? "bg-purple-600 text-white" : "bg-white text-gray-800"} ${m.fromSelf ? "rounded-br-sm" : "rounded-tl-sm"}`}>
                      {m.content}
                      <div className="text-[10px] mt-1 text-right opacity-70">{formatTime(m.time)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-white/40 bg-white/70 flex items-center gap-3">
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
                  disabled={!message.trim() || !stompClientRef.current?.connected}
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
              <span className="flex items-center gap-2">
                <Send size={24} className="opacity-50" /> Chọn một ứng viên để bắt đầu
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterMessenger;
