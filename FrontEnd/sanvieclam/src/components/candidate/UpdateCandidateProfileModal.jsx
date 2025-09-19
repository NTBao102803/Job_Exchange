import React, { useState, useEffect } from "react";
import { updateCandidateProfile } from "../../api/CandidateApi";

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

// 👉 Dropdown giới tính
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

// 👉 Dropdown năm tốt nghiệp
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

const UpdateCandidateProfileModal = ({ isOpen, onClose, candidate, onUpdate }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (candidate) {
      setFormData({ ...candidate });
    }
  }, [candidate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
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
      };

      const updated = await updateCandidateProfile(payload);
      onUpdate(updated);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật!");
    }
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-hidden">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Nút X đóng modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          📄 Chỉnh sửa hồ sơ ứng viên
        </h2>

        {/* 👤 Thông tin cá nhân */}
        <div className="space-y-6 border-b pb-6">
          <h3 className="text-2xl font-bold text-indigo-500">👤 Thông tin cá nhân</h3>
          <InputField label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleChange} />
          <InputField label="Ngày sinh" name="dob" type="date" value={formData.dob} onChange={handleChange} />
          <GenderSelect value={formData.gender} onChange={handleChange} />
          <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          <InputField label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} />
          <InputField label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} />
        </div>

        {/* 🎓 Thông tin học vấn */}
        <div className="space-y-6 border-b pb-6 mt-6">
          <h3 className="text-2xl font-bold text-green-600">🎓 Thông tin học vấn</h3>
          <InputField label="Trường học" name="school" value={formData.school} onChange={handleChange} />
          <InputField label="Chuyên ngành" name="major" value={formData.major} onChange={handleChange} />
          <InputField label="GPA" name="gpa" value={formData.gpa} onChange={handleChange} />
          <GraduationYearSelect value={formData.graduationYear} onChange={handleChange} />
        </div>

        {/* 💼 Kinh nghiệm & Dự án */}
        <div className="space-y-6 border-b pb-6 mt-6">
          <h3 className="text-2xl font-bold text-yellow-600">💼 Kinh nghiệm & Dự án</h3>
          <TextAreaField label="Kinh nghiệm" name="experience" value={formData.experience} onChange={handleChange} />
          <TextAreaField label="Dự án" name="projects" value={formData.projects} onChange={handleChange} rows={4} />
        </div>

        {/* 🛠️ Kỹ năng & Chứng chỉ */}
        <div className="space-y-6 border-b pb-6 mt-6">
          <h3 className="text-2xl font-bold text-purple-600">🛠️ Kỹ năng & Chứng chỉ</h3>
          <TextAreaField label="Kỹ năng" name="skills" value={formData.skills} onChange={handleChange} />
          <TextAreaField label="Chứng chỉ" name="certificates" value={formData.certificates} onChange={handleChange} />
        </div>

        {/* 🌐 Thông tin bổ sung */}
        <div className="space-y-6 mt-6">
          <h3 className="text-2xl font-bold text-pink-600">🌐 Thông tin bổ sung</h3>
          <TextAreaField label="Mục tiêu nghề nghiệp" name="careerGoal" value={formData.careerGoal} onChange={handleChange} rows={3} />
          <TextAreaField label="Sở thích" name="hobbies" value={formData.hobbies} onChange={handleChange} />
          <InputField label="Mạng xã hội / Liên kết" name="social" value={formData.social} onChange={handleChange} />
        </div>

        {/* Nút Hủy / Lưu */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCandidateProfileModal;
