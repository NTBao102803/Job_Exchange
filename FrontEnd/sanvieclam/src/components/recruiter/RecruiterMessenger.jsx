// src/pages/RecruiterMessenger.jsx
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

/**
 * RecruiterMessenger (debug build)
 * - UI preserved
 * - Very verbose console.log for debugging WebSocket / flow
 *
 * How to use:
 * - Open browser DevTools -> Console
 * - Watch logs when: connect, select chat, send message, receive WS message
 */

const RecruiterMessenger = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // refs
  const subscriptionRef = useRef(null); // stomp subscription object
  const subscribedConvRef = useRef(null); // conversationId currently subscribed
  const stompClientRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // track message ids per conversation to dedupe
  const messageIdsRef = useRef(new Map());

  const token = useMemo(() => localStorage.getItem("token"), []);
  const autoSelectedRef = useRef(false);
  const isMountedRef = useRef(true);

  // === lifecycle mount/unmount ===
  useEffect(() => {
    console.log("[LIFECYCLE] RecruiterMessenger mounted");
    return () => {
      console.log("[LIFECYCLE] RecruiterMessenger unmounting");
      isMountedRef.current = false;
      // cleanup subscription
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
          console.log("[CLEANUP] unsubscribed on unmount");
        } catch (e) {
          console.warn("[CLEANUP] unsubscribe error:", e);
        }
        subscriptionRef.current = null;
        subscribedConvRef.current = null;
      }
      // disconnect websocket
      try {
        disconnectWebSocket();
        console.log("[CLEANUP] disconnectWebSocket called");
      } catch (e) {
        console.warn("[CLEANUP] disconnectWebSocket error:", e);
      }
    };
  }, []);

  // === load recruiter profile if needed ===
  useEffect(() => {
    const loadRecruiterId = async () => {
      try {
        console.log("[LOAD] getEmployerProfile() start");
        const res = await getEmployerProfile();
        console.log("[LOAD] getEmployerProfile() success", res);
      } catch (err) {
        console.error("[LOAD] getEmployerProfile() failed:", err);
      }
    };
    loadRecruiterId();
  }, []);

  // === scroll to bottom when messages change ===
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      console.log("[UI] scrolled messages container to bottom");
    }
  }, [messages, selectedChat]);

  // -------------------
  // WebSocket connect once (debug logs)
  // -------------------
  useEffect(() => {
    console.log("[WS] connect effect running. token present?", !!token);
    if (!token) {
      console.warn("[WS] token missing - will not connect");
      return;
    }

    connectWebSocket(
      token,
      () => {
        // onConnected
        try {
          stompClientRef.current = getStompClient();
          console.log("[WS] connected -> stompClient set", stompClientRef.current ? true : false);
        } catch (e) {
          console.error("[WS] error retrieving stomp client:", e);
        }

        // force refresh conversations once connected
        loadConversations({ force: true })
          .then(() => console.log("[WS] conversations refreshed after connect"))
          .catch((e) => console.warn("[WS] conversations refresh failed:", e));
      },
      (err) => {
        console.error("[WS] connection error callback:", err);
      }
    );

    return () => {
      console.log("[WS] connect effect cleanup");
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
          console.log("[WS] unsubscribed during cleanup");
        } catch (e) {
          console.warn("[WS] unsubscribe cleanup error:", e);
        }
        subscriptionRef.current = null;
        subscribedConvRef.current = null;
      }
      disconnectWebSocket();
      stompClientRef.current = null;
      console.log("[WS] disconnected and stompClientRef cleared");
    };
    // we intentionally depend on token only (connect once)
  }, [token]);

  // -------------------
  // Load conversations
  // -------------------
  const loadConversations = async ({ force = false } = {}) => {
    console.log(`[LOAD] loadConversations called (force=${force})`);
    try {
      if (!force && conversations.length === 0) {
        setLoading(true);
        setError(null);
        console.log("[LOAD] setLoading(true)");
      }
      const data = await getConversations({ force });
      console.log("[LOAD] getConversations result:", data);
      if (!Array.isArray(data)) throw new Error("Invalid conversations payload");

      const mapped = data.map((c) => ({
        id: c.id,
        otherName: c.otherUserName || "Ẩn danh",
        avatar: c.otherUserAvatar || "https://i.pravatar.cc/150?img=3",
        lastMessage: c.lastMessage || "Chưa có tin nhắn",
        lastMessageAt: c.lastMessageAt,
        unread: c.unreadCount || 0,
      }));

      if (isMountedRef.current) {
        setConversations(mapped);
        console.log("[LOAD] conversations set, count=", mapped.length);
      } else {
        console.warn("[LOAD] component unmounted before setting conversations");
      }
    } catch (err) {
      console.error("[LOAD] loadConversations error:", err);
      if (isMountedRef.current) setError("Không thể tải danh sách chat.");
    } finally {
      if (isMountedRef.current) setLoading(false);
      console.log("[LOAD] loadConversations finished (loading=false)");
    }
  };

  // initial load
  useEffect(() => {
    loadConversations().catch((e) => console.error("[INIT] loadConversations failed:", e));
  }, []);

  // -------------------
  // Load messages for a conversation
  // -------------------
  const loadMessages = async (conversationId) => {
    console.log("[LOAD] loadMessages for conversationId=", conversationId);
    try {
      const data = await getMessagesByConversation(conversationId);
      console.log("[LOAD] getMessagesByConversation result length=", Array.isArray(data) ? data.length : "not-array", data);
      const mapped = (Array.isArray(data) ? data : []).map((m) => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        fromSelf: m.fromSelf,
        time: m.createdAt,
        avatar: m.senderAvatar || "https://i.pravatar.cc/150?img=5",
      }));

      // populate dedupe set
      const ids = new Set(mapped.map((m) => m.id).filter(Boolean));
      messageIdsRef.current.set(conversationId, ids);
      console.log(`[DEDUPE] messageIds for conv ${conversationId} initialized with`, ids.size, "ids");

      if (isMountedRef.current) {
        setMessages(mapped);
        console.log("[LOAD] setMessages with", mapped.length, "items");
      } else {
        console.warn("[LOAD] component unmounted before setting messages");
      }
    } catch (err) {
      console.error("[LOAD] loadMessages error:", err);
      if (isMountedRef.current) setMessages([]);
    }
  };

  // -------------------
  // Subscribe to a conversation safely (prevent duplicate subs)
  // -------------------
  const setupSubscription = (conversationId) => {
    console.log("[SUB] setupSubscription called for conversationId=", conversationId);
    // If already subscribed to same conversation, nothing to do
    if (subscribedConvRef.current === conversationId && subscriptionRef.current) {
      console.log("[SUB] already subscribed to this conversation - skipping");
      return;
    }

    // Unsubscribe old subscription if any
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
        console.log("[SUB] unsubscribed from previous conversation:", subscribedConvRef.current);
      } catch (e) {
        console.warn("[SUB] unsub unsubscribe error:", e);
      }
      subscriptionRef.current = null;
      subscribedConvRef.current = null;
    }

    // create new subscription via helper
    try {
      const sub = subscribeConversation(conversationId, (msg) => {
        console.log("[WS RECEIVED] raw message for conv", conversationId, "→", msg);

        // safety: ensure msg has conversationId (log if missing)
        if (!msg || (typeof msg !== "object")) {
          console.warn("[WS RECEIVED] malformed msg:", msg);
          return;
        }

        // check conversation id
        if (!msg.conversationId) {
          console.warn("[WS RECEIVED] msg missing conversationId:", msg);
        } else if (String(msg.conversationId) !== String(conversationId)) {
          console.log("[WS RECEIVED] msg.conversationId differs from subscribed conversationId", msg.conversationId, conversationId);
        }

        // dedupe: check id in set
        const idsSet = messageIdsRef.current.get(conversationId) || new Set();
        if (msg.id) {
          if (idsSet.has(msg.id)) {
            console.warn("[DEDUPE] message id already seen -> skipping:", msg.id, msg);
            return;
          }
          idsSet.add(msg.id);
          messageIdsRef.current.set(conversationId, idsSet);
          console.log("[DEDUPE] stored message id:", msg.id, "for conv", conversationId);
        } else {
          // no id provided — we still allow, but log it
          console.warn("[DEDUPE] incoming message has no id. This may cause duplicates. msg:", msg);
        }

        // build payload
        const payload = {
          id: msg.id || `no-id-${Date.now()}`, // fallback id for logging/UI
          content: msg.content,
          fromSelf: !!msg.fromSelf,
          time: msg.createdAt || new Date().toISOString(),
          avatar: msg.senderAvatar,
          senderId: msg.senderId,
          conversationId: msg.conversationId,
        };

        // if belongs to currently selected conversation, append
        console.log(String(msg.conversationId), String(selectedChat), String(msg.conversationId))
        if (selectedChat && String(msg.conversationId) === String(selectedChat.id)) {
          console.log("[WS] appending message to current UI for conv", selectedChat.id, payload);
          setMessages((prev) => {
            const next = [...prev, payload];
            console.log("[UI] setMessages -> length", next.length);
            return next;
          });

          // update conversation entry lastMessage/unread locally
          setConversations((prev) =>
            prev.map((c) =>
              c.id === selectedChat.id
                ? { ...c, lastMessage: msg.content, unread: 0, lastMessageAt: msg.createdAt }
                : c
            )
          );
        } else {
          // message for another conversation -> update conversations list (unread++)
          console.log("[WS] message is for another conversation:", msg.conversationId, "updating conversations list");
          setConversations((prev) => {
            const found = prev.find((c) => String(c.id) === String(msg.conversationId));
            if (found) {
              console.log("[CONV] found existing conv -> increment unread and update lastMessage");
              return prev.map((c) =>
                String(c.id) === String(msg.conversationId)
                  ? { ...c, lastMessage: msg.content, unread: (c.unread || 0) + 1, lastMessageAt: msg.createdAt }
                  : c
              );
            } else {
              console.log("[CONV] conv not found -> prepending new lightweight conv entry");
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
      console.log("[SUB] subscribeConversation returned subscription:", sub, "subscribedConvRef set to", conversationId);
    } catch (err) {
      console.error("[SUB] subscribeConversation failed:", err);
    }
  };

  // -------------------
  // Handle selecting a chat
  // -------------------
  const handleSelectChat = async (conv) => {
    console.log("[UI] handleSelectChat called with conv:", conv);
    setSelectedChat(conv);
    setMessages([]); // clear while loading
    console.log("[UI] cleared messages while loading new conversation");

    // publish chat.open to backend so server can mark as read / send missed messages
    try {
      const client = stompClientRef.current;
      if (client?.connected) {
        console.log("[WS] publishing /app/chat.open for conv:", conv.id);
        client.publish({
          destination: "/app/chat.open",
          body: JSON.stringify({ conversationId: conv.id }),
        });
      } else {
        console.warn("[WS] stomp client not connected - cannot publish chat.open");
      }
    } catch (e) {
      console.warn("[WS] chat.open publish failed:", e);
    }

    // load messages (this will init dedupe ids)
    try {
      await loadMessages(conv.id);
      console.log("[UI] loadMessages completed for conv:", conv.id);
    } catch (e) {
      console.error("[UI] loadMessages error for conv:", conv.id, e);
    }

    // subscribe for real-time updates for this conversation
    try {
      const client = stompClientRef.current;
      if (client?.connected) {
        console.log("[SUB] setting up subscription for conv:", conv.id);
        setupSubscription(conv.id);
      } else {
        console.warn("[SUB] stomp client not connected; skip subscription for now (will subscribe after connect)");
      }
    } catch (e) {
      console.error("[SUB] error during setupSubscription:", e);
    }

    // locally mark as read/unread zero to avoid UI flicker
    setConversations((prev) => prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c)));
    console.log("[UI] marked selected conv unread = 0 locally");
  };

  // -------------------
  // Auto-select one conversation only once
  // -------------------
  useEffect(() => {
    if (autoSelectedRef.current) {
      return;
    }
    if (loading) return;
    if (!conversations || conversations.length === 0) return;
    if (selectedChat) return;

    autoSelectedRef.current = true;
    const sorted = [...conversations].sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    console.log("[AUTOSELECT] selecting conversation:", sorted[0]);
    handleSelectChat(sorted[0]);
  }, [conversations, loading, selectedChat]);

  // -------------------
  // Send message — with logs
  // -------------------
  const handleSend = async (e) => {
    e.preventDefault();
    console.log("[SEND] handleSend called. input message length:", message.length, "selectedChat:", selectedChat?.id);
    if (!message.trim() || !selectedChat) {
      console.warn("[SEND] nothing to send (empty message or no conversation selected)");
      return;
    }

    const content = message.trim();
    const convId = selectedChat.id;

    // Clear input (UX)
    setMessage("");
    console.log("[SEND] cleared input. sending content:", content, "to convId:", convId);

    // Optionally: optimistic UI (commented). For now we rely on backend broadcast.
    // Uncomment if you want immediate visual feedback:
    // const optimistic = { id: `optim-${Date.now()}`, content, fromSelf: true, time: new Date().toISOString(), avatar: selectedChat.avatar };
    // setMessages(prev => { console.log("[OPTIMISTIC] adding optimistic message", optimistic); return [...prev, optimistic]; });

    // Send through helper (WS). This helper should publish to /app/chat.send or similar.
    try {
      const ok = sendMessageWS(convId, content);
      console.log("[SEND] sendMessageWS returned:", ok);
      if (!ok) {
        console.error("[SEND] sendMessageWS returned falsy -> consider REST fallback");
        // optional fallback: call REST API to persist message (not provided here)
      }
    } catch (err) {
      console.error("[SEND] sendMessageWS threw error:", err);
    }
  };

  // -------------------
  // Filtered conversations (derived)
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

  // === UI (kept identical) ===
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
              className={`w-1/2 py-2 transition ${filter === "all" ? "border-b-2 border-purple-600 text-purple-600 font-semibold" : "hover:text-gray-800"}`}
              onClick={() => {
                console.log("[UI] filter -> all");
                setFilter("all");
              }}
            >
              Tất cả
            </button>
            <button
              className={`w-1/2 py-2 transition ${filter === "unread" ? "border-b-2 border-purple-600 text-purple-600 font-semibold" : "hover:text-gray-800"}`}
              onClick={() => {
                console.log("[UI] filter -> unread");
                setFilter("unread");
              }}
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
                onChange={(e) => {
                  console.log("[UI] search changed:", e.target.value);
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>

          {/* LIST */}
          <div className="overflow-y-auto flex-1 p-2 scrollbar-thin scrollbar-thumb-purple-400/50 scrollbar-track-transparent">
            {loading && <div className="text-center p-4 text-gray-500">Đang tải...</div>}
            {error && <div className="text-center p-4 text-red-500">{error}</div>}
            {!loading && filtered.length === 0 && <div className="text-center p-4 text-gray-500">Không tìm thấy hội thoại.</div>}

            {filtered.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  console.log("[UI] conversation clicked:", conv.id);
                  handleSelectChat(conv);
                }}
                className={`relative flex items-center gap-3 p-3 cursor-pointer rounded-xl mx-1 mb-2 transition ${selectedChat?.id === conv.id ? "bg-purple-500/20 border border-purple-400/40" : "hover:bg-white/40"}`}
              >
                <img src={conv.avatar} className="w-12 h-12 rounded-full object-cover border border-white shadow-md" alt={conv.otherName} />

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${conv.unread > 0 ? "text-gray-800" : "text-gray-600"}`}>{conv.otherName}</p>
                  <p className={`text-sm ${conv.unread > 0 ? "text-gray-700 font-medium" : "text-gray-500"} truncate`}>{conv.lastMessage}</p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(conv.lastMessageAt)}</span>
                  {conv.unread > 0 && <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">{conv.unread}</span>}
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
                <button type="submit" className="p-2 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition disabled:bg-gray-400" disabled={!message.trim() || !stompClientRef.current?.connected}>
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
