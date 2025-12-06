import React, { useEffect, useState, useRef, useMemo } from "react";
import { Send, Search, MoreHorizontal } from "lucide-react";
import {
  connectWebSocket,
  getStompClient,
  subscribeConversation,
  sendMessageWS,
  disconnectWebSocket,
} from "../../services/socket";
import { getConversations, getMessagesByConversation } from "../../api/messageApi";
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

  // ✅ REFS
  const subscriptionRef = useRef(null);
  const subscribedConvRef = useRef(null);
  const stompClientRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageIdsRef = useRef(new Map());
  const autoSelectedRef = useRef(false);
  const isMountedRef = useRef(true);
  const selectedChatRef = useRef(null); // fix lỗi ReferenceError

  const token = useMemo(() => localStorage.getItem("token"), []);

  // LIFECYCLE
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try { await getEmployerProfile(); } catch {}
    };
    loadProfile();
  }, []);

  // Scroll auto
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, selectedChat]);

  // WS connect
  useEffect(() => {
    if (!token) return;
    connectWebSocket(
      token,
      () => {
        stompClientRef.current = getStompClient();
        loadConversations({ force: true });
      },
      (err) => console.error("[WS] connection error:", err)
    );
    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
      disconnectWebSocket();
      stompClientRef.current = null;
    };
  }, [token]);

  // Load conversations
  const loadConversations = async ({ force = false } = {}) => {
    try {
      if (!force && conversations.length === 0) setLoading(true);
      const data = await getConversations({ force });
      const mapped = (Array.isArray(data) ? data : []).map((c) => ({
        id: c.id,
        otherName: c.otherUserName || "Ẩn danh",
        avatar: c.otherUserAvatar || "https://i.pravatar.cc/150?img=3",
        lastMessage: c.lastMessage || "Chưa có tin nhắn",
        lastMessageAt: c.lastMessageAt,
        unread: c.unreadCount || 0,
      }));
      if (isMountedRef.current) setConversations(mapped);
    } catch (err) {
      if (isMountedRef.current) setError("Không thể tải danh sách chat.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  useEffect(() => { loadConversations(); }, []);

  // Load messages
  const loadMessages = async (conversationId) => {
    try {
      const data = await getMessagesByConversation(conversationId);
      const mapped = (Array.isArray(data) ? data : []).map((m) => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        fromSelf: !!m.fromSelf,
        time: m.createdAt,
        avatar: m.senderAvatar || "https://i.pravatar.cc/150?img=5",
      }));
      const ids = new Set(mapped.map((m) => m.id).filter(Boolean));
      messageIdsRef.current.set(conversationId, ids);
      if (isMountedRef.current) setMessages(mapped);
    } catch { if (isMountedRef.current) setMessages([]); }
  };

  // Setup WS subscription
  const setupSubscription = (conversationId) => {
    if (subscribedConvRef.current === conversationId && subscriptionRef.current) return;

    if (subscriptionRef.current) {
      try { subscriptionRef.current.unsubscribe(); } catch {}
      subscriptionRef.current = null;
      subscribedConvRef.current = null;
    }

    try {
      const sub = subscribeConversation(conversationId, (msg) => {
        if (!msg || typeof msg !== "object") return;

        const convId = msg.conversationId || conversationId;
        const idsSet = messageIdsRef.current.get(convId) || new Set();
        const msgId = msg.id || `no-id-${Date.now()}`;
        if (idsSet.has(msgId)) return;
        idsSet.add(msgId);
        messageIdsRef.current.set(convId, idsSet);

        const payload = {
          id: msgId,
          content: msg.content || "",
          fromSelf: !!msg.fromSelf,
          time: msg.createdAt || new Date().toISOString(),
          avatar: msg.senderAvatar || "https://i.pravatar.cc/150?img=5",
          senderId: msg.senderId,
          conversationId: convId,
        };

        if (selectedChatRef.current && String(convId) === String(selectedChatRef.current.id)) {
          setMessages((prev) => [...prev, payload]);
          setConversations((prev) =>
            prev.map((c) =>
              c.id === selectedChatRef.current.id
                ? { ...c, lastMessage: payload.content, unread: 0, lastMessageAt: payload.time }
                : c
            )
          );
        } else {
          setConversations((prev) => {
            const found = prev.find((c) => String(c.id) === String(convId));
            if (found) {
              return prev.map((c) =>
                String(c.id) === String(convId)
                  ? { ...c, lastMessage: payload.content, unread: (c.unread || 0) + 1, lastMessageAt: payload.time }
                  : c
              );
            } else {
              return [
                {
                  id: convId,
                  otherName: msg.senderName || "Ẩn danh",
                  avatar: msg.senderAvatar || "https://i.pravatar.cc/150?img=3",
                  lastMessage: payload.content,
                  lastMessageAt: payload.time,
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
    } catch (err) { console.error("[SUB] subscribeConversation failed:", err); }
  };

  // Select chat
  const handleSelectChat = async (conv) => {
    setSelectedChat(conv);
    selectedChatRef.current = conv;
    setMessages([]);
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
    if (stompClientRef.current?.connected) setupSubscription(conv.id);
    setConversations((prev) => prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c)));
  };

  // Auto select first chat
  useEffect(() => {
    if (autoSelectedRef.current || loading || !conversations.length || selectedChat) return;
    autoSelectedRef.current = true;
    const sorted = [...conversations].sort(
      (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
    );
    handleSelectChat(sorted[0]);
  }, [conversations, loading, selectedChat]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;
    const content = message.trim();
    const convId = selectedChat.id;
    setMessage("");
    try { sendMessageWS(convId, content); } catch (err) { console.error(err); }
  };

  // Filtered conversations
  const filtered = conversations.filter((c) => {
    const matchSearch = c.otherName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "unread" ? c.unread > 0 : true;
    return matchSearch && matchFilter;
  });

  const formatTime = (isoString) =>
    isoString ? new Date(isoString).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div className="h-[calc(112vh-100px)] flex items-center justify-center p-4 pt-28 bg-gradient-to-br from-indigo-200/60 via-white/70 to-purple-200/60 backdrop-blur-sm">
      <div className="flex w-full max-w-6xl h-full rounded-3xl shadow-2xl overflow-hidden border border-white/30 bg-white/30 backdrop-blur-lg">
        {/* Danh sách hội thoại */}
        <div className="w-1/3 border-r border-white/30 flex flex-col">
          <div className="p-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-2 rounded-md border border-gray-300"
            />
            <Search size={18} />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <div
                key={c.id}
                className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-white/20 rounded-lg ${
                  selectedChat?.id === c.id ? "bg-white/30" : ""
                }`}
                onClick={() => handleSelectChat(c)}
              >
                <img src={c.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="font-medium">{c.otherName}</div>
                  <div className="text-sm text-gray-600 truncate">{c.lastMessage}</div>
                </div>
                {c.unread > 0 && (
                  <span className="text-xs bg-red-500 text-white rounded-full px-2">{c.unread}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat box */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4" ref={messagesContainerRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 mb-2 ${m.fromSelf ? "justify-end" : "justify-start"}`}
              >
                {!m.fromSelf && <img src={m.avatar} alt="" className="w-8 h-8 rounded-full" />}
                <div
                  className={`px-3 py-2 rounded-xl max-w-[60%] ${
                    m.fromSelf ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {m.content}
                  <div className="text-xs text-gray-500 mt-1 text-right">{formatTime(m.time)}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Input box */}
          <form
            className="p-3 flex items-center gap-2 border-t border-white/30"
            onSubmit={handleSend}
          >
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 rounded-md border border-gray-300"
            />
            <button type="submit" className="p-2 bg-blue-500 rounded-md text-white">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecruiterMessenger;
