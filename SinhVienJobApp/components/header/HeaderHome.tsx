import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { useTab } from "../../context/TabContext";
interface HeaderHomeProps {
  onMenuPress: () => void;
  onMessagePress?: () => void;
}

const { width } = Dimensions.get("window");

export default function HeaderHome({ onMenuPress, onMessagePress }: HeaderHomeProps) {
  const { activeTab } = useTab();
  const isSmallScreen = width < 350;

  return (
    <LinearGradient
      colors={["#1e3a8a", "#5b21b6", "#ec4899"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        width: "100%",
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}
    >
      {/* Menu button */}
      <TouchableOpacity onPress={onMenuPress} style={{ padding: 6 }}>
        <Ionicons name="menu-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Logo + Title */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={require("../../assets/Logo.png")}
          style={{
            width: isSmallScreen ? 32 : 36,
            height: isSmallScreen ? 32 : 36,
            marginRight: 8,
          }}
        />
        <Text style={{ fontSize: isSmallScreen ? 16 : 18, fontWeight: "bold", color: "#fff" }}>
          SinhVienJob
        </Text>
      </View>

      {/* Message button */}
      <TouchableOpacity onPress={onMessagePress} style={{ padding: 6 }}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
}
