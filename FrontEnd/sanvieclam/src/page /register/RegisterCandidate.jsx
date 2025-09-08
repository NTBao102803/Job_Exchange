// src/pages/RegisterCandidatePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const RegisterCandidate = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-50 min-h-screen flex bg-gray-100"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Bên trái: Logo + giới thiệu */}
      <div className="w-1/3 relative flex items-center justify-center bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/logohomebanner3.png')" }}
        ></div>

        <div className="relative z-10 text-center p-8 text-white drop-shadow-lg">
          <img
            src="/Logo.png"
            alt="Logo"
            className="mx-auto mb-6 w-24 h-24 rounded-xl shadow-lg border-2 border-white"
          />
          <h2 className="text-3xl font-extrabold mb-4">
            Trở thành Ứng viên tại SinhVienJob
          </h2>
          <p className="text-base leading-relaxed max-w-xs mx-auto">
            Đăng ký ngay để tiếp cận hàng ngàn việc làm hấp dẫn,  
            kết nối trực tiếp với các nhà tuyển dụng và xây dựng sự nghiệp mơ ước.
          </p>
        </div>
      </div>

      {/* Bên phải: Form đăng ký */}
      <div className="w-2/3 flex flex-col bg-white shadow-2xl relative z-10">

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg p-10">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center tracking-wide">
              Đăng ký Ứng viên
            </h1>
            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Nhập họ và tên..."
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Nhập email..."
                />
              </div>

              {/* Mật khẩu */}
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2">
                  Mật khẩu
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-12"
                  placeholder="Tạo mật khẩu..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[42px] text-gray-500 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2">
                  Nhập lại mật khẩu
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-12"
                  placeholder="Nhập lại mật khẩu..."
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-[42px] text-gray-500 hover:text-indigo-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 via-blue-500 to-indigo-500 text-white font-bold text-lg shadow-lg hover:opacity-95 transform hover:scale-[1.02] transition duration-300"
              >
                Đăng ký ngay
              </button>
            </form>

            {/* Link phụ */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Bạn đã có tài khoản? </span>
              <button
                onClick={() => navigate("/login")}
                className="text-indigo-600 hover:underline font-medium"
              >
                Đăng nhập
              </button>
            </div>

            {/* Ghi chú nhỏ */}
            <p className="mt-10 text-center text-gray-400 text-sm">
              Khi đăng ký, bạn đồng ý với{" "}
              <a href="/terms" className="text-indigo-500 hover:underline">
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a href="/privacy" className="text-indigo-500 hover:underline">
                Chính sách bảo mật
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterCandidate;
