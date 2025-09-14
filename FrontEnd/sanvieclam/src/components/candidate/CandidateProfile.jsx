import React, { useState } from "react";

const CandidateProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "Nguyễn Văn A",
    dob: "2000-01-01",
    gender: "Nam",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    address: "Quận 1, TP. Hồ Chí Minh",
    school: "Đại học Công nghiệp TP.HCM (IUH)",
    major: "Khoa học máy tính",
    gpa: "3.5/4.0",
    graduationYear: "2022",
    experience: "Thực tập tại công ty ABC (6 tháng)",
    projects: "Website thương mại điện tử, hệ thống quản lý sinh viên",
    skills: "Java, Spring Boot, SQL, Docker, ReactJS, Git",
    certificates: "IELTS 6.5, Chứng chỉ Java OCP",
    careerGoal:
      "Trở thành chuyên gia backend, tối ưu hiệu năng và mở rộng hệ thống.",
    hobbies: "Đọc sách công nghệ, tham gia hackathon",
    social: "linkedin.com/in/nguyenvana",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    alert("Thông tin đã được cập nhật!");
    console.log("Updated data:", formData);
  };

  // Component input chung
  const InputField = ({ label, name, type = "text" }) => (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
      />
    </div>
  );

  // Component textarea chung
  const TextAreaField = ({ label, name, rows = 3 }) => (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        rows={rows}
        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-24 p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 space-y-10">
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          📄 Hồ sơ ứng viên
        </h1>

        {/* 👤 Thông tin cá nhân */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-indigo-500">
            👤 Thông tin cá nhân
          </h2>
          <InputField label="Họ và tên" name="fullName" />
          <InputField label="Ngày sinh" name="dob" type="date" />
          <InputField label="Giới tính" name="gender" />
          <InputField label="Email" name="email" type="email" />
          <InputField label="Số điện thoại" name="phone" />
          <InputField label="Địa chỉ" name="address" />
        </div>

        {/* 🎓 Thông tin học vấn */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-green-600">
            🎓 Thông tin học vấn
          </h2>
          <InputField label="Trường học" name="school" />
          <InputField label="Chuyên ngành" name="major" />
          <InputField label="GPA" name="gpa" />
          <InputField label="Năm tốt nghiệp" name="graduationYear" />
        </div>

        {/* 💼 Kinh nghiệm & Dự án */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-yellow-600">
            💼 Kinh nghiệm & Dự án
          </h2>
          <TextAreaField label="Kinh nghiệm" name="experience" />
          <TextAreaField label="Dự án" name="projects" rows={4} />
        </div>

        {/* 🛠️ Kỹ năng & Chứng chỉ */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-purple-600">
            🛠️ Kỹ năng & Chứng chỉ
          </h2>
          <TextAreaField label="Kỹ năng" name="skills" />
          <TextAreaField label="Chứng chỉ" name="certificates" />
        </div>

        {/* 🌐 Thông tin bổ sung */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-pink-600">
            🌐 Thông tin bổ sung
          </h2>
          <TextAreaField label="Mục tiêu nghề nghiệp" name="careerGoal" rows={3} />
          <TextAreaField label="Sở thích" name="hobbies" />
          <InputField label="Mạng xã hội / Liên kết" name="social" />
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
