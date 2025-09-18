import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/AuthApi";

const HeaderCandidate = ({ onHomeClick,onJobClick,onCVAIClick,onJobSmartClick,onBlog,onFooter,onJobUTClick}) => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();

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
          <button onClick={onJobClick}className="hover:text-pink-400 transition duration-300">Việc làm</button>
          <button onClick={onCVAIClick}className="hover:text-pink-400 transition duration-300">Tạo CV AI</button>
          <button onClick={onJobSmartClick}className="hover:text-pink-400 transition duration-300">Gợi ý việc làm thông minh</button>
          <button onClick={onJobUTClick}className="hover:text-pink-400 transition duration-300">Việc làm đã ứng tuyển</button>
          <button onClick={onBlog} className="hover:text-pink-400 transition duration-300">Blog</button>
          <button onClick={onFooter} className="hover:text-pink-400 transition duration-300">Liên hệ</button>
        </nav>

        {/* User Avatar + Dropdown */}
        <div className="relative">
          <div
            className="w-12 h-12 rounded-full bg-gray-300 cursor-pointer overflow-hidden border-2 border-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img src="/user-candidate.png" alt="User Avatar" className="w-full h-full object-cover" />
          </div>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-xl shadow-lg py-2 z-50">
              <button onClick ={() => navigate("/candidate/candidateprofile")} className="block px-4 py-2 w-full text-left hover:bg-gray-100">Hồ sơ của tôi</button>
              <button onClick={handleLogout} className="block px-4 py-2 w-full text-left hover:bg-gray-100">Đăng xuất</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderCandidate;