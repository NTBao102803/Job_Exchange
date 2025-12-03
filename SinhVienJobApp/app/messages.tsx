import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const ForgotPasswordMobile = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => setError(""), [step]);

  useEffect(() => {
    if (step === "otp" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  const handleSendOTP = () => {
    if (!email.trim()) return setError("Vui lòng nhập email!");
    Alert.alert("OTP đã gửi", `Mã OTP đã gửi tới ${email}`);
    setStep("otp");
    setTimeLeft(60);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) return setError("Mã OTP phải đủ 6 chữ số!");
    Alert.alert("Thành công", "OTP hợp lệ!");
    setStep("reset");
  };

  const handleResetPassword = () => {
    if (form.newPassword.length < 8) return setError("Mật khẩu phải có ít nhất 8 ký tự.");
    if (form.newPassword !== form.confirmPassword) return setError("Mật khẩu không khớp.");

    Alert.alert("Thành công", "Đổi mật khẩu thành công!");
    setStep("email");
    setEmail("");
    setOtp("");
    setForm({ newPassword: "", confirmPassword: "" });
  };

  const resendOtp = () => {
    if (timeLeft === 0) {
      Alert.alert("OTP mới", `OTP mới đã gửi tới ${email}`);
      setOtp("");
      setTimeLeft(60);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>
        {step === "email"
          ? "Quên mật khẩu"
          : step === "otp"
          ? "Nhập mã OTP"
          : "Đặt lại mật khẩu"}
      </Text>

      {/* BACK BUTTON */}
      {step !== "email" && (
        <TouchableOpacity onPress={() => setStep(step === "otp" ? "email" : "otp")}>
          <Text style={styles.backBtn}>← Quay lại</Text>
        </TouchableOpacity>
      )}

      {/* STEP 1 – EMAIL */}
      {step === "email" && (
        <View style={styles.box}>
          <TextInput
            placeholder="Nhập email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          {error !== "" && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.btn} onPress={handleSendOTP}>
            <Text style={styles.btnText}>Gửi mã OTP</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 2 – OTP ENTER FAST */}
      {step === "otp" && (
        <View style={styles.box}>
          <TextInput
            ref={inputRef}
            style={styles.otpInput}
            value={otp}
            onChangeText={(text) => {
              if (/^\d{0,6}$/.test(text)) setOtp(text);
            }}
            autoFocus
            maxLength={6}
            keyboardType="numeric"
          />
          {error !== "" && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.btn} onPress={handleVerifyOTP}>
            <Text style={styles.btnText}>Xác nhận OTP</Text>
          </TouchableOpacity>

          {timeLeft > 0 ? (
            <Text style={styles.timer}>Gửi lại OTP sau {timeLeft}s</Text>
          ) : (
            <TouchableOpacity onPress={resendOtp}>
              <Text style={styles.resend}>Gửi lại OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* STEP 3 – RESET PASSWORD */}
      {step === "reset" && (
        <View style={styles.box}>
          <View style={styles.passwordRow}>
            <TextInput
              placeholder="Mật khẩu mới"
              secureTextEntry={!show}
              value={form.newPassword}
              onChangeText={(t) => setForm({ ...form, newPassword: t })}
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity onPress={() => setShow(!show)}>
              <Ionicons name={show ? "eye-off" : "eye"} size={22} />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Nhập lại mật khẩu"
            secureTextEntry={!show}
            value={form.confirmPassword}
            onChangeText={(t) => setForm({ ...form, confirmPassword: t })}
            style={styles.input}
          />

          {error !== "" && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.btn} onPress={handleResetPassword}>
            <Text style={styles.btnText}>Xác nhận đổi mật khẩu</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },
  backBtn: {
    color: "#4f46e5",
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  box: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    elevation: 3,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  otpInput: {
    fontSize: 28,
    letterSpacing: 20,
    textAlign: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#4f46e5",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },
  timer: {
    marginTop: 12,
    textAlign: "center",
    color: "#555",
  },
  resend: {
    color: "#4f46e5",
    textAlign: "center",
    marginTop: 12,
    fontWeight: "600",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
});

export default ForgotPasswordMobile;