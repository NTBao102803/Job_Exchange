import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageCircle } from "lucide-react";

const ChatBoxAI = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Xin chào 👋 Tôi là trợ lý AI tuyển dụng.\nBạn muốn tôi chia sẻ **mẹo phỏng vấn** hay **viết CV**?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      const aiMessage = { sender: "ai", text: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "❌ Lỗi server, vui lòng thử lại." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`flex items-center gap-2 bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-green-700 overflow-hidden ${
            hovered ? "px-5 w-40" : "w-14 px-0 justify-center"
          } py-3`}
        >
          <MessageCircle className="w-6 h-6" />
          {hovered && (
            <span className="whitespace-nowrap font-semibold text-sm">
              Chat với AI
            </span>
          )}
        </button>
      ) : (
        <div className="w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col border border-gray-300">
          {/* Header */}
          <div className="bg-green-600 text-white p-3 flex justify-between items-center rounded-t-xl">
            <span className="font-semibold">💬 Trợ lý tuyển dụng AI</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white font-bold hover:text-gray-200"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[75%] leading-relaxed whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-800 mr-auto"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 italic">⏳ Đang suy nghĩ...</div>
            )}
          </div>

          {/* Input */}
          <div className="p-2 border-t flex items-center gap-2">
            <textarea
              className="flex-1 border rounded-lg px-3 py-2 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBoxAI;
