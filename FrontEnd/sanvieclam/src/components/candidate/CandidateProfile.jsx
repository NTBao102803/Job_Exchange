import React, { useState, useEffect } from "react";
import {
  getCandidateProfile,
  updateCandidateProfile,
  uploadAvatar,
  getAvatarUrl,
} from "../../api/CandidateApi";
import { useUser } from "../../context/UserContext"; 

// 👉 Input chung
const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
    />
  </div>
);

// 👉 Textarea chung
const TextAreaField = ({ label, name, value, onChange, rows = 3 }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">{label}</label>
    <textarea
      name={name}
      value={value || ""}
      onChange={onChange}
      rows={rows}
      className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
    />
  </div>
);

// 👉 Dropdown cho giới tính
const GenderSelect = ({ value, onChange }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">Giới tính</label>
    <select
      name="gender"
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
    >
      <option value="Nam">Nam</option>
      <option value="Nữ">Nữ</option>
      <option value="Khác">Khác</option>
    </select>
  </div>
);

// 👉 Dropdown cho năm tốt nghiệp
const GraduationYearSelect = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear() + 10;
  const years = Array.from({ length: 21 }, (_, i) => currentYear - i);

  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">
        Năm tốt nghiệp
      </label>
      <select
        name="graduationYear"
        value={value}
        onChange={onChange}
        className="w-full p-3 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

const CandidateProfile = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const { setAvatarUrl } = useUser(); // ✅ Lấy setter từ context

  // 🟢 Lấy hồ sơ
  const fetchProfile = async () => {
    try {
      const data = await getCandidateProfile();
      const userId = data.id || data.userId;
      let avatarUrl = data.avatarUrl || null;

      if (!avatarUrl && userId) {
        avatarUrl = await getAvatarUrl(userId);
      }

      setFormData({
        ...data,
        gender:
          data.gender === "Male"
            ? "Nam"
            : data.gender === "Female"
            ? "Nữ"
            : "Khác",
      });
      setAvatar(avatarUrl);
    } catch (error) {
      console.error("❌ Lỗi khi tải hồ sơ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🧩 Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🧩 Upload avatar
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl); // Preview nhanh

    try {
      const userId = formData.id || formData.userId;
      if (!userId) {
        alert("Không xác định được userId!");
        return;
      }

      // Upload file
      const res = await uploadAvatar(file, userId);
      console.log("✅ Avatar uploaded:", res.fileUrl);

      // Cập nhật DB
      const updatedPayload = {
        ...formData,
        avatarUrl: res.fileUrl,
        gender:
          formData.gender === "Nam"
            ? "Male"
            : formData.gender === "Nữ"
            ? "Female"
            : "Other",
      };
      await updateCandidateProfile(updatedPayload);

      // Lấy lại URL thực
      const latestUrl = await getAvatarUrl(userId);
      setAvatar(latestUrl);
      setAvatarUrl(latestUrl); // ✅ Cập nhật context → UI toàn app update

      alert("✅ Ảnh đại diện đã được cập nhật!");
    } catch (error) {
      console.error("❌ Lỗi upload ảnh:", error);
      alert("Tải ảnh thất bại!");
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // 🧩 Cập nhật hồ sơ
  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        gender:
          formData.gender === "Nam"
            ? "Male"
            : formData.gender === "Nữ"
            ? "Female"
            : "Other",
        dob: formData.dob
          ? new Date(formData.dob).toISOString().split("T")[0]
          : null,
        role: "USER",
      };

      await updateCandidateProfile(payload);
      await fetchProfile();
      alert("✅ Thông tin đã được cập nhật!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật hồ sơ:", error);
      alert("Có lỗi xảy ra khi cập nhật!");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-lg text-gray-600 animate-pulse">
        Đang tải hồ sơ...
      </div>
    );
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-24 p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 space-y-10 transition-all duration-300">
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          📄 Hồ sơ ứng viên
        </h1>

        {/* 🖼️ Ảnh đại diện */}
        <div className="flex items-center space-x-8 border-b pb-8">
          <div className="relative group w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-500 shadow-2xl transform transition duration-500 hover:scale-105 hover:shadow-indigo-300/50">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-lg">
                No Image
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-sm">Cập nhật</span>
            </div>
          </div>

          <label className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg cursor-pointer transition duration-300 hover:bg-indigo-700 hover:shadow-xl hover:scale-105">
            📤 Tải ảnh lên
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Các nhóm thông tin */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-indigo-500">
            👤 Thông tin cá nhân
          </h2>
          <InputField label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleChange} />
          <InputField label="Ngày sinh" name="dob" type="date" value={formData.dob} onChange={handleChange} />
          <GenderSelect value={formData.gender} onChange={handleChange} />
          <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          <InputField label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} />
          <InputField label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} />
        </div>

        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-green-600">🎓 Thông tin học vấn</h2>
          <InputField label="Trường học" name="school" value={formData.school} onChange={handleChange} />
          <InputField label="Chuyên ngành" name="major" value={formData.major} onChange={handleChange} />
          <InputField label="GPA" name="gpa" value={formData.gpa} onChange={handleChange} />
          <GraduationYearSelect value={formData.graduationYear} onChange={handleChange} />
        </div>

        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-yellow-600">💼 Kinh nghiệm & Dự án</h2>
          <TextAreaField label="Kinh nghiệm" name="experience" value={formData.experience} onChange={handleChange} />
          <TextAreaField label="Dự án" name="projects" value={formData.projects} onChange={handleChange} rows={4} />
        </div>

        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-purple-600">🛠️ Kỹ năng & Chứng chỉ</h2>
          <TextAreaField label="Kỹ năng" name="skills" value={formData.skills} onChange={handleChange} />
          <TextAreaField label="Chứng chỉ" name="certificates" value={formData.certificates} onChange={handleChange} />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-pink-600">🌐 Thông tin bổ sung</h2>
          <TextAreaField label="Mục tiêu nghề nghiệp" name="careerGoal" value={formData.careerGoal} onChange={handleChange} rows={3} />
          <TextAreaField label="Sở thích" name="hobbies" value={formData.hobbies} onChange={handleChange} />
          <InputField label="Mạng xã hội / Liên kết" name="social" value={formData.social} onChange={handleChange} />
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={handleUpdate}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition transform hover:scale-105"
          >
            Cập nhật thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
