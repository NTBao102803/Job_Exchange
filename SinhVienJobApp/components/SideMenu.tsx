// components/SideMenu.tsx
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { getAvatarUrl, getCandidateProfile } from "../api/CandidateApi";

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get("window");
const MENU_WIDTH = width * 0.85;

export default function SideMenu({
  visible,
  onClose,
}: SideMenuProps) {
  const router = useRouter();
  const translateX = useSharedValue(-MENU_WIDTH);

  const [userData, setUserData] = React.useState<{ name: string; avatar: string | null }>({
  name: "Nguyen Van A",
  avatar: null,
}); 
const fetchUser = async () => {
  try {
    const data = await getCandidateProfile(); // từ CandidateApi
    const userId = await SecureStore.getItemAsync("userId");
    let avatarUrl: string | null = null;

    if (userId) {
      avatarUrl = await getAvatarUrl(userId); // lấy URL avatar từ backend
    }

    setUserData({
      name: data.fullName || "Nguyen Van A",
      avatar: avatarUrl,
    });
  } catch (error) {
    console.error("❌ Lỗi fetch user:", error);
  }
};
useEffect(() => {
  fetchUser();
}, []);
  useEffect(() => {
    translateX.value = visible
      ? withTiming(0, { duration: 300 })
      : withTiming(-MENU_WIDTH, { duration: 300 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (!visible) return null;

  const menuItems = [
    { label: "Việc làm đã ứng tuyển", icon: <MaterialIcons name="work-outline" size={22} color="#fff" />, path: "/appliedjobs" },
    { label: "Thông báo", icon: <Ionicons name="notifications-outline" size={22} color="#fff" />, path: "/candidate/notifications" },
    { label: "Nhắn tin", icon: <Ionicons name="chatbubble-outline" size={22} color="#fff" />, path: "/messages" },
    { label: "Thay đổi mật khẩu", icon: <Ionicons name="key-outline" size={22} color="#fff" />, path: "/changepassword" },
  ];

  const handleNavigate = async  (path: string) => {
    if (path === "logout") {
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("role");
            await SecureStore.deleteItemAsync("userId");
            router.replace("/login");
      return;
    }
   
    switch (path) {
      case "/appliedjobs":
        router.replace("/appliedjobs");
        break;
      case "/candidate/notifications":
        router.replace("/candidate/notifications");
        break;
      case "/messages":
        router.replace("/messages");
        break;
      case "/changepassword":
        router.replace("/changepassword");
        break;
      case "/candidate/profile":
        router.replace("/candidate/profile");
        break;
      default:
        break;
    }
    onClose();
  };

  return (
    <View style={{ position: "absolute", top: 0, left: 0, width, height, zIndex: 999 }}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ position: "absolute", width, height, backgroundColor: "rgba(0,0,0,0.6)" }} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: MENU_WIDTH,
            backgroundColor: "#1c1c1e",
            paddingTop: 120,
            paddingHorizontal: 20,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            shadowColor: "#000",
            shadowOffset: { width: 5, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 15,
          },
          animatedStyle,
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <TouchableOpacity
            style={{ alignItems: "center", marginBottom: 30 }}
            onPress={() => handleNavigate("/candidate/profile")}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                overflow: "hidden",
                borderWidth: 3,
                borderColor: "#4f46e5",
                marginBottom: 12,
              }}
            >
              {userData.avatar ? (
                <Image source={{ uri: userData.avatar }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <View style={{ flex: 1, backgroundColor: "#333", justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ color: "#888" }}>No Image</Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>{userData.name}</Text>
            <Text style={{ fontSize: 14, color: "#aaa", marginTop: 2 }}>Hồ sơ ứng viên</Text>
          </TouchableOpacity>

          {/* Menu items */}
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                borderRadius: 12,
                marginBottom: 6,
                backgroundColor: "#2c2c2e",
                paddingHorizontal: 14,
              }}
              onPress={() => handleNavigate(item.path)}
            >
              <View style={{ width: 30 }}>{item.icon}</View>
              <Text style={{ fontSize: 16, marginLeft: 12, color: "#fff" }}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          {/* Đăng xuất */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 14,
              borderRadius: 12,
              marginTop: 20,
              backgroundColor: "#2c2c2e",
              paddingHorizontal: 14,
            }}
            onPress={() => handleNavigate("logout")}
          >
            <Ionicons name="log-out-outline" size={22} color="#ff3b30" />
            <Text style={{ fontSize: 16, marginLeft: 12, color: "#ff3b30", fontWeight: "bold" }}>Đăng xuất</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
