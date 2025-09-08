// src/pages/RegisterRecruiterPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const RegisterRecruiter = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    companyName: "",
    companyAddress: "",
  });

  const isComplete =
    form.email &&
    form.password &&
    form.confirmPassword &&
    form.fullName &&
    form.phone &&
    form.companyName &&
    form.companyAddress &&
    form.password === form.confirmPassword;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 min-h-screen flex bg-gray-100"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Bên trái */}
      <div className="w-1/3 relative flex items-center justify-center bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/registerrecruiter.png')" }}
        ></div>
        <div className="relative z-10 text-center p-8 text-white drop-shadow-lg">
          <img
            src="/Logo.png"
            alt="Logo"
            className="mx-auto mb-6 w-24 h-24 rounded-xl shadow-lg border-2 border-white"
          />
          <h2 className="text-3xl font-extrabold mb-4">
            Trở thành Nhà tuyển dụng
          </h2>
          <p className="text-base leading-relaxed max-w-xs mx-auto">
            Đăng ký ngay để tiếp cận ứng viên tiềm năng và phát triển thương hiệu công ty.
          </p>
        </div>
      </div>

      {/* Bên phải: Form */}
      <div className="w-2/3 flex flex-col bg-white shadow-2xl relative z-10 overflow-y-auto">
        <div className="w-full max-w-lg mx-auto py-12 px-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-wide">
            Đăng ký Nhà tuyển dụng
          </h1>

          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1">
                Email công ty <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                placeholder="Email công ty..."
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm pr-10"
                placeholder="Mật khẩu..."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Nhập lại mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm pr-10"
                placeholder="Nhập lại mật khẩu..."
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-10 text-gray-500 hover:text-indigo-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Title Thông tin nhà tuyển dụng */}
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">
              Thông tin nhà tuyển dụng
            </h2>

            {/* Full Name */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Họ & tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                placeholder="Họ & tên..."
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Số điện thoại cá nhân <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                placeholder="Số điện thoại..."
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Tên công ty <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                placeholder="Tên công ty..."
              />
            </div>

            {/* Company Address */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Địa chỉ làm việc <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyAddress"
                value={form.companyAddress}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                placeholder="Địa chỉ làm việc..."
              />
            </div>

            {/* Button Đăng ký */}
            <button
              type="submit"
              disabled={!isComplete}
              className={`w-full py-3 rounded-3xl mt-4 bg-gradient-to-r from-green-400 via-blue-500 to-indigo-500 text-white font-bold text-lg shadow-lg transition duration-300 transform hover:scale-[1.02] ${
                !isComplete ? "opacity-50 cursor-not-allowed" : "opacity-100"
              }`}
            >
              Đăng ký ngay
            </button>

            {/* Nút quay lại Login */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Bạn đã có tài khoản? </span>
              <button
                onClick={() => navigate("/login")}
                className="text-indigo-600 hover:underline font-medium"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterRecruiter;
