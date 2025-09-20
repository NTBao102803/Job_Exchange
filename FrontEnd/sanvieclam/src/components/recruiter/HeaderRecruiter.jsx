import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/AuthApi";
import { Bell } from "lucide-react";

const HeaderRecruiter = ({ onHomeClick,onUpTinClick,onSmartCandidate,onQLBD,onFooter}) => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Bạn có ứng viên mới phù hợp!", read: false },
    { id: 2, message: "Bài đăng của bạn đã được duyệt.", read: false },
  ]);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const controlHeader = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) setShow(false);
      else setShow(true);
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlHeader);
      return () => window.removeEventListener("scroll", controlHeader);
    }
  }, [lastScrollY]);

  const handleLogout = async () => {
    try {
      await logout();   // gọi API logout + xoá token
      navigate("/login"); // điều hướng về trang login
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  };
    // số thông báo chưa đọc
  const unreadCount = notifications.filter(n => !n.read).length;

  // mở menu avatar
    const toggleMenu = () => {
      setMenuOpen(prev => {
        if (!prev) setNotifOpen(false); // tắt notif khi mở menu
        return !prev;
      });
    };
  
    // mở thông báo
    const toggleNotifications = () => {
      setNotifOpen(prev => {
        if (!prev) setMenuOpen(false); // tắt menu khi mở notif
        return !prev;
      });
      if (!notifOpen) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        );
      }
    };
  
    // 👉 đóng khi click ra ngoài
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (
          menuRef.current && !menuRef.current.contains(e.target) &&
          notifRef.current && !notifRef.current.contains(e.target)
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
          <img src="/Logo.png" alt="SinhVienJob Logo" className="w-14 h-14 rounded-lg" />
          <span className="ml-6 text-2xl font-bold">SinhVienJob</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex justify-evenly ml-32">
          <button onClick={onHomeClick} className="hover:text-pink-400 transition duration-300">Trang chủ</button>
          <button onClick={onUpTinClick} className="hover:text-pink-400 transition duration-300">Đăng tin tuyển dụng</button>
          <button onClick={onSmartCandidate}className="hover:text-pink-400 transition duration-300">Gợi ý ứng viên thông minh</button>
          <button onClick={onQLBD} className="hover:text-pink-400 transition duration-300">Quản lý bài đăng</button>
          <button onClick={onFooter} className="hover:text-pink-400 transition duration-300">Liên hệ</button>
          {/* Notification bell */}
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

            {/* Notification dropdown */}
            {notifOpen && (
              <div className="absolute top-14 right-1/2 translate-x-1/2 w-80 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {/* Mũi tên trỏ lên chuông */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45 shadow-sm"></div>
                </div>

                {/* Header */}
                <div className="px-4 py-3 font-semibold text-indigo-600 border-b bg-gray-50 text-center">
            Thông báo
          </div>


              {/* Content */}
              <div className="max-h-72 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 text-sm border-b last:border-0 cursor-pointer transition ${
                        n.read
                          ? "text-gray-500 bg-white hover:bg-gray-50"
                          : "text-gray-900 font-medium bg-indigo-50 hover:bg-indigo-100"
                      }`}
                    >
                      {n.message}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-10 text-center text-gray-400 text-sm">
                    Không có thông báo
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 text-xs text-gray-500 text-center bg-gray-50">
                Đã xem tất cả thông báo
              </div>  
            </div>
          )}
        </div>        
        </nav>

        {/* User Avatar + Dropdown */}
        <div className="relative"ref={menuRef}>
          <div
            className="w-12 h-12 rounded-full bg-gray-300 cursor-pointer overflow-hidden border-2 border-white"
            onClick={toggleMenu}
          >
            <img src="/user-candidate.png" alt="User Avatar" className="w-full h-full object-cover" />
          </div>

          {menuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-48 bg-white text-gray-800 rounded-xl shadow-lg py-2 z-50">
              <button
                onClick={() => navigate("/recruiter/recruiterprofile")}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                Hồ sơ của tôi
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

export default HeaderRecruiter;