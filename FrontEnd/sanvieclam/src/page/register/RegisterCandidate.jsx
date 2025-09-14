import React, { useState, useEffect } from "react";
import { Await, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import {requestOTP, verifyOTP } from "../../api/AuthApi";

const RegisterCandidate = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [step, setStep] = useState("register"); // "register" | "otp"
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isShaking, setIsShaking] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    passWord: "",
    confirmPassword: "",
    roleName: "USER"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

   // ✅ Reset form khi load lại trang
  useEffect(() => {
    setForm({
      fullName: "",
      email: "",
      passWord: "",
      confirmPassword: "",
      roleName: "USER",
    });
    setOtp(Array(6).fill(""));
  }, []);

  // validate
  const validateForm = () => {
    let errs = {};

    // fullName
    if (!form.fullName.trim()) {
      errs.fullName = "Họ và tên không được để trống";
    } else if (form.fullName.length < 3 || form.fullName.length > 50) {
      errs.fullName = "Họ và tên phải có độ dài từ 3 đến 50 ký tự";
    }

    // email
    if (!form.email.trim()) {
      errs.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Email không hợp lệ";
    } else if (form.email.length > 100) {
      errs.email = "Email không được dài quá 100 ký tự";
    }

    // password
    if (!form.passWord) {
      errs.passWord = "Password không được để trống";
    } else if (form.passWord.length < 8 || form.passWord.length > 100) {
      errs.passWord = "Password phải có độ dài từ 8 đến 100 ký tự";
    } else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(form.passWord)) {
      errs.passWord = "Password phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt";
    }

    // confirmPassword
    if (form.passWord !== form.confirmPassword) {
      errs.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

   // Gửi OTP (đăng ký bước 1)
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await requestOTP({
        fullName: form.fullName,
        email: form.email,
        passWord: form.passWord,        
        roleName: form.roleName
      });
      // Chuyển qua bước OTP
      setStep("otp");
      setTimeLeft(60);
    } catch (err) {
      // err.message đã được ném từ AuthApi.jsx
      setErrors({ ...errors, email: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Xác thực OTP (bước 2)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (!otpCode || otpCode.length < 6) return;

    try {
      setLoading(true);
      const res = await verifyOTP(form.email, otpCode);
      console.log("Xác thực OTP thành công:", res);
      // → chuyển sang trang đăng nhập
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

  // Đếm ngược resend OTP
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
          roleName: form.roleName
        });
        setTimeLeft(60);
      } catch (err) {
        console.error("Không gửi lại được OTP:", err);
      }
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
          style={{ backgroundImage: "url('/registercandidate.png')" }}
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

      {/* Bên phải */}
      <div className="w-2/3 flex flex-col bg-white shadow-2xl relative z-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg p-10">
            {step === "register" ? (
              <>
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center tracking-wide">
                  Đăng ký Ứng viên
                </h1>
                <form className="space-y-6" 
                      onSubmit={handleRegister}
                      autoComplete="off" // ✅ tắt autofill
                >
                  
                  {/* Fullname */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      autoComplete="off" // ✅ clear khi reload
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      placeholder="Nhập họ và tên"
                      
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      autoComplete="new-email" // ✅ ngăn Chrome nhớ email
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      placeholder="Nhập email"
                    />
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                  </div>
{/* Mật khẩu */}
                  <div className="relative">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Mật khẩu
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.passWord}
                      autoComplete="new-password" // ✅ clear khi reload
                      onChange={(e) =>
                        setForm({ ...form, passWord: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-12"
                      placeholder="Tạo mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[42px] text-gray-500 hover:text-indigo-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {errors.passWord && (
                      <p className="text-red-500 text-sm">{errors.passWord}</p>
                    )}
                  </div>

                  {/* Nhập lại mật khẩu */}
                  <div className="relative">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nhập lại mật khẩu
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      autoComplete="new-password"
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-12"
                      placeholder="Nhập lại mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-[42px] text-gray-500 hover:text-indigo-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 via-blue-500 to-indigo-500 text-white font-bold text-lg shadow-lg hover:opacity-95 transform hover:scale-[1.02] transition duration-300"
                  >
                    Đăng ký ngay
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
                  {/* OTP Inputs */}
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

                  {/* Button */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:opacity-95 transform hover:scale-[1.02] transition duration-300"
                  >
                    Xác nhận OTP
                  </button>
                </motion.form>

                {/* Resend */}
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
      </div>
    </motion.div>
  );
};

export default RegisterCandidate;