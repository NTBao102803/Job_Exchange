import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";
import { forgotPassword, resetPassword, verifyOtpPassword } from "../api/AuthApi";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ForgotPassword = () => {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ new: false, confirm: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const otpInputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => setError(""), [step]);

  useEffect(() => {
    if (step === "otp" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  const handleSendOTP = async () => {
    if (!email.trim()) return setError("Vui lòng nhập email.");
    setLoading(true);
    try {
      await forgotPassword(email);
      Alert.alert("✅ OTP đã gửi tới " + email);
      setStep("otp");
      setTimeLeft(60);
      setOtp(Array(6).fill(""));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gửi OTP thất bại.");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return setError("Mã OTP phải đủ 6 chữ số!");
    }
    setLoading(true);
    try {
      await verifyOtpPassword(email, otpCode);
      Alert.alert("✅ OTP hợp lệ!");
      setStep("reset");
    } catch (err: any) {
      setError(err?.response?.data?.message || "OTP không hợp lệ.");
    }
    setLoading(false);
  };

  const resendOtp = async () => {
    if (timeLeft > 0) return;
    try {
      await forgotPassword(email);
      Alert.alert("🔁 OTP mới đã gửi!");
      setOtp(Array(6).fill(""));
      setTimeLeft(60);
    } catch {
      setError("Không thể gửi lại OTP.");
    }
  };

  const handleResetPassword = async () => {
    if (form.newPassword.length < 8) return setError("Mật khẩu phải >= 8 ký tự.");
    if (form.newPassword !== form.confirmPassword) return setError("Mật khẩu nhập lại không khớp.");
    setLoading(true);
    try {
      await resetPassword({ email, otp: otp.join(""), newPassword: form.newPassword });
      Alert.alert("✅ Đổi mật khẩu thành công!");
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đổi mật khẩu thất bại.");
    }
    setLoading(false);
  };

  const handleChangeOtp = (value: string, i: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[i] = value;
    setOtp(newOtp);

    if (value && i < 5) {
      otpInputs.current[i + 1]?.focus(); // tự nhảy ô tiếp theo
    }
    if (!value && i > 0) {
      otpInputs.current[i - 1]?.focus(); // xoá quay lại ô trước
    }
  };

  return (
    <View style={styles.container}>
      {/* STEP EMAIL */}
      {step === "email" && (
        <View style={styles.form}>
          <Text style={styles.title}>Quên mật khẩu?</Text>
          <Text style={styles.subTitle}>Nhập email để nhận mã OTP khôi phục tài khoản.</Text>
          <TextInput
            style={styles.input}
            placeholder="📧 Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            selectionColor="#fff"
            color="#fff"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "⏳ Đang gửi..." : "Gửi mã OTP"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.link}>🔙 Quay lại đăng nhập</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP OTP */}
      {step === "otp" && (
        <View style={styles.form}>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setStep("email")}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={[styles.title, { marginLeft: 10, color: "#fff" }]}>Nhập mã OTP</Text>
          </View>

          <View style={[styles.otpContainer, isShaking ? { transform: [{ translateX: -10 }] } : {}]}>
            {otp.map((val, i) => (
              <TextInput
                key={i}
                ref={(ref) => (otpInputs.current[i] = ref)}
                style={styles.otpInput}
                maxLength={1}
                value={val}
                onChangeText={(text) => handleChangeOtp(text, i)}
                keyboardType="number-pad"
                placeholderTextColor="#9ca3af"
                selectionColor="#fff"
                color="#fff"
              />
            ))}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleVerifyOTP} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "⏳ Đang xác thực..." : "Xác nhận OTP"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resendOtp} disabled={timeLeft > 0}>
            <Text style={[styles.link, { opacity: timeLeft > 0 ? 0.5 : 1 }]}>
              {timeLeft > 0 ? `Gửi lại sau ${timeLeft}s` : "Gửi lại OTP"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP RESET PASSWORD */}
      {step === "reset" && (
        <View style={styles.form}>
          <Text style={styles.title}>Đặt lại mật khẩu</Text>
          <Text style={styles.subTitle}>Nhập mật khẩu mới để bảo vệ tài khoản.</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              placeholderTextColor="#9ca3af"
              value={form.newPassword}
              onChangeText={(text) => setForm({ ...form, newPassword: text })}
              secureTextEntry={!show.new}
              selectionColor="#fff"
              color="#fff"
            />
            <TouchableOpacity onPress={() => setShow({ ...show, new: !show.new })}>
              {show.new ? <EyeOff size={20} color="#fff" /> : <Eye size={20} color="#fff" />}
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#9ca3af"
              value={form.confirmPassword}
              onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
              secureTextEntry={!show.confirm}
              selectionColor="#fff"
              color="#fff"
            />
            <TouchableOpacity onPress={() => setShow({ ...show, confirm: !show.confirm })}>
              {show.confirm ? <EyeOff size={20} color="#fff" /> : <Eye size={20} color="#fff" />}
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "⏳ Đang xử lý..." : "Xác nhận đổi mật khẩu"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.link}>🔙 Quay lại đăng nhập</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#1f1f1f",
  },
  form: {
    backgroundColor: "#2a2a2a",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  subTitle: { fontSize: 14, color: "#9ca3af", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#1f1f1f",
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#1f1f1f",
  },
  button: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  error: { color: "red", marginBottom: 5, textAlign: "center" },
  link: { color: "#4f46e5", textAlign: "center", marginTop: 8 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: "#1f1f1f",
    color: "#fff",
  },
});
