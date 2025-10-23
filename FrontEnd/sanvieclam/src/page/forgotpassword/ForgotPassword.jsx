import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email"); // email | otp | reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isShaking, setIsShaking] = useState(false);
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Reset lỗi khi đổi bước
  useEffect(() => setError(""), [step]);

  // ✅ Đếm ngược resend OTP
  useEffect(() => {
    if (step === "otp" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  // ✅ Gửi OTP
  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Vui lòng nhập email để nhận mã OTP.");

    setLoading(true);
    setTimeout(() => {
      alert(`✅ Mã OTP đã được gửi tới ${email}`);
      setStep("otp");
      setTimeLeft(60);
      setLoading(false);
    }, 800);
  };

  // ✅ Xác thực OTP
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return setError("Mã OTP phải đủ 6 chữ số!");
    }

    setLoading(true);
    setTimeout(() => {
      alert("✅ Mã OTP hợp lệ!");
      setStep("reset");
      setLoading(false);
    }, 800);
  };

  // ✅ Gửi lại OTP
  const resendOtp = () => {
    if (timeLeft === 0) {
      alert(`🔁 Gửi lại OTP tới ${email}`);
      setOtp(Array(6).fill(""));
      setTimeLeft(60);
    }
  };

  // ✅ Đổi mật khẩu
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (form.newPassword.length < 8)
      return setError("Mật khẩu phải có ít nhất 8 ký tự.");
    if (form.newPassword !== form.confirmPassword)
      return setError("Mật khẩu nhập lại không khớp.");

    setLoading(true);
    setTimeout(() => {
      alert("✅ Đổi mật khẩu thành công! Hãy đăng nhập lại.");
      setEmail("");
      setOtp(Array(6).fill(""));
      setForm({ newPassword: "", confirmPassword: "" });
      setStep("email");
      setLoading(false);
      navigate("/login"); // 🔁 Chuyển sang trang đăng nhập
    }, 800);
  };

  // ✅ OTP logic
  const handleChangeOtp = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`).focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`).focus();
  };

  // ✅ Animation
  const pageTransition = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeInOut" },
  };

  return (
    <motion.div
      className="fixed inset-0 flex min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* --- Cột trái --- */}
      <div className="w-1/3 relative flex items-center justify-center bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              step === "email"
                ? "url('/forgotpassword.png')"
                : step === "otp"
                ? "url('/otpverify.png')"
                : "url('/resetpassword.png')",
          }}
        />
        <div className="relative z-10 text-center text-white p-8">
          <img
            src="/Logo.png"
            alt="Logo"
            className="mx-auto mb-6 w-24 h-24 rounded-xl shadow-lg"
          />
          <h2 className="text-3xl font-extrabold mb-4 tracking-wide">
            {step === "email"
              ? "Quên mật khẩu"
              : step === "otp"
              ? "Xác thực OTP"
              : "Đặt lại mật khẩu"}
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed">
            {step === "email"
              ? "Nhập email để nhận mã OTP khôi phục tài khoản."
              : step === "otp"
              ? `Mã OTP đã được gửi đến ${email}.`
              : `Tạo mật khẩu mới cho tài khoản ${email}.`}
          </p>
        </div>
      </div>

      {/* --- Cột phải --- */}
      <div className="w-2/3 flex items-center justify-center bg-white shadow-2xl">
        <div className="w-full max-w-md p-10">
          <AnimatePresence mode="wait">
            {/* --- Bước 1: Nhập Email --- */}
            {step === "email" && (
              <motion.form
                key="email"
                {...pageTransition}
                onSubmit={handleSendOTP}
                className="space-y-6 text-center"
              >
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
                  Quên mật khẩu?
                </h1>
                <p className="text-gray-500 mb-6">
                  Hãy nhập email của bạn để nhận mã xác thực khôi phục tài khoản.
                </p>

                <input
                  type="email"
                  placeholder="📧 Nhập địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-lg transition duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-400 via-blue-500 to-indigo-500 hover:scale-[1.02]"
                  }`}
                >
                  {loading ? "⏳ Đang gửi..." : "Gửi mã OTP"}
                </button>

                <p className="text-gray-500 text-sm mt-4">
                  🔙 Đã nhớ mật khẩu?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-indigo-600 font-semibold cursor-pointer hover:underline"
                  >
                    Quay lại đăng nhập
                  </span>
                </p>
              </motion.form>
            )}

            {/* --- Bước 2: Nhập OTP --- */}
            {step === "otp" && (
              <motion.div key="otp" {...pageTransition}>
                <h1 className="text-3xl font-extrabold text-indigo-600 mb-6 text-center">
                  Nhập mã OTP
                </h1>
                <p className="text-gray-600 text-center mb-6">
                  Vui lòng nhập mã gồm{" "}
                  <span className="font-semibold">6 chữ số</span> được gửi đến email.
                </p>

                <motion.form
                  onSubmit={handleVerifyOTP}
                  animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex justify-center gap-4 mb-6">
                    {otp.map((val, i) => (
                      <motion.input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength="1"
                        value={val}
                        onChange={(e) => handleChangeOtp(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className="w-14 h-14 text-center text-2xl font-bold 
                          border border-gray-300 rounded-xl shadow-sm
                          bg-gray-50 text-gray-800 focus:border-indigo-500 
                          focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
                        whileFocus={{ scale: 1.15 }}
                      />
                    ))}
                  </div>

                  {error && (
                    <p className="text-red-500 text-center text-sm mb-2">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-lg transition duration-300 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-400 via-blue-500 to-indigo-500 hover:scale-[1.02]"
                    }`}
                  >
                    {loading ? "⏳ Đang xác thực..." : "Xác nhận OTP"}
                  </button>

                  <div className="mt-6 text-center text-sm text-gray-600">
                    {timeLeft > 0 ? (
                      <>Gửi lại OTP sau <span className="font-semibold">{timeLeft}s</span></>
                    ) : (
                      <button
                        onClick={resendOtp}
                        className="text-indigo-600 font-semibold hover:underline"
                      >
                        Gửi lại OTP
                      </button>
                    )}
                  </div>

                  <p className="text-gray-500 text-sm mt-6 text-center">
                    🔙 Đã nhớ mật khẩu?{" "}
                    <span
                      onClick={() => navigate("/login")}
                      className="text-indigo-600 font-semibold cursor-pointer hover:underline"
                    >
                      Quay lại đăng nhập
                    </span>
                  </p>
                </motion.form>
              </motion.div>
            )}

            {/* --- Bước 3: Đặt lại mật khẩu --- */}
            {step === "reset" && (
              <motion.form
                key="reset"
                {...pageTransition}
                onSubmit={handleResetPassword}
                className="space-y-6 text-center"
              >
                <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
                  Đặt lại mật khẩu
                </h1>
                <p className="text-gray-500 mb-4">
                  Hãy nhập mật khẩu mới để bảo vệ tài khoản của bạn.
                </p>

                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    placeholder="🔑 Mật khẩu mới"
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm({ ...form, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-[10px] text-gray-500"
                  >
                    {show ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <input
                  type={show ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-lg transition duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-400 via-blue-500 to-indigo-500 hover:scale-[1.02]"
                  }`}
                >
                  {loading ? "⏳ Đang xử lý..." : "Xác nhận đổi mật khẩu"}
                </button>

                <p className="text-gray-500 text-sm mt-6">
                  🔙 Đã nhớ mật khẩu?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-indigo-600 font-semibold cursor-pointer hover:underline"
                  >
                    Quay lại đăng nhập
                  </span>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
