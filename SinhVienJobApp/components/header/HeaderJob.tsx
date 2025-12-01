import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Text, TouchableOpacity } from "react-native";

interface HeaderHomeProps {
  onMenuPress: () => void;
  onMessagePress?: () => void;
}

const { width } = Dimensions.get("window");

export default function HeaderJob({ onMenuPress, onMessagePress }: HeaderHomeProps) {
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

    
        <Text style={{ fontSize: isSmallScreen ? 16 : 18, fontWeight: "bold", color: "#fff" }}>
          Việc làm
        </Text>

      <Text></Text>
    </LinearGradient>
  );
}
