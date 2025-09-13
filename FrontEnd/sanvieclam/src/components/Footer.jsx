import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-gray-300 pt-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between gap-20">

        {/* Cột 1: Logo */}
<div className="flex-1 flex flex-col justify-start">
  <div className="flex items-center -mt-6 mb-4">
    <img src="/Logo.png" alt="SinhVienJob Logo" className="w-12 h-12 rounded-lg"/>
    <span className="ml-3 text-2xl font-bold text-white">SinhVienJob</span>
  </div>
  <p className="mb-4">
    SinhVienJob là sàn giao dịch việc làm dành cho sinh viên, giúp kết nối các bạn trẻ với cơ hội việc làm thực tế.
  </p>
  <div className="space-y-2 text-sm text-gray-300">
    <p>Email: <a href="mailto:support@jobconnect.com" className="hover:text-white transition">support@jobconnect.com</a></p>
    <p>Hotline: <a href="tel:+840123456789" className="hover:text-white transition">+84 0123 456 789</a></p>
    <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
  </div>
  <div className="flex space-x-4 mt-4">
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
       className="hover:text-white transform hover:scale-110 transition-all duration-300 shadow-lg p-2 rounded-full bg-indigo-800">
      <FaFacebookF />
    </a>
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
       className="hover:text-white transform hover:scale-110 transition-all duration-300 shadow-lg p-2 rounded-full bg-blue-800">
      <FaLinkedinIn />
    </a>
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
       className="hover:text-white transform hover:scale-110 transition-all duration-300 shadow-lg p-2 rounded-full bg-sky-700">
      <FaTwitter />
    </a>
  </div>
</div>


        {/* Cột 2: Dành cho ứng viên */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-4">Dành cho Ứng viên</h3>
          <ul className="space-y-2">
            <li><a href="/search-jobs" className="hover:text-white transition transform hover:translate-x-1 duration-300">Tìm việc làm</a></li>
            <li><a href="/create-cv" className="hover:text-white transition transform hover:translate-x-1 duration-300">Tạo CV AI</a></li>
            <li><a href="/career-tips" className="hover:text-white transition transform hover:translate-x-1 duration-300">Mẹo nghề nghiệp</a></li>
            <li><a href="/profile" className="hover:text-white transition transform hover:translate-x-1 duration-300">Hồ sơ cá nhân</a></li>
          </ul>
        </div>

        {/* Cột 3: Dành cho nhà tuyển dụng */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-4">Dành cho Nhà tuyển dụng</h3>
          <ul className="space-y-2">
            <li><a href="/post-job" className="hover:text-white transition transform hover:translate-x-1 duration-300">Đăng tin tuyển dụng</a></li>
            <li><a href="/search-candidates" className="hover:text-white transition transform hover:translate-x-1 duration-300">Tìm ứng viên</a></li>
            <li><a href="/employer-dashboard" className="hover:text-white transition transform hover:translate-x-1 duration-300">Quản lý tuyển dụng</a></li>
            <li><a href="/pricing" className="hover:text-white transition transform hover:translate-x-1 duration-300">Báo giá dịch vụ</a></li>
          </ul>
        </div>

        {/* Cột 4: Hình ảnh / Trang Page */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h3 className="text-xl font-semibold text-white mb-4">Trang Page</h3>
          <img src="/assets/footer-image.png" alt="JobConnect Page" className="w-32 h-32 object-cover rounded-lg shadow-lg"/>
          <p className="mt-4 text-gray-400 text-sm text-center md:text-left">
            Khám phá cơ hội việc làm và kết nối với nhà tuyển dụng ngay hôm nay!
          </p>
        </div>

      </div>

      {/* Copyright */}
      <div className="mt-12 border-t border-gray-700 pt-3 pb-3 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} SinhVienJob. All rights reserved. Design by Trần Lợi.
      </div>
    </footer>
  );
};

export default Footer;
