// ChangePasswordMobileExpo.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface FormState {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ChangePassword({ navigation }: any) {
  const [form, setForm] = useState<FormState>({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.replace("/candidate/home");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#121212" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <ArrowLeft size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Đổi mật khẩu</Text>
        </View>

        {/* BANNER */}
        <View style={styles.banner}>
          <Image source={require("../assets/Logo.png")} style={styles.logo} />
          <Text style={styles.bannerTitle}>Đổi mật khẩu</Text>
          <Text style={styles.bannerDesc}>
            Cập nhật mật khẩu mới để bảo mật tài khoản của bạn.
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          {/* Mật khẩu cũ */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Mật khẩu cũ</Text>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Nhập mật khẩu cũ"
                placeholderTextColor="#888"
                secureTextEntry={!showOld}
                value={form.oldPassword}
                onChangeText={(t) => setForm({ ...form, oldPassword: t })}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowOld(!showOld)}>
                {showOld ? <EyeOff size={20} color="#555" /> : <Eye size={20} color="#555" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Mật khẩu mới */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Mật khẩu mới</Text>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor="#888"
                secureTextEntry={!showNew}
                value={form.newPassword}
                onChangeText={(t) => setForm({ ...form, newPassword: t })}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                {showNew ? <EyeOff size={20} color="#555" /> : <Eye size={20} color="#555" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Nhập lại mật khẩu mới */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Nhập lại mật khẩu mới</Text>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor="#888"
                secureTextEntry={!showConfirm}
                value={form.confirmNewPassword}
                onChangeText={(t) => setForm({ ...form, confirmNewPassword: t })}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={20} color="#555" /> : <Eye size={20} color="#555" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* BUTTON GRADIENT */}
          <TouchableOpacity style={{ width: "100%", borderRadius: 12, overflow: "hidden", marginTop: 20 }}>
            <LinearGradient
              colors={["#FF416C", "#FF4B2B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ paddingVertical: 14, alignItems: "center", borderRadius: 12 }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Đổi mật khẩu</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: "#121212", 
    paddingVertical: 0,
    alignItems: "center", // căn giữa banner + form
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#1e1e1e",
    width: "100%",
  },
  backBtn: { marginRight: 12 },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  banner: { 
    alignItems: "center", 
    marginVertical: 24, 
    paddingHorizontal: 20,
  },
  logo: { width: 120, height: 120, borderRadius: 24, marginBottom: 12 },
  bannerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 6, textAlign: "center" },
  bannerDesc: { color: "#ccc", textAlign: "center", fontSize: 16, lineHeight: 22 },
  form: { width: "90%" },
  inputWrapper: { marginBottom: 16 },
  label: { color: "#fff", marginBottom: 6, fontWeight: "600" },
  inputBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#2a2a2a", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  input: { flex: 1, color: "#fff", fontSize: 16 },
});
