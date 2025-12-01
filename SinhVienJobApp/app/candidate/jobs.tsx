import { Briefcase, Flame, Search, TrendingUp } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getAllPublicJobs, getEmployerById } from "../../api/JobApi";
import HeaderJob from "../../components/header/HeaderJob";
import JobDetail from "../../components/jobdetail";
import { useMenu } from "../../context/MenuContext";

export default function Jobs() {
  const { openMenu } = useMenu();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { label: "Công nghệ thông tin", icon: <Flame size={16} color="red" /> },
    { label: "Kinh doanh", icon: <Briefcase size={16} color="blue" /> },
    { label: "Marketing", icon: <TrendingUp size={16} color="green" /> },
  ];

  // -------------------------
  // Fetch job + employer info
  // -------------------------
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const jobList = await getAllPublicJobs();
        const jobsWithEmployer = await Promise.all(
          jobList.map(async (job) => {
            try {
              const employer = await getEmployerById(job.employerId);
              return {
                ...job,
                companyName: employer.companyName,
                employerEmail: employer.email,
                employerPhone: employer.phone,
              };
            } catch (err) {
              console.error("❌ Lỗi lấy employer:", err);
              return job;
            }
          })
        );
        setJobs(jobsWithEmployer);
      } catch (err) {
        console.error("❌ Lỗi lấy job:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      (job.companyName || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? job.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text>Đang tải công việc...</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F7F9" }}>
      <HeaderJob onMenuPress={openMenu} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {selectedJob ? (
          <JobDetail
            job={selectedJob}
            employer={{
              fullName: selectedJob.companyName || "Công ty chưa có",
              email: selectedJob.employerEmail || "",
              phone: selectedJob.employerPhone || "",
            }}
            onClose={() => setSelectedJob(null)}
          />
        ) : (
          <>
            <Text style={styles.title}>Danh sách công việc</Text>

            <View style={styles.searchWrapper}>
              <Search size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                placeholder="Tìm kiếm công việc..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
            </View>

            {/* Ngành nghề HOT */}
            <View>
              <Text style={styles.filterTitle}>Ngành nghề HOT</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((cat, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.categoryChip, selectedCategory === cat.label && styles.categoryChipActive]}
                    onPress={() => setSelectedCategory(selectedCategory === cat.label ? "" : cat.label)}
                  >
                    {cat.icon}
                    <Text style={[styles.categoryChipText, selectedCategory === cat.label && { fontWeight: "700" }]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={{ marginTop: 15 }}>
              {filtered.map((job) => (
                <View key={job.id} style={styles.card}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.company}>{job.companyName}</Text>
                  <Text style={styles.location}>
                    📍 {job.location || "Đang cập nhật"} | ⏰ {job.jobType || "Đang cập nhật"}
                  </Text>
                  <Text style={styles.salary}>💰 {job.salary || "Liên hệ"}</Text>

                  <TouchableOpacity style={styles.applyBtn} onPress={() => setSelectedJob(job)}>
                    <Text style={styles.applyText}>Ứng tuyển</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {filtered.length === 0 && (
                <Text style={{ marginTop: 20, fontStyle: "italic", textAlign: "center" }}>
                  Không tìm thấy công việc phù hợp.
                </Text>
              )}
            </View>
            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 60 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20, color: "#333" },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    elevation: 2,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15 },
  filterTitle: { fontSize: 16, fontWeight: "700", color: "#d32f2f", marginBottom: 10 },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryChipActive: { backgroundColor: "#ffe8e8", borderColor: "#ff6969" },
  categoryChipText: { marginLeft: 6, color: "#333" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  jobTitle: { fontSize: 17, fontWeight: "700", color: "#3949ab" },
  company: { marginTop: 4, fontSize: 14, color: "#666" },
  location: { marginTop: 2, fontSize: 13, color: "#444" },
  salary: { marginTop: 6, fontSize: 14, color: "green", fontWeight: "600" },
  applyBtn: { marginTop: 12, backgroundColor: "#5a4ff7", paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  applyText: { color: "#fff", fontWeight: "700" },
});
