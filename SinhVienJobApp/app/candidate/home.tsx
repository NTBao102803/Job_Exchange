import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { getApplicationsByCandidate } from "../../api/ApplicationApi";
import { getAllPublicJobs } from "../../api/JobApi";
import HeaderHome from "../../components/header/HeaderHome";
import { useMenu } from "../../context/MenuContext";

const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter(); 
  const { openMenu } = useMenu();

  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalApplications: 0,
    approved: 0,
    pending: 0,
    matched: 0,
    notMatched: 0,
    totalJobs: 0,
  });

  // ✅ Load userId và role từ SecureStore
  useEffect(() => {
    const fetchUserData = async () => {
      const id = await SecureStore.getItemAsync("userId");
      const role = await SecureStore.getItemAsync("role");
      setUserId(id);
      setUserRole(role);
    };
    fetchUserData();
  }, []);

  // ✅ Load stats nếu là USER và đã có userId
  useEffect(() => {
    if (userRole === "USER" && userId) {
      fetchCandidateStats();
    }
  }, [userId, userRole]);

  const fetchCandidateStats = async () => {
    try {
      const [appsRes, jobsRes] = await Promise.all([
        getApplicationsByCandidate(userId),
        getAllPublicJobs(),
      ]);

      const applications = appsRes || [];
      const jobs = jobsRes || [];

      const approved = applications.filter(a => a.status !== "PENDING").length;
      const matched = applications.filter(a => a.status === "APPROVED").length;
      const notMatched = applications.filter(a => a.status === "REJECTED").length;
      const pending = applications.filter(a => a.status === "PENDING").length;

      setStats({
        totalApplications: applications.length,
        approved,
        pending,
        matched,
        notMatched,
        totalJobs: jobs.length,
      });
    } catch (err) {
      console.error("Lỗi tải thống kê:", err);
    }
  };

  const statItems = [
    { label: "Đã nộp CV", value: stats.totalApplications, color: "#2563eb" },
    { label: "Được duyệt", value: stats.approved, color: "#16a34a" },
    { label: "Đang chờ", value: stats.pending, color: "#eab308" },
    { label: "Phù hợp", value: stats.matched, color: "#f59e0b" },
    { label: "Không phù hợp", value: stats.notMatched, color: "#dc2626" },
    { label: "Tổng công việc", value: stats.totalJobs, color: "#7c3aed" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#fdf2f8" }}>
      <HeaderHome 
        onMenuPress={openMenu}
        onMessagePress={() => router.replace("/messages")}  
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* 🌈 Banner */}
        <Animated.View
          entering={FadeInDown.duration(700)}
          style={styles.bannerContainer}
        >
          <Text style={styles.title}>
            Kết nối sinh viên với{" "}
            <Text style={styles.titleHighlight}>cơ hội nghề nghiệp</Text>
          </Text>

          <Text style={styles.description}>
            Tìm việc thực tập, bán thời gian, full-time và phát triển sự nghiệp dễ dàng.
          </Text>

          <Image
            source={require("../../assets/logohomebanner1.png")}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </Animated.View>

        {/* 📊 Stats */}
        {userRole === "USER" && (
          <View style={styles.statsContainer}>
            {statItems.map((item, index) => (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(index * 120).duration(600)}
                style={[styles.statCard, { borderLeftColor: item.color }]}
              >
                <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </Animated.View>
            ))}
          </View>
        )}

        {/* 🖼 Bộ hình demo */}
        <View style={styles.imagesWrapper}>
          {[1, 2, 3].map((i) => (
            <Animated.Image
              key={i}
              entering={FadeInUp.delay(i * 150).duration(700)}
              source={{ uri: `https://via.placeholder.com/300x400?text=Image${i}` }}
              style={[
                styles.layeredImage,
                { top: i === 2 ? 20 : 0, zIndex: 4 - i, transform: [{ rotate: `${(i - 2) * 6}deg` }] },
              ]}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    lineHeight: 36,
  },
  titleHighlight: {
    color: "#f97316",
  },
  description: {
    marginTop: 10,
    fontSize: 15,
    color: "#475569",
  },
  bannerImage: {
    width: "100%",
    height: 200,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  statsContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#ffffffdd",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    borderLeftWidth: 5,
    elevation: 3,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "bold",
  },
  statLabel: {
    marginTop: 6,
    fontSize: 14,
    color: "#334155",
  },
  imagesWrapper: {
    marginTop: 40,
    alignItems: "center",
    paddingBottom: 40,
  },
  layeredImage: {
    width: width * 0.65,
    height: width * 0.9,
    position: "absolute",
    borderRadius: 20,
  },
});
