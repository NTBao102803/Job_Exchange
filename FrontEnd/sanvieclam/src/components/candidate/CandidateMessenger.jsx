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
  const messagesContainerRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const myAvatar = user?.avatarUrl || "https://i.pravatar.cc/150?img=3";

  const location = useLocation();
  const navigatedConversationId = location.state?.conversationId;
  const autoSelectedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // auto scroll
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, selectedChat]);

  // connect websocket
  useEffect(() => {
    if (!token) return;
    connectWebSocket(
      token,
      () => {
        stompClientRef.current = getStompClient();
      },
      (err) => console.error("WebSocket connection error:", err)
    );

    return () => {
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
        } catch {}
        subscriptionRef.current = null;
      }
      disconnectWebSocket();
      stompClientRef.current = null;
    };
  }, [token]);

  const loadConversations = async ({ force = false } = {}) => {
    try {
      if (!force && conversations.length === 0) {
        setLoading(true);
        setError(null);
      }
      const data = await getConversations({ force });
      if (!Array.isArray(data)) throw new Error("Invalid response");
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
      if (isMountedRef.current) setError("Không tải được tin nhắn.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const loadMessages = async (id) => {
    try {
      const data = await getMessagesByConversation(id);
      const mapped = data.map((m) => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        fromSelf: m.fromSelf,
        time: m.createdAt,
        avatar: m.senderAvatar || "https://i.pravatar.cc/150?img=3",
      }));
      if (isMountedRef.current) setMessages(mapped);
    } catch {
      if (isMountedRef.current) setMessages([]);
    }
  };

  const setupSubscription = (conversationId) => {
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
      } catch {}
      subscriptionRef.current = null;
    }

    const sub = subscribeConversation(conversationId, (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          content: msg.content,
          time: msg.createdAt,
          avatar: msg.senderAvatar || "https://i.pravatar.cc/150?img=3",
          fromSelf: msg.senderId === user?.id,
        },
      ]);

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

    subscriptionRef.current = sub;
  };

  const handleSelectChat = async (conv) => {
    setSelectedChat(conv);
    setMessages([]);

    const client = getStompClient();
    if (client?.connected) {
      try {
        client.publish({
          destination: "/app/chat.open",
          body: JSON.stringify({ conversationId: conv.id }),
        });
      } catch {}
    }

    await loadMessages(conv.id);

    if (client?.connected) setupSubscription(conv.id);

    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
    );
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(() => loadConversations(), 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      !autoSelectedRef.current &&
      !loading &&
      conversations.length > 0 &&
      !selectedChat
    ) {
      autoSelectedRef.current = true;

      let convToSelect = null;
      if (navigatedConversationId) {
        convToSelect = conversations.find(
          (c) => c.id === navigatedConversationId
        );
      }
      if (!convToSelect) {
        convToSelect = [...conversations].sort(
          (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
        )[0];
      }
      if (convToSelect) handleSelectChat(convToSelect);
    }
  }, [conversations, loading, selectedChat, navigatedConversationId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const content = message.trim();
    const convId = selectedChat.id;

    const optimistic = {
      id: Date.now(),
      content,
      fromSelf: true,
      time: new Date().toISOString(),
      avatar: myAvatar,
    };

    setMessages((prev) => [...prev, optimistic]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage: content,
              lastMessageAt: new Date().toISOString(),
            }
          : c
      )
    );

    setMessage("");

    sendMessageWS(convId, content);
  };

  const filteredConversations = conversations.filter((c) => {
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
    <div className="h-[calc(112vh-100px)] flex items-center justify-center p-4 pt-28 bg-gradient-to-br from-blue-200/60 via-white/70 to-indigo-200/60 backdrop-blur-sm">
      <div className="flex w-full max-w-6xl h-full rounded-3xl shadow-2xl overflow-hidden border border-white/30 bg-white/30 backdrop-blur-lg">
        {/* ------- LEFT PANEL ------- */}
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
              Chưa đọc ({conversations.filter((c) => c.unread > 0).length})
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

          {/* List Conversations */}
          <div className="overflow-y-auto flex-1 p-2 scrollbar-thin scrollbar-thumb-blue-400/50 scrollbar-track-transparent">
            {loading && (
              <div className="text-center p-4 text-gray-500">Đang tải...</div>
            )}
            {error && (
              <div className="text-center p-4 text-red-500">{error}</div>
            )}
            {!loading && filteredConversations.length === 0 && (
              <div className="text-center p-4 text-gray-500">
                Không tìm thấy hội thoại.
              </div>
            )}

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
                  className="w-12 h-12 rounded-full border border-white shadow-md object-cover"
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

        {/* ------- RIGHT CHAT PANEL ------- */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-white/80 via-blue-100/80 to-indigo-200/70 backdrop-blur-md relative">
          {selectedChat ? (
            <>
              {/* Header */}
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

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-blue-400/50 scrollbar-track-transparent"
              >
                {messages.map((m, i) => (
                  <div
                    key={m.id || i}
                    className={`flex ${
                      m.fromSelf ? "justify-end" : "justify-start"
                    } items-end gap-2`}
                  >
                    {!m.fromSelf && (
                      <img
                        src={m.avatar}
                        className="w-8 h-8 rounded-full border object-cover shadow-sm"
                        alt="user"
                      />
                    )}

                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow ${
                        m.fromSelf
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-tl-sm"
                      }`}
                    >
                      {m.content}
                      <div className="text-[10px] mt-1 text-right opacity-70">
                        {formatTime(m.time)}
                      </div>
                    </div>

                    {m.fromSelf && (
                      <img
                        src={myAvatar}
                        className="w-8 h-8 rounded-full border object-cover shadow-sm"
                        alt="me"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Input box */}
              <form
                onSubmit={handleSend}
                className="p-4 border-t border-white/40 bg-white/70 flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 rounded-full bg-white/60 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!stompClientRef.current?.connected}
                />

                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition disabled:bg-gray-400"
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
                Chọn một cuộc trò chuyện để bắt đầu
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateMessenger;
