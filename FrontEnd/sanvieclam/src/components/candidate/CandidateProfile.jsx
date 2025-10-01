import React, { useState, useEffect } from "react";
import {
  getCandidateProfile,
  updateCandidateProfile,
} from "../../api/CandidateApi";

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
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
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
  const [loading, setLoading] = useState(true);

  // 🖼️ Ảnh avatar (local preview)
  const [avatar, setAvatar] = useState(null);

  // 🟢 Gọi API lấy profile khi load component
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCandidateProfile();
        setFormData((prev) => ({
          ...prev,
          ...data,
          gender:
            data.gender === "Male"
              ? "Nam"
              : data.gender === "Female"
              ? "Nữ"
              : "Khác",
        }));

        // Nếu có ảnh từ server
        if (data.avatarUrl) {
          setAvatar(data.avatarUrl);
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 👉 Upload ảnh (chỉ preview, chưa lưu DB)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      // Nếu bạn muốn gửi file -> FormData gửi API ở đây
    }
  };

  // 👉 Cập nhật hồ sơ
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
        // avatar: avatarFile nếu muốn gửi ảnh
      };

      const updated = await updateCandidateProfile(payload);
      alert("Thông tin đã được cập nhật!");
      console.log("Updated data:", updated);
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      alert("Có lỗi xảy ra khi cập nhật!");
    }
  };

  // 👉 Nếu chưa load xong thì hiển thị loading
  if (loading) {
    return <div className="p-10 text-center">Đang tải hồ sơ...</div>;
  }

  if (!formData) {
    return (
      <div className="p-10 text-center text-red-500">Không tìm thấy hồ sơ!</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-24 p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 space-y-10">
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          📄 Hồ sơ ứng viên
        </h1>

        {/* 🖼️ Ảnh đại diện */}
<div className="flex items-center space-x-8 border-b pb-8">
  {/* Avatar */}
  <div className="relative group w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-500 shadow-2xl transform transition duration-500 hover:scale-105 hover:shadow-indigo-300/50">
    {avatar ? (
      <img
        src={avatar}
        alt="Avatar"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 text-lg">
        No Image
      </div>
    )}

    {/* Hiệu ứng overlay khi hover */}
    <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
      <span className="text-white text-sm">Cập nhật</span>
    </div>
  </div>

  {/* Upload button */}
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


        {/* 👤 Thông tin cá nhân */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-indigo-500">
            👤 Thông tin cá nhân
          </h2>
          <InputField
            label="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          <InputField
            label="Ngày sinh"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
          />
          <GenderSelect value={formData.gender} onChange={handleChange} />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Số điện thoại"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <InputField
            label="Địa chỉ"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* 🎓 Thông tin học vấn */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-green-600">
            🎓 Thông tin học vấn
          </h2>
          <InputField
            label="Trường học"
            name="school"
            value={formData.school}
            onChange={handleChange}
          />
          <InputField
            label="Chuyên ngành"
            name="major"
            value={formData.major}
            onChange={handleChange}
          />
          <InputField
            label="GPA"
            name="gpa"
            value={formData.gpa}
            onChange={handleChange}
          />
          <GraduationYearSelect
            value={formData.graduationYear}
            onChange={handleChange}
          />
        </div>

        {/* 💼 Kinh nghiệm & Dự án */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-yellow-600">
            💼 Kinh nghiệm & Dự án
          </h2>
          <TextAreaField
            label="Kinh nghiệm"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
          <TextAreaField
            label="Dự án"
            name="projects"
            value={formData.projects}
            onChange={handleChange}
            rows={4}
          />
        </div>

        {/* 🛠️ Kỹ năng & Chứng chỉ */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-purple-600">
            🛠️ Kỹ năng & Chứng chỉ
          </h2>
          <TextAreaField
            label="Kỹ năng"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
          />
          <TextAreaField
            label="Chứng chỉ"
            name="certificates"
            value={formData.certificates}
            onChange={handleChange}
          />
        </div>

        {/* 🌐 Thông tin bổ sung */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-pink-600">
            🌐 Thông tin bổ sung
          </h2>
          <TextAreaField
            label="Mục tiêu nghề nghiệp"
            name="careerGoal"
            value={formData.careerGoal}
            onChange={handleChange}
            rows={3}
          />
          <TextAreaField
            label="Sở thích"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
          />
          <InputField
            label="Mạng xã hội / Liên kết"
            name="social"
            value={formData.social}
            onChange={handleChange}
          />
        </div>

        {/* Nút cập nhật */}
        <div className="flex justify-center">
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
