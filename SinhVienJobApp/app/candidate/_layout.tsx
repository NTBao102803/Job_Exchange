// app/candidate/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Dimensions } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import SideMenu from "../../components/SideMenu";
import { MenuContext } from "../../context/MenuContext";

import HeaderHome from "../../components/header/HeaderHome";
import HeaderJob from "../../components/header/HeaderJob";
import HeaderNotifications from "../../components/header/HeaderNotifications";
import HeaderSmartJobs from "../../components/header/HeaderSmartJobs";

const { width } = Dimensions.get("window");

export default function TabLayout() {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const tabs: { name: string; icon: keyof typeof Ionicons.glyphMap; header: React.ReactNode }[] = [
    { name: "home", icon: "home", header: <HeaderHome onMenuPress={openMenu} /> },
    { name: "jobs", icon: "briefcase", header: <HeaderJob onMenuPress={openMenu} /> },
    { name: "smartJobs", icon: "rocket", header: <HeaderSmartJobs onMenuPress={openMenu} /> },
    { name: "notifications", icon: "notifications", header: <HeaderNotifications onMenuPress={openMenu} /> },
    { name: "profile", icon: "person", header: null },
  ];

  return (
    <MenuContext.Provider value={{ openMenu, closeMenu }}>
      {/* SideMenu */}
      <SideMenu visible={menuVisible} onClose={closeMenu} />

      {/* Tabs */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          lazy: true,
          tabBarStyle: {
            height: 70,
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
          },
        }}
      >
        {tabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              header: () => tab.header,
              tabBarIcon: ({ focused }) => <TabIcon icon={tab.icon} focused={focused} />,
              tabBarBackground: () => (
                <LinearGradient
                  colors={["#1e3a8a", "#5b21b6", "#ec4899"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </MenuContext.Provider>
  );
}

interface TabIconProps {
  icon: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}

function TabIcon({ icon, focused }: TabIconProps) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, { damping: 8, stiffness: 150 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, { alignItems: "center", marginTop: 6 }]}>
      <Ionicons name={icon} size={23} color={focused ? "#ec4899" : "#fff"} />
    </Animated.View>
  );
}
