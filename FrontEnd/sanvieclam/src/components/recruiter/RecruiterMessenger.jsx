// src/components/RecruiterMessenger.jsx
import React, { useState } from "react";
import { Send, Search, MoreHorizontal } from "lucide-react";

const RecruiterMessenger = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Danh sách ứng viên mẫu
  const conversations = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      lastMessage: "Cảm ơn anh đã phản hồi!",
      time: "1 giờ trước",
      unread: 1,
      avatar: "/default-user.png",
      messages: [
        { from: "candidate", text: "Xin chào, tôi đã nộp hồ sơ.", time: "09:30" },
        { from: "me", text: "Cảm ơn bạn, chúng tôi sẽ liên hệ sớm.", time: "09:35" },
      ],
    },
    {
      id: 2,
      name: "Trần Thị B",
      lastMessage: "Tôi rất quan tâm vị trí này.",
      time: "Hôm qua",
      unread: 0,
      avatar: "/default-user.png",
      messages: [
        { from: "candidate", text: "Tôi rất quan tâm vị trí này.", time: "14:00" },
      ],
    },
  ];

  const filteredConversations = conversations.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "unread" ? c.unread > 0 : true;
    return matchSearch && matchFilter;
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const updated = { ...selectedChat };
    updated.messages = [
      ...updated.messages,
      { from: "me", text: message.trim(), time: "Bây giờ" },
    ];
    updated.lastMessage = message.trim();
    setSelectedChat(updated);
    setMessage("");
  };

  const handleSelectChat = (conv) => setSelectedChat({ ...conv, unread: 0 });

  return (
    <div className="h-[calc(112vh-100px)] flex items-center justify-center p-4 pt-28 bg-gradient-to-br from-indigo-200/60 via-white/70 to-purple-200/60 backdrop-blur-sm">
      <div className="flex w-full max-w-6xl h-full rounded-3xl shadow-2xl overflow-hidden border border-white/30 bg-white/30 backdrop-blur-lg">

        {/* DANH SÁCH ỨNG VIÊN */}
        <div className="w-1/3 flex flex-col border-r border-white/40 bg-gradient-to-b from-purple-300/70 via-purple-200/60 to-white/70 backdrop-blur-md relative">
          {/* Header */}
          <div className="p-4 border-b border-white/40 flex items-center justify-between bg-white/70 backdrop-blur-md shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">Đoạn chat</h2>
            <MoreHorizontal className="text-gray-500 cursor-pointer hover:text-gray-700 transition" />
          </div>

          {/* Filter buttons */}
          <div className="flex justify-around border-b border-white/40 text-sm font-medium text-gray-600 bg-white/40 backdrop-blur-sm">
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
              Chưa đọc
            </button>
          </div>

          {/* Search box */}
          <div className="p-3">
            <div className="flex items-center bg-white/70 rounded-full px-3 py-2 shadow-inner backdrop-blur-sm border border-white/30">
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

          {/* List */}
          <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300/60 scrollbar-track-transparent p-2">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectChat(conv)}
                className={`relative flex items-center gap-3 p-3 cursor-pointer transition rounded-xl mx-1 mb-2 ${
                  selectedChat?.id === conv.id
                    ? "bg-purple-500/20 border border-purple-400/40 shadow-inner"
                    : "hover:bg-white/40"
                }`}
              >
                <img
                  src={conv.avatar}
                  alt={conv.name}
                  className="w-12 h-12 rounded-full object-cover border border-white shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-gray-800">{conv.name}</p>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{conv.time}</span>
                  {conv.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Gradient fade bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
        </div>

        {/* KHUNG CHAT */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-white/80 via-purple-100/80 to-indigo-200/70 backdrop-blur-md relative">
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-white/40 bg-gradient-to-r from-purple-50/80 to-white/80 backdrop-blur-lg shadow">
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-10 h-10 rounded-full object-cover border border-white shadow-md"
                />
                <div>
                  <p className="font-semibold text-gray-800">{selectedChat.name}</p>
                  <p className="text-xs text-green-500 font-medium">Đang hoạt động</p>
                </div>
              </div>

              {/* Nội dung */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {selectedChat.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-md transition-all duration-300 ${
                        m.from === "me"
                          ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-br-none shadow-purple-300/50"
                          : "bg-white/80 text-gray-800 rounded-bl-none shadow-gray-200/60"
                      }`}
                    >
                      {m.text}
                      <div
                        className={`text-[10px] mt-1 text-right ${
                          m.from === "me" ? "text-purple-100" : "text-gray-500"
                        }`}
                      >
                        {m.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input box */}
              <form
                onSubmit={handleSend}
                className="p-4 border-t border-white/40 bg-white/70 backdrop-blur-md flex items-center gap-3 shadow-inner"
              >
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 border border-gray-300/40 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400 bg-white/60 backdrop-blur-sm shadow-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition shadow-md hover:shadow-purple-400/40"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-lg font-medium">
              💬 Chọn một ứng viên để bắt đầu
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterMessenger;
