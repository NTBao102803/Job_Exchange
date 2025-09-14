import React, { useState } from "react";

const RecruiterProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "Nguyễn Văn B",
    email: "nguyenvanb@company.com",
    phone: "0912345678",
    position: "HR Manager",
    companyName: "Công ty TNHH Công Nghệ ABC",
    companyAddress: "Quận 3, TP. Hồ Chí Minh",
    companySize: "100-500 nhân viên",
    companyField: "Công nghệ thông tin",
    taxCode: "0312345678",
    businessLicense: "1234/GP-ĐKKD",
    companyWebsite: "https://abc-tech.com",
    companySocial: "linkedin.com/company/abc-tech",
    companyDescription:
      "ABC Tech là công ty công nghệ trẻ trung, năng động, chuyên phát triển phần mềm và giải pháp AI cho doanh nghiệp.",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    alert("Thông tin nhà tuyển dụng đã được cập nhật!");
    console.log("Updated recruiter data:", formData);
  };

  const InputField = ({ label, name, type = "text" }) => (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
    </div>
  );

  const TextAreaField = ({ label, name, rows = 3 }) => (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        rows={rows}
        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-24 p-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8 space-y-10">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          🏢 Hồ sơ Nhà tuyển dụng
        </h1>

        {/* 👤 Thông tin cá nhân */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-blue-500">
            👤 Thông tin cá nhân người đại diện
          </h2>
          <InputField label="Họ và tên" name="fullName" />
          <InputField label="Email" name="email" type="email" />
          <InputField label="Số điện thoại" name="phone" />
          <InputField label="Chức vụ" name="position" />
        </div>

        {/* 🏢 Thông tin công ty */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-green-600">
            🏢 Thông tin công ty
          </h2>
          <InputField label="Tên công ty" name="companyName" />
          <InputField label="Địa chỉ công ty" name="companyAddress" />
          <InputField label="Quy mô công ty" name="companySize" />
          <InputField label="Lĩnh vực hoạt động" name="companyField" />
          <InputField label="Mã số thuế" name="taxCode" />
          <InputField label="Giấy phép kinh doanh" name="businessLicense" />
          <TextAreaField
            label="Mô tả công ty"
            name="companyDescription"
            rows={4}
          />
        </div>

        {/* 🌐 Thông tin bổ sung */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-purple-600">
            🌐 Thông tin bổ sung
          </h2>
          <InputField label="Website công ty" name="companyWebsite" />
          <InputField label="Mạng xã hội / Liên kết" name="companySocial" />
        </div>

        {/* Nút cập nhật */}
        <div className="flex justify-center">
          <button
            onClick={handleUpdate}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition transform hover:scale-105"
          >
            Cập nhật thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
