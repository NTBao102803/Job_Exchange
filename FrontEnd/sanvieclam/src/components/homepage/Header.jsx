import React, { useState, useRef, useEffect } from "react";

const Header = ({ onHomeClick, onJobsClick,onCvAiBannerClick,onRecruiterSection,onFooter ,onBlog}) => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef(null);

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

  return (
    <header
      ref={headerRef}
      className={`bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white shadow-md w-full fixed top-0 z-50 transform transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between py-5">
        <div className="flex items-center cursor-pointer" onClick={onHomeClick}>
          <img src="/Logo.png" alt="SinhVienJob Logo" className="w-16 h-16 rounded-lg" />
          <span className="ml-7 text-2xl font-bold">SinhVienJob</span>
        </div>

        <nav className="flex-1 flex justify-evenly ml-40">
          <button onClick={onHomeClick} className="hover:text-pink-400 transition duration-300">Trang chủ</button>
          <button onClick={onJobsClick} className="hover:text-pink-400 transition duration-300">Việc làm</button>
          <button onClick={onCvAiBannerClick} className="hover:text-pink-400 transition duration-300">Tạo CV AI</button>
          <button onClick={onRecruiterSection} className="hover:text-pink-400 transition duration-300">Dành cho Nhà tuyển dụng</button>
          <button onClick={onBlog} className="hover:text-pink-400 transition duration-300">Blog</button>
          <button onClick={onFooter} className="hover:text-pink-400 transition duration-300">Liên hệ</button>
        </nav>

        <div className="flex space-x-4">
          <a href="/login" className="px-4 py-2 border border-white rounded hover:bg-white hover:text-indigo-900 transition duration-300">Đăng nhập</a>
        </div>
      </div>
    </header>
  );
};

export default Header;

