import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axiosClient from "../../api/axiosClient";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axiosClient.post("/auth/login", {
        email,
        passWord,
      });
      const { accessToken, user } = data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      const role = user.role.roleName;
      if (role === "USER") navigate("/candidate/dashboard-candidate");
      else if (role === "EMPLOYER") navigate("/recruiter/dashboard-recruiter");
      else navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Đăng nhập thất bại! Vui lòng thử lại.";
      const finalMessage = message.includes(": ")
        ? message.split(": ").pop()
        : message;
      setError(finalMessage);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Form đăng nhập */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-lg p-10">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center tracking-wide">
            Đăng nhập tài khoản
          </h1>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Nhập email..."
                required
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 font-semibold mb-2">
                Mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={passWord}
                onChange={(e) => setPassWord(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-12"
                placeholder="Nhập mật khẩu..."
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:opacity-95 transform hover:scale-[1.02] transition duration-300"
            >
              Đăng nhập
            </button>
          </form>

          <div className="flex justify-between items-center mt-6 text-sm">
            <a
              href="/forgot-password"
              className="text-indigo-600 hover:underline font-medium"
            >
              Quên mật khẩu?
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/register-candidate")}
              className="py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold shadow-md hover:scale-[1.03] transition"
            >
              Đăng ký Ứng viên
            </button>
            <button
              onClick={() => navigate("/register-recruiter")}
              className="py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold shadow-md hover:scale-[1.03] transition"
            >
              Đăng ký Nhà tuyển dụng
            </button>
          </div>

          <p className="mt-10 text-center text-gray-400 text-sm">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
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

      {/* Banner bên phải */}
      <div className="w-1/3 relative flex items-center justify-center bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/logohomebanner3.png')" }}
        />
        <div className="relative z-10 text-center p-8 text-white drop-shadow-lg">
          <img
            src="/Logo.png"
            alt="Logo"
            className="mx-auto mb-6 w-24 h-24 rounded-xl shadow-lg border-2 border-white"
          />
          <h2 className="text-3xl font-extrabold mb-4">
            Chào mừng bạn đến với SinhVienJob
          </h2>
          <p className="text-base leading-relaxed max-w-xs mx-auto">
            Nơi kết nối <strong>Ứng viên</strong> và{" "}
            <strong>Nhà tuyển dụng</strong>. Hãy đăng nhập để bắt đầu hành trình
            sự nghiệp hoặc tìm kiếm nhân tài!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;