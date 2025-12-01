import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import { Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getEmployerById } from "../../api/JobApi";
import { getSmartJobRecommendations } from "../../api/RecommendationApi";
import HeaderSmartJobs from "../../components/header/HeaderSmartJobs";
import JobDetail from "../../components/jobdetail";
import { useMenu } from "../../context/MenuContext";

export default function SmartJobs() {
  const { openMenu } = useMenu();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // ✅ Lấy userId từ SecureStore (hoặc AsyncStorage nếu cần)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const userId = await SecureStore.getItemAsync("userId");

        if (!userId) {
          console.warn("⚠️ Không tìm thấy userId");
          return;
        }

        setLoading(true);

        const res = await getSmartJobRecommendations(userId, 10);

        const formatMatchScore = (rawScore: number) => {
          if (!rawScore || rawScore < 1.0) return "N/A";
          const percentage = (rawScore - 1.0) * 100;
          return `${Math.min(percentage, 100).toFixed(1)}%`;
        };

        const mappedJobs = await Promise.all(
          res.map(async (item: any) => {
            const job = item.job || {};
            const requirements = job.requirements || {};
            let companyName = "Không rõ công ty";

            if (job.employerId) {
              try {
                const employer = await getEmployerById(job.employerId);
                companyName = employer?.companyName || `Công ty ID ${job.employerId}`;
              } catch (error) {
                console.warn(`⚠️ Lỗi lấy employer ${job.employerId}:`, error);
              }
            }

            return {
              id: job.id,
              title: job.title || "Chưa có tiêu đề",
              companyName,
              location: job.location || "Không rõ",
              salary: job.salary || "Thỏa thuận",
              type: job.jobType || "Fulltime",
              match: formatMatchScore(item.score),
              skills: Array.isArray(requirements.skills) ? requirements.skills.join(", ") : "Không có kỹ năng yêu cầu",
              jobDetail: { ...job, companyName },
            };
          })
        );

        setJobs(mappedJobs);
      } catch (err) {
        console.error("❌ Lỗi load job recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderSmartJobs onMenuPress={openMenu} />

      <LinearGradient
        colors={["#7c3aed", "#ec4899", "#ef4444"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}
      >
        {selectedJob ? (
          <ScrollView
            style={{ flex: 1, borderRadius: 16 }}
            contentContainerStyle={{ paddingBottom: 7 }}
            showsVerticalScrollIndicator={false}
          >
            <JobDetail
              job={selectedJob}
              employer={{
                fullName: "Nguyễn Văn B",
                email: "employer@example.com",
                phone: "0901234567",
              }}
              onClose={() => setSelectedJob(null)}
            />
          </ScrollView>
        ) : (
          <>
            {/* Search */}
            <View style={{ position: "relative", marginBottom: 20 }}>
              <TextInput
                style={{
                  width: "100%",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: 12,
                  borderRadius: 30,
                  color: "white",
                  paddingLeft: 45,
                  borderColor: "rgba(255,255,255,0.3)",
                  borderWidth: 1,
                }}
                placeholder="🔍 Tìm kiếm việc làm..."
                placeholderTextColor="#f1f1f1"
                value={search}
                onChangeText={setSearch}
              />
              <Search size={22} color="#ffeb3b" style={{ position: "absolute", left: 12, top: 10 }} />
            </View>

            {/* Job List */}
            {loading ? (
              <ActivityIndicator size="large" color="#ffeb3b" style={{ marginTop: 50 }} />
            ) : filteredJobs.length === 0 ? (
              <Text style={{ color: "white", opacity: 0.9, marginTop: 30, textAlign: "center" }}>
                Không tìm thấy công việc phù hợp.
              </Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {filteredJobs.map((job) => (
                  <View
                    key={job.id}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderColor: "rgba(255,255,255,0.3)",
                      borderWidth: 1,
                      borderRadius: 16,
                      padding: 16,
                      marginBottom: 18,
                    }}
                  >
                    <Text style={{ fontSize: 20, color: "#ffeb3b", fontWeight: "700" }}>
                      {job.title}
                    </Text>

                    <Text style={{ color: "white", opacity: 0.9, marginTop: 4, fontSize: 14 }}>
                      {job.companyName}
                    </Text>

                    <Text style={{ color: "white", marginTop: 4 }}>
                      📍 {job.location} | ⏰ {job.type}
                    </Text>

                    <Text style={{ color: "#00ff88", marginTop: 4, fontWeight: "600" }}>
                      💰 {job.salary}
                    </Text>

                    <Text style={{ color: "white", marginTop: 6 }}>
                      <Text style={{ fontWeight: "600" }}>Kỹ năng:</Text> {job.skills}
                    </Text>

                    <Text style={{ color: "white", marginTop: 4 }}>
                      <Text style={{ fontWeight: "700" }}>Phù hợp:</Text>{" "}
                      <Text style={{ color: "#00ff88", fontWeight: "700" }}>{job.match}</Text>
                    </Text>

                    <TouchableOpacity
                      style={{
                        backgroundColor: "#ffeb3b",
                        paddingVertical: 10,
                        borderRadius: 10,
                        marginTop: 12,
                      }}
                      onPress={() => setSelectedJob(job)}
                    >
                      <Text style={{ textAlign: "center", fontWeight: "700", color: "#222" }}>
                        Xem chi tiết
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </>
        )}
      </LinearGradient>
    </View>
  );
}
