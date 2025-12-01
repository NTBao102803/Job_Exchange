import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getApplicationsByCandidate } from "../api/ApplicationApi";
import { getCandidateProfile } from "../api/CandidateApi";
import { getEmployerById, getJobById } from "../api/JobApi";
import JobDetail from "../components/jobdetail";

export default function AppliedJobsMobileExpo() {
  const [filterStatus, setFilterStatus] = useState<"all" | string>("all");
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null); // job đang xem chi tiết
  const router = useRouter();

  const statusMap: Record<string, { text: string; color: string }> = {
    PENDING: { text: "Đã ứng tuyển", color: "#22c55e" },
    REJECTED: { text: "Hồ sơ chưa phù hợp", color: "#ef4444" },
    APPROVED: { text: "Hồ sơ đã phù hợp", color: "#3b82f6" },
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const userId = await SecureStore.getItemAsync("userId");
        if (!userId) return;

        const candidate = await getCandidateProfile();
        const applications = await getApplicationsByCandidate(userId);
        console.log("Fetched applications:", applications);
        const jobsWithDetails = await Promise.all(
          applications.map(async (app) => {
            const jobData = await getJobById(app.jobId);
            const employer = await getEmployerById(jobData.employerId);
            return {
              ...jobData,
              companyName: employer.companyName,
              employerEmail: employer.email || "",
              employerPhone: employer.phone || "",
              status: app.status,
              cvUrl: app.cvUrl,
              applicationId: app.id,
            };
          })
        );

        setJobs(jobsWithDetails);
      } catch (err) {
        console.error("❌ Lỗi khi load applied jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs =
    filterStatus === "all" ? jobs : jobs.filter((job) => job.status === filterStatus);

  // -----------------------------
  // Hiển thị chi tiết Job
  // -----------------------------
  if (selectedJob) {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", padding: 16 ,paddingTop:30}}
          onPress={() => setSelectedJob(null)}
        >
        </TouchableOpacity>

        <JobDetail
          job={selectedJob}
          employer={{
            fullName: selectedJob.companyName || "Công ty chưa có",
            email: selectedJob.employerEmail || "",
            phone: selectedJob.employerPhone || "",
          }}
          onClose={() => setSelectedJob(null)}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/candidate/home")}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={22} color="#111" />
        <Text style={{ fontSize: 16 }}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📌 Việc làm bạn đã ứng tuyển</Text>

      <View style={styles.filterContainer}>
        {["all", "PENDING", "REJECTED", "APPROVED"].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilterStatus(status)}
            style={[
              styles.filterBtn,
              filterStatus === status ? { backgroundColor: "#6366f1" } : null,
            ]}
          >
            <Text style={{ color: filterStatus === status ? "#fff" : "#374151" }}>
              {status === "all"
                ? "Tất cả"
                : statusMap[status]?.text || status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            
            <View
              key={`${job.applicationId}-${job.id}-${index}`}
              style={styles.card}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.companyName}>{job.companyName}</Text>
                <Text style={styles.locationType}>
                  📍 {job.location || "Đang cập nhật"} | ⏰ {job.jobType || "Đang cập nhật"}
                </Text>
                <Text style={styles.salary}>💰 {job.salary || "Liên hệ"}</Text>
              </View>

              <View style={styles.rightActions}>
                <Text style={[styles.status, { backgroundColor: statusMap[job.status]?.color || "#999" }]}>
                  {statusMap[job.status]?.text || job.status}
                </Text>

                <TouchableOpacity
                  style={styles.detailBtn}
                  onPress={() => setSelectedJob(job)}
                >
                  <Text style={styles.detailText}>Xem chi tiết</Text>
                </TouchableOpacity>

                
                  <TouchableOpacity
                    style={styles.cvBtn}
                    onPress={() => Linking.openURL(job.cvUrl)}
                  >
                    <Text style={styles.cvText}>Xem CV</Text>
                  </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noJobs}>Không có công việc nào.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50, backgroundColor: "#f3f4f6" },
  backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 6 },
  title: { fontSize: 22, fontWeight: "bold", color: "#4f46e5", textAlign: "center", marginBottom: 12 },
  filterContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16, justifyContent: "center" },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: "#e5e7eb" },
  scrollArea: { flex: 1, marginTop: 4 },
  card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 14, elevation: 3 },
  jobTitle: { fontSize: 18, fontWeight: "bold", color: "#4f46e5" },
  companyName: { fontSize: 14, fontWeight: "600", color: "#374151" },
  locationType: { fontSize: 13, color: "#6b7280" },
  salary: { fontSize: 14, color: "#16a34a", fontWeight: "600", marginTop: 2 },
  rightActions: { alignItems: "flex-end", justifyContent: "center", gap: 8 },
  status: { color: "#fff", fontWeight: "600", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
  detailBtn: { backgroundColor: "#6366f1", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  cvBtn: { backgroundColor: "#e5e7eb", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  detailText: { color: "#fff", fontWeight: "600" },
  cvText: { color: "#374151", fontWeight: "600" },
  noJobs: { textAlign: "center", marginTop: 20, color: "#6b7280", fontStyle: "italic" },
});
