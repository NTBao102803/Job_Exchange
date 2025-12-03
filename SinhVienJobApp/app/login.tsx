// src/screens/Login.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axiosClient from "../api/axiosClient"; // axiosClient đã sửa baseURL bằng IP LAN

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");

      const { data } = await axiosClient.post("/auth/login", {
        email,
        passWord: password, // backend bạn dùng passWord hay password?
      });

      const { accessToken, user } = data;

      // Chỉ cho USER vào
      if (user.role.roleName !== "USER") {
        setError("Nền tảng chỉ dành cho ứng viên.");
        return;
      }

      // Lưu token + role
      await SecureStore.setItemAsync("token", accessToken);
      await SecureStore.setItemAsync("role", user.role.roleName);
      await SecureStore.setItemAsync("userId", String(user.id));
      await SecureStore.setItemAsync("userName", String(user.fullName));
      router.replace("/candidate/home");
    } catch (err: any) {
      console.log("Login error:", err.response?.data || err.message);
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-gray-100"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground
          source={require("../assets/logohomebanner3.png")}
          className="flex-1 justify-center items-center p-6"
          imageStyle={{ opacity: 0.15 }}
        >
          <View className="flex-1 justify-center items-center w-full max-w-md">
            {/* Logo */}
            <Image
              source={require("../assets/Logo.png")}
              className="w-28 h-28 rounded-xl mb-6"
            />

            {/* Welcome text */}
            <Text className="text-3xl font-extrabold text-gray-800 mb-2 text-center">
              Chào mừng bạn đến với SinhVienJob
            </Text>
            <Text className="text-base leading-relaxed text-center text-gray-600 mb-8">
              Nơi kết nối <Text className="font-bold">Ứng viên</Text> và{" "}
              <Text className="font-bold">Nhà tuyển dụng</Text>. Hãy đăng nhập để bắt đầu hành trình sự nghiệp!
            </Text>

            {/* Form */}
            <View className="w-full bg-white p-6 rounded-3xl shadow-lg">
              {/* Email */}
              <Text className="text-gray-700 font-medium mb-2">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email..."
                className="w-full p-4 rounded-xl border border-gray-300 mb-4 bg-gray-50"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Password */}
              <Text className="text-gray-700 font-medium mb-2">Mật khẩu</Text>
              <View className="relative w-full mb-4">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nhập mật khẩu..."
                  secureTextEntry={!showPassword}
                  className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 pr-12"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? (
                    <EyeOff size={22} color="gray" />
                  ) : (
                    <Eye size={22} color="gray" />
                  )}
                </TouchableOpacity>
              </View>

              {error.length > 0 && (
                <Text className="text-red-500 mb-3 text-center">{error}</Text>
              )}

              {/* Login Button */}
              <LinearGradient
                colors={["#6366F1", "#8B5CF6", "#EC4899"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-xl mt-2"
              >
                <TouchableOpacity
                  onPress={handleLogin}
                  style={{ paddingVertical: 14 }}
                >
                  <Text className="text-white text-center font-bold text-lg">
                    Đăng nhập
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              {/* Forgot password */}
              <TouchableOpacity className="mt-3"
                                 onPress={() => router.replace("/forgotpassword")} >
                <Text className="text-indigo-600 text-sm text-center">
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="mt-6 w-full">
              <TouchableOpacity className="w-full py-4 rounded-xl bg-green-400">
                <Text className="text-white text-center font-semibold text-base">
                  Đăng ký Ứng viên
                </Text>
              </TouchableOpacity>
            </View>

            {/* Terms text */}
            <Text className="mt-8 text-center text-gray-400 text-sm leading-relaxed">
              Bằng việc đăng nhập, bạn đồng ý với{" "}
              <Text className="text-indigo-500 font-medium">Điều khoản dịch vụ</Text> và{" "}
              <Text className="text-indigo-500 font-medium">Chính sách bảo mật</Text>.
            </Text>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
