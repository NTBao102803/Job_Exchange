import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/AuthApi";
import { Bell ,MessageCircle} from "lucide-react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import {
  getNotifications,
  markAsRead,
  getUnreadCount,
} from "../../api/NotificationApi";
import { useUser } from "../../context/UserContext";
import { getCandidateProfile } from "../../api/CandidateApi";
import { getUnreadMessageCount } from "../../api/messageApi";

const HeaderCandidate = ({
  onHomeClick,
  onJobClick,
  onCVAIClick,
  onJobSmartClick,
  onBlog,
  onFooter,
  onJobUTClick,
}) => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stompClient, setStompClient] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const { avatarUrl } = useUser();

  // ✅ 1️⃣ Lấy thông tin ứng viên (để biết ID)
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const profile = await getCandidateProfile();
        if (profile?.id) {
          setCandidateId(profile.id);
          setIsReady(true);
        } else {
          console.warn("Không tìm thấy ID ứng viên:", profile);
        }
      } catch (err) {
        console.error("Lỗi lấy candidate profile:", err);
      }
    };
    fetchCandidate();
  }, []);

  // ✅ 2️⃣ Lấy danh sách thông báo và số lượng chưa đọc
  useEffect(() => {
    if (!candidateId) return;

    const fetchNotifications = async () => {
      try {
        const [notifs, count, messageCount] = await Promise.all([
          getNotifications(candidateId),
          getUnreadCount(candidateId),
          getUnreadMessageCount(),
        ]);

        const formatted = notifs
          .map((n) => ({
            id: n.id,
            message: n.message,
            read: n.readFlag || false,
            createdAt: n.createdAt,
          }))
          .reverse();

        setNotifications(formatted);
        setUnreadCount(count);
        setUnreadMessageCount(messageCount);
      } catch (err) {
        console.error("Lỗi tải thông báo/tin nhắn:", err.message);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000); // cập nhật mỗi 30s
    return () => clearInterval(interval);
  }, [candidateId]);

  // ✅ 3️⃣ Kết nối WebSocket sau khi có candidateId
  useEffect(() => {
    if (!isReady || !candidateId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ Thiếu token, không thể kết nối WebSocket");
      return;
    }

    const socketUrl = `${import.meta.env.VITE_API_URL}/ws-notifications?token=${encodeURIComponent(
      token.replace("Bearer ", "")
    )}`;

    const socket = new SockJS(socketUrl);
    const client = over(socket);

    client.debug = (msg) => {
      if (msg.includes("ERROR") || msg.includes("CONNECTED"))
        console.log("🐛 [STOMP]:", msg);
    };

    client.connect(
      {},
      (frame) => {
        console.log("✅ Kết nối STOMP thành công:", frame);
        const topic = `/topic/notifications/${candidateId}`;
        console.log("📡 Subscribing:", topic);

        client.subscribe(topic, (message) => {
          try {
            const notif = JSON.parse(message.body);
            console.log("📩 Nhận thông báo mới:", notif);
            setNotifications((prev) => [notif, ...prev]);
            setUnreadCount((prev) => prev + 1);
          } catch (err) {
            console.error("⚠️ Lỗi parse message:", err);
          }
        });
      },
      (error) => console.error("🚨 Lỗi kết nối STOMP:", error)
    );

    setStompClient(client);

    const reconnect = setInterval(() => {
      if (!client.connected) {
        console.warn("🔄 Mất kết nối WebSocket, đang thử lại...");
        client.connect({}, () => console.log("♻️ Reconnected WebSocket"));
      }
    }, 10000);

    return () => {
      clearInterval(reconnect);
      if (client && client.connected) client.disconnect();
    };
  }, [isReady, candidateId]);

  // ✅ Ẩn header khi scroll
  const controlHeader = () => {
    if (typeof window !== "undefined") {
      setShow(window.scrollY <= lastScrollY);
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  };

  // ✅ Đánh dấu thông báo đã đọc
  const handleMarkAsRead = async (id) => {
    try {
      const updated = await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: updated.readFlag } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Lỗi đánh dấu đã đọc:", err.message);
    }
  };

  // ✅ Toggle menu / notif
  const toggleMenu = () => {
    setMenuOpen((prev) => {
      if (!prev) setNotifOpen(false);
      return !prev;
    });
  };

  const toggleNotifications = () => {
    setNotifOpen((prev) => {
      if (!prev) setMenuOpen(false);
      return !prev;
    });
  };

  // ✅ Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white shadow-md w-full fixed top-0 z-50 transform transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between py-5">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={onHomeClick}>
          <img src="/Logo.png" alt="Logo" className="w-14 h-14 rounded-lg" />
          <span className="ml-6 text-2xl font-bold">SinhVienJob</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex justify-evenly ml-32">
          <button onClick={onHomeClick} className="hover:text-pink-400">
            Trang chủ
          </button>
          <button onClick={onJobClick} className="hover:text-pink-400">
            Việc làm
          </button>
          <button onClick={onCVAIClick} className="hover:text-pink-400">
            Tạo CV AI
          </button>
          <button onClick={onJobSmartClick} className="hover:text-pink-400">
            Gợi ý việc làm
          </button>
          <button onClick={onJobUTClick} className="hover:text-pink-400">
            Việc làm đã ứng tuyển
          </button>
          <button onClick={onBlog} className="hover:text-pink-400">
            Blog
          </button>
          <button onClick={onFooter} className="hover:text-pink-400">
            Liên hệ
          </button>
          <button
            onClick={() => navigate("/candidate/dashboard-candidatemessenger")}
            className="relative p-2 rounded-full hover:bg-white/10 transition"
          >
            <MessageCircle className="w-6 h-6" />
            {unreadMessageCount > 0 && ( 
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
              {unreadMessageCount}
            </span>
            )}
          </button>

          {/* 🔔 Thông báo */}
          <div className="relative flex items-center" ref={notifRef}>
            <button
              onClick={toggleNotifications}
              className="relative p-2 rounded-full hover:bg-white/10 transition"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {notifOpen && (
              <div className="absolute top-14 right-1/2 translate-x-1/2 w-80 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45 shadow-sm"></div>
                </div>

                <div className="px-4 py-3 font-semibold text-indigo-600 border-b bg-gray-50 text-center">
                  Thông báo
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => !n.read && handleMarkAsRead(n.id)}
                        className={`px-4 py-3 text-sm border-b last:border-0 cursor-pointer transition flex items-start gap-2 ${
                          n.read
                            ? "text-gray-500 bg-white hover:bg-gray-50"
                            : "text-gray-900 font-medium bg-indigo-50 hover:bg-indigo-100"
                        }`}
                      >
                        {!n.read && (
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        )}
                        <div className="flex-1">
                          <p className="leading-tight">{n.message}</p>
                          {n.createdAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(n.createdAt).toLocaleString("vi-VN")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-10 text-center text-gray-400 text-sm">
                      Không có thông báo
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 text-xs text-gray-500 text-center bg-gray-50">
                  {unreadCount > 0
                    ? `Bạn có ${unreadCount} thông báo chưa đọc`
                    : "Đã xem tất cả"}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Avatar */}
        <div className="relative" ref={menuRef}>
          <div
            className="w-12 h-12 rounded-full bg-gray-300 cursor-pointer overflow-hidden border-2 border-white"
            onClick={toggleMenu}
          >
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {menuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-48 bg-white text-gray-800 rounded-xl shadow-lg py-2 z-50">
              <button
                onClick={() => navigate("/candidate/candidateprofile")}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                Hồ sơ của tôi
              </button>
              <button
                onClick={() => navigate("/candidate/change-password")}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                Thay đổi mật khẩu
              </button>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderCandidate;