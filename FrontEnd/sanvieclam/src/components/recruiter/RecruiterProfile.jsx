import React, { useState, useEffect } from "react";
import {
  getEmployerProfile,
  updateEmployerProfile,
} from "../../api/RecruiterApi";

const RecruiterProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    companyName: "",
    companyAddress: "",
    companySize: "",
    companyField: "",
    taxCode: "",
    businessLicense: "",
    companyDescription: "",
    companyWebsite: "",
    companySocial: "",
  });

  const [loading, setLoading] = useState(true);

  // 🟢 Gọi API lấy profile khi load component
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getEmployerProfile();
        setFormData((prev) => ({
          ...prev,
          ...data, // merge để không mất state
        }));
      } catch (error) {
        console.error("❌ Lỗi khi tải hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 🟢 Update state khi nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🟢 Gọi API update
  const handleUpdate = async () => {
    try {
      const updated = await updateEmployerProfile(formData);
      alert("✅ Thông tin đã được cập nhật!");
      setFormData((prev) => ({
        ...prev,
        ...updated,
      }));
    } catch (error) {
      alert("❌ Cập nhật thất bại!");
      console.error("Update error:", error);
    }
  };
  
  if (loading) {
    return <div className="text-center mt-20">⏳ Đang tải hồ sơ...</div>;
  }

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

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Chức vụ
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* 🏢 Thông tin công ty */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-green-600">
            🏢 Thông tin công ty
          </h2>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tên công ty
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Địa chỉ công ty
            </label>
            <input
              type="text"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Quy mô công ty
            </label>
            <input
              type="text"
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Lĩnh vực hoạt động
            </label>
            <input
              type="text"
              name="companyField"
              value={formData.companyField}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Mã số thuế
            </label>
            <input
              type="text"
              name="taxCode"
              value={formData.taxCode}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Giấy phép kinh doanh
            </label>
            <input
              type="text"
              name="businessLicense"
              value={formData.businessLicense}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Mô tả công ty
            </label>
            <textarea
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* 🌐 Thông tin bổ sung */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-purple-600">
            🌐 Thông tin bổ sung
          </h2>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Website công ty
            </label>
            <input
              type="text"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Mạng xã hội / Liên kết
            </label>
            <input
              type="text"
              name="companySocial"
              value={formData.companySocial}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
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
