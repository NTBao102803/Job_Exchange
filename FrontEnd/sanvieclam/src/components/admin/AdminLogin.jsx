import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/AuthApi";

const AdminLogin = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    if (!email.trim()) return "Vui lòng nhập email";
    if (!passWord.trim()) return "Vui lòng nhập mật khẩu";
    if (passWord.trim().length < 8) return "Mật khẩu quá ngắn (tối thiểu 8 ký tự)";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email: email, passWord: passWord });
      const { accessToken, user } = res.data;

      if (!user?.role || user.role.roleName !== "ADMIN") {
        setError("Bạn không có quyền truy cập khu vực quản trị");
        setLoading(false);
        return;
      }

      // Lưu token và user vào localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/admin/dashboard"); // điều hướng sang admin dashboard
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Sai tài khoản hoặc mật khẩu!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-purple-50 to-pink-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl"
      >
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/30">
          {/* Header */}
          <div className="px-8 py-10 bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Đăng nhập Admin</h1>
            <p className="mt-2 text-sm md:text-base text-indigo-200/80">
              Vui lòng nhập tài khoản quản trị để truy cập dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">Tên đăng nhập</span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                placeholder="admin@example.com"
              />
            </label>

            <label className="block mb-3 relative">
              <span className="text-sm font-medium text-gray-700">Mật khẩu</span>
              <div className="mt-2 relative">
                <input
                  type={showPassword ? "text" : "passWord"}
                  value={passWord}
                  onChange={(e) => setPassWord(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between mt-4">
              <label className="inline-flex items-center text-sm">
                <input type="checkbox" className="form-checkbox h-4 w-4 rounded text-indigo-600" />
                <span className="ml-2 text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
            </div>

            <div className="mt-6">
              <motion.button
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3 font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg ${
                  loading ? "opacity-70 pointer-events-none" : "hover:scale-[1.01] transition"
                }`}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </motion.button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} SinhVienJob — Khu vực quản trị
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;