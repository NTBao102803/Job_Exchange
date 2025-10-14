import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../api/AuthApi"; // 👉 gọi API đổi mật khẩu

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // validate
  const validateForm = () => {
    let errs = {};

    if (!form.oldPassword) {
      errs.oldPassword = "Vui lòng nhập mật khẩu cũ";
    }

    if (!form.newPassword) {
      errs.newPassword = "Mật khẩu mới không được để trống";
    } else if (form.newPassword.length < 8) {
      errs.newPassword = "Mật khẩu mới phải ít nhất 8 ký tự";
    } else if (
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(
        form.newPassword
      )
    ) {
      errs.newPassword =
        "Mật khẩu mới phải có chữ hoa, chữ thường, số và ký tự đặc biệt";
    }

    if (form.newPassword !== form.confirmNewPassword) {
      errs.confirmNewPassword = "Mật khẩu nhập lại không khớp";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      };

      console.log("🔹 Dữ liệu gửi lên API:", data);
      await changePassword(data);

      // ✅ Hiển thị thông báo
      alert("✅ Đổi mật khẩu thành công!");

      // ✅ Xóa nội dung trong form (clear input)
      setForm({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      // ✅ Giữ nguyên trang — không navigate, không logout
    } catch (err) {
      console.error("❌ Lỗi đổi mật khẩu:", err.response?.data || err.message);
      setErrors({
        oldPassword:
          err.response?.data?.message ||
          "❌ Mật khẩu cũ không đúng hoặc lỗi máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 min-h-screen flex bg-gray-100"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Bên trái */}
      <div className="w-1/3 relative flex items-center justify-center bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/changepassword.png')" }}
        ></div>

        <div className="relative z-10 text-center p-8 text-white drop-shadow-lg">
          <img
            src="/Logo.png"
            alt="Logo"
            className="mx-auto mb-6 w-24 h-24 rounded-xl shadow-lg border-2 border-white"
          />
          <h2 className="text-3xl font-extrabold mb-4">Đổi mật khẩu</h2>
          <p className="text-base leading-relaxed max-w-xs mx-auto">
            Cập nhật mật khẩu mới để bảo mật tài khoản của bạn.
          </p>
        </div>
      </div>

      {/* Bên phải */}
      <div className="w-2/3 flex flex-col bg-white shadow-2xl relative z-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg p-10">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center tracking-wide">
              Đổi mật khẩu
            </h1>
            <form className="space-y-6" onSubmit={handleChangePassword}>
              {/* Mật khẩu cũ */}
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2">
                  Mật khẩu cũ
                </label>
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={form.oldPassword}
                  onChange={(e) =>
                    setForm({ ...form, oldPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-12"
                  placeholder="Nhập mật khẩu cũ"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-4 top-[42px] text-gray-500 hover:text-indigo-600"
                >
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.oldPassword && (
                  <p className="text-red-500 text-sm">{errors.oldPassword}</p>
                )}
              </div>

              {/* Mật khẩu mới */}
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-12"
                  placeholder="Tạo mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-[42px] text-gray-500 hover:text-indigo-600"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">{errors.newPassword}</p>
                )}
              </div>

              {/* Nhập lại mật khẩu mới */}
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2">
                  Nhập lại mật khẩu mới
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmNewPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmNewPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-12"
                  placeholder="Nhập lại mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-[42px] text-gray-500 hover:text-indigo-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                {errors.confirmNewPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmNewPassword}
                  </p>
                )}
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-lg transform transition duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-400 via-blue-500 to-indigo-500 hover:opacity-95 hover:scale-[1.02]"
                }`}
              >
                {loading ? "⏳ Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChangePassword;
