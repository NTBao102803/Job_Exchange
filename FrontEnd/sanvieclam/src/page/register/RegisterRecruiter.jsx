import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { requestOTP, verifyOTP } from "../../api/RecruiterApi";

const RegisterRecruiter = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [step, setStep] = useState("register"); // "register" | "otp"
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isShaking, setIsShaking] = useState(false);

  const [form, setForm] = useState({
    email: "",
    passWord: "",
    fullName: "",
    phone: "",
    companyName: "",
    companyAddress: "",
    roleName: "EMPLOYER",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // reset khi load lại trang
  useEffect(() => {
    setForm({
      email: "",
      passWord: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
      companyName: "",
      companyAddress: "",
      roleName: "EMPLOYER",
    });
    setOtp(Array(6).fill(""));
  }, []);

  // validate form
  const validateForm = () => {
    let errs = {};
    if (!form.fullName.trim()) errs.fullName = "Họ và tên không được để trống";
    if (!form.email.trim()) errs.email = "Email không được để trống";
    if (!form.passWord) errs.passWord = "Mật khẩu không được để trống";
    if (form.passWord !== form.confirmPassword)
      errs.confirmPassword = "Mật khẩu nhập lại không khớp";
    if (!form.phone.trim()) errs.phone = "Số điện thoại không được để trống";
    if (!form.companyName.trim()) errs.companyName = "Tên công ty bắt buộc";
    if (!form.companyAddress.trim())
      errs.companyAddress = "Địa chỉ công ty bắt buộc";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // gửi OTP (bước 1)
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await requestOTP({
        fullName: form.fullName,
        email: form.email,
        passWord: form.passWord,
        roleName: form.roleName,
        phone: form.phone,
        companyName: form.companyName,
        companyAddress: form.companyAddress,
      });
      setStep("otp");
      setTimeLeft(60);
    } catch (err) {
      setErrors({ ...errors, email: err.message });
    } finally {
      setLoading(false);
    }
  };

  // xác thực OTP (bước 2)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (!otpCode || otpCode.length < 6) return;

    try {
      setLoading(true);
      const res =  await verifyOTP(form.email, otpCode);
      console.log("Xác thực OTP thành công:", res);
      // sau khi verify → chuyển về login
      navigate("/login");
    } catch (err) {
      console.error("Xác thực OTP thất bại:", err);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeOtp = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // countdown resend OTP
  useEffect(() => {
    if (step === "otp" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  const resendOtp = async () => {
    if (timeLeft === 0) {
      try {
        await requestOTP({
          fullName: form.fullName,
          email: form.email,
          passWord: form.passWord,
          roleName: form.roleName,
          phone: form.phone,
          companyName: form.companyName,
          companyAddress: form.companyAddress,
        });
        setTimeLeft(60);
      } catch (err) {
        console.error("Không gửi lại được OTP:", err);
      }
    }
  };

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

      {/* Bên phải */}
      <div className="w-2/3 flex flex-col bg-white shadow-2xl relative z-10 overflow-y-auto">
        <div className="w-full max-w-lg mx-auto py-12 px-10">
          {step === "register" ? (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-wide">
                Đăng ký Nhà tuyển dụng
              </h1>
              <form className="space-y-5" onSubmit={handleRegister}>
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
                  {errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="passWord"
                    value={form.passWord}
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
                  {errors.password && <p className="text-red-500">{errors.password}</p>}
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
                  {errors.confirmPassword && (
                    <p className="text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Info */}
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
                  {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
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
                  {errors.phone && <p className="text-red-500">{errors.phone}</p>}
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
                  {errors.companyName && <p className="text-red-500">{errors.companyName}</p>}
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
                  {errors.companyAddress && <p className="text-red-500">{errors.companyAddress}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-3xl mt-4 bg-gradient-to-r from-green-400 via-blue-500 to-indigo-500 text-white font-bold text-lg shadow-lg transition duration-300 transform hover:scale-[1.02]"
                >
                  {loading ? "Đang xử lý..." : "Đăng ký ngay"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-indigo-600 mb-6 text-center">
                Nhập mã OTP
              </h1>
              <p className="text-gray-600 text-center mb-6">
                Chúng tôi đã gửi mã OTP gồm{" "}
                <span className="font-semibold">6 chữ số</span> đến email của bạn.
              </p>

              <motion.form
                className="space-y-6"
                onSubmit={handleVerifyOtp}
                animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="flex justify-center gap-4">
                  {otp.map((val, i) => (
                    <motion.input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength="1"
                      value={val}
                      onChange={(e) => handleChangeOtp(e.target.value, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="w-14 h-14 text-center text-2xl font-extrabold 
                                 border border-white/40 rounded-xl shadow-lg
                                 bg-white/30 backdrop-blur-md text-gray-800
                                 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-400/50
                                 transition-all duration-300 transform hover:scale-110"
                      whileFocus={{ scale: 1.15 }}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:opacity-95 transform hover:scale-[1.02] transition duration-300"
                >
                  Xác nhận OTP
                </button>
              </motion.form>

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
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterRecruiter;
