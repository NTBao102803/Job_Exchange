
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  getAvatarUrl,
  getCandidateProfile,
  updateCandidateProfile,
  uploadAvatar,
} from "../../api/CandidateApi";

import { useMenu } from "../../context/MenuContext";

type FormData = {
  fullName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  school: string;
  major: string;
  gpa: string;
  graduationYear: string;
  experience: string;
  projects: string;
  skills: string;
  certificates: string;
  careerGoal: string;
  hobbies: string;
  social: string;
};

const genderOptions = ["Nam", "Nữ", "Khác"];
const genderMapBackend: Record<string, string> = {
  Nam: "Male",
  Nữ: "Female",
  Khác: "Other",
};

export default function Profile() {
  const { openMenu } = useMenu();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dob: "",
    gender: "Nam",
    email: "",
    phone: "",
    address: "",
    school: "",
    major: "",
    gpa: "",
    graduationYear: "",
    experience: "",
    projects: "",
    skills: "",
    certificates: "",
    careerGoal: "",
    hobbies: "",
    social: "",
  });

  const [avatar, setAvatar] = useState<string | null>(null);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 21 }, (_, i) =>
    (currentYear - i).toString()
  );
  // ---------------------------
  // PICK AVATAR
  // ---------------------------
  const handlePickAvatar = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Quyền truy cập ảnh bị từ chối!");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setAvatar(uri);

      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) return;

      try {
        await uploadAvatar({ uri, name: "avatar.jpg", type: "image/jpeg" }, userId);
        const avatarUrl = await getAvatarUrl(userId);
        console.log("📌 URL từ server:", avatarUrl);
        if (avatarUrl) setAvatar(avatarUrl);
      } catch (error) {
        console.error("❌ Lỗi upload avatar:", error);
        alert("Upload avatar thất bại!");
      }
    }
  };

  // =============================
  // 📌 LOAD PROFILE TỪ CandidateApi
  // =============================
  const fetchProfile = async () => {
    setLoading(true);

    try {
      const data = await getCandidateProfile();

      setFormData({
        fullName: data.fullName || "",
        dob: data.dob || "",
        gender: data.gender === "Male" ? "Nam" : data.gender === "Female" ? "Nữ" : "Khác",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        school: data.school || "",
        major: data.major || "",
        gpa: data.gpa || "",
        graduationYear: data.graduationYear || "",
        experience: data.experience || "",
        projects: data.projects || "",
        skills: data.skills || "",
        certificates: data.certificates || "",
        careerGoal: data.careerGoal || "",
        hobbies: data.hobbies || "",
        social: data.social || "",
      });

      const userId = await SecureStore.getItemAsync("userId");
      if (userId) {
        const avatarUrl = await getAvatarUrl(userId);
        if (avatarUrl) {
        setAvatar(avatarUrl);
      }
      }
    } catch (error) {
      console.error("❌ Lỗi tải hồ sơ:", error);
      alert("Lỗi tải hồ sơ ứng viên!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =============================
  // 📌 UPDATE PROFILE bằng CandidateApi
  // =============================
  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        gender: genderMapBackend[formData.gender],
      };

      await updateCandidateProfile(payload);
      alert("Cập nhật hồ sơ thành công!");
    } catch (error: any) {
      console.error("❌ Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật hồ sơ!");
    }
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Đang tải hồ sơ...</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ marginBottom: 150 }}>
      <Text style={styles.title}>📄 Hồ sơ ứng viên</Text>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={{ color: "#888" }}>No Image</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.uploadButton} onPress={handlePickAvatar}>
          <Text style={styles.uploadButtonText}>📤 Tải ảnh lên</Text>
        </TouchableOpacity>
      </View>

      {/* Thông tin cá nhân */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Thông tin cá nhân</Text>

        {["fullName", "dob", "email", "phone", "address"].map((key) => (
          <View key={key}>
            <Text style={styles.label}>
              {key === "fullName"
                ? "Họ và tên"
                : key === "dob"
                ? "Ngày sinh"
                : key === "email"
                ? "Email"
                : key === "phone"
                ? "Số điện thoại"
                : "Địa chỉ"}
            </Text>
            <TextInput
              style={styles.input}
              value={formData[key as keyof FormData]}
              onChangeText={(text) => handleChange(key as keyof FormData, text)}
              editable={key !== "email"}
            />
          </View>
        ))}

        <Text style={styles.label}>Giới tính</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setGenderModalVisible(true)}
        >
          <Text>{formData.gender}</Text>
        </TouchableOpacity>

        <Modal visible={genderModalVisible} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setGenderModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <FlatList
              data={genderOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleChange("gender", item);
                    setGenderModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      </View>

      {/* Học vấn */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎓 Thông tin học vấn</Text>
        {["school", "major", "gpa"].map((key) => (
          <View key={key}>
            <Text style={styles.label}>
              {key === "school" ? "Trường học" : key === "major" ? "Chuyên ngành" : "GPA"}
            </Text>
            <TextInput
              style={styles.input}
              value={formData[key as keyof FormData]}
              onChangeText={(text) => handleChange(key as keyof FormData, text)}
            />
          </View>
        ))}

        <Text style={styles.label}>Năm tốt nghiệp</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setYearModalVisible(true)}
        >
          <Text>{formData.graduationYear}</Text>
        </TouchableOpacity>

        <Modal visible={yearModalVisible} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setYearModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <FlatList
              data={graduationYears}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleChange("graduationYear", item);
                    setYearModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      </View>

      {/* Kinh nghiệm, kỹ năng, bổ sung */}
      {[
        { title: "💼 Kinh nghiệm & Dự án", fields: ["experience", "projects"] },
        { title: "🛠️ Kỹ năng & Chứng chỉ", fields: ["skills", "certificates"] },
        { title: "🌐 Thông tin bổ sung", fields: ["careerGoal", "hobbies", "social"] },
      ].map((section, idx) => (
        <View key={idx} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.fields.map((key) => (
            <View key={key}>
              <Text style={styles.label}>
                {key === "experience"
                  ? "Kinh nghiệm"
                  : key === "projects"
                  ? "Dự án"
                  : key === "skills"
                  ? "Kỹ năng"
                  : key === "certificates"
                  ? "Chứng chỉ"
                  : key === "careerGoal"
                  ? "Mục tiêu nghề nghiệp"
                  : key === "hobbies"
                  ? "Sở thích"
                  : "Mạng xã hội / Liên kết"}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  ["experience", "projects", "skills", "certificates", "careerGoal", "hobbies"].includes(key)
                    ? styles.textArea
                    : {},
                ]}
                value={formData[key as keyof FormData]}
                onChangeText={(text) => handleChange(key as keyof FormData, text)}
                multiline={["experience", "projects", "skills", "certificates", "careerGoal", "hobbies"].includes(key)}
              />
            </View>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Cập nhật thông tin</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ------------------
// CSS
// ------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f4f7", marginTop: 50, marginBottom: 70 },
  title: { fontSize: 28, fontWeight: "bold", color: "#4f46e5", marginBottom: 20, textAlign: "center" },
  avatarSection: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatarWrapper: { width: 100, height: 100, borderRadius: 50, overflow: "hidden", marginRight: 16, borderWidth: 2, borderColor: "#4f46e5" },
  avatarImage: { width: "100%", height: "100%" },
  avatarPlaceholder: { flex: 1, backgroundColor: "#ddd", justifyContent: "center", alignItems: "center" },
  uploadButton: { backgroundColor: "#4f46e5", padding: 10, borderRadius: 10 },
  uploadButtonText: { color: "#fff", fontWeight: "600" },
  section: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 12, color: "#4338ca" },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 10, marginBottom: 8, backgroundColor: "#f9fafb" },
  textArea: { minHeight: 60, textAlignVertical: "top" },
  button: { backgroundColor: "#4f46e5", padding: 14, borderRadius: 12, alignItems: "center", marginVertical: 20 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", maxHeight: 300, marginHorizontal: 40, borderRadius: 12, paddingVertical: 8 },
  modalItem: { paddingVertical: 12, paddingHorizontal: 16 },
  modalItemText: { fontSize: 16 },
});
