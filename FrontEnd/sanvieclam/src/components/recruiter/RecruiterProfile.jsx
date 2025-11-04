import React, { useState, useEffect } from "react";
import {
  getEmployerProfile,
  updateEmployerProfile,
  uploadAvatar,
  getAvatarUrl,
} from "../../api/RecruiterApi";
import { useUser } from "../../context/UserContext"; // ✅ dùng context để cập nhật avatar toàn app

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
    avatarUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const { setAvatarUrl } = useUser(); // ✅ cập nhật avatar header

  // 🟢 Lấy thông tin profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getEmployerProfile();
        setFormData((prev) => ({ ...prev, ...data }));

        let avatarLink = data.avatarUrl || null;
        if (!avatarLink && data.id) {
          try {
            avatarLink = await getAvatarUrl(data.id);
          } catch {
            console.warn("⚠️ Không có avatar cho employer:", data.id);
          }
        }

        if (avatarLink) {
          setAvatar(avatarLink);
          setAvatarUrl(avatarLink); // ✅ cập nhật avatar context
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setAvatarUrl]);

  // 🧩 Upload avatar
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);

    try {
      if (!formData.id) {
        alert("Không tìm thấy ID của nhà tuyển dụng!");
        return;
      }

      // Upload ảnh
      const res = await uploadAvatar(file, formData.id);
      console.log("✅ Upload avatar success:", res.fileUrl);

      // Cập nhật DB
      const updated = await updateEmployerProfile({
        ...formData,
        avatarUrl: res.fileUrl,
      });

      setFormData(updated);
      setAvatar(res.fileUrl);
      setAvatarUrl(res.fileUrl); // ✅ cập nhật header ngay

      alert("✅ Ảnh đại diện đã được cập nhật!");
    } catch (error) {
      console.error("❌ Upload avatar error:", error);
      alert("Tải ảnh thất bại!");
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // 🧩 Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🧩 Cập nhật thông tin hồ sơ
  const handleUpdate = async () => {
    try {
      const updated = await updateEmployerProfile(formData);
      setFormData(updated);
      alert("✅ Thông tin đã được cập nhật!");
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
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8 space-y-10 transition-all duration-300">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          🏢 Hồ sơ Nhà tuyển dụng
        </h1>

        {/* 🖼️ Avatar */}
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

        {/* 👤 Thông tin cá nhân */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-blue-500">
            👤 Thông tin người đại diện
          </h2>
          <Input label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleChange} />
          <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
          <Input label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} />
          <Input label="Chức vụ" name="position" value={formData.position} onChange={handleChange} />
        </div>

        {/* 🏢 Thông tin công ty */}
        <div className="space-y-6 border-b pb-6">
          <h2 className="text-2xl font-bold text-green-600">🏢 Thông tin công ty</h2>
          <Input label="Tên công ty" name="companyName" value={formData.companyName} onChange={handleChange} />
          <Input label="Địa chỉ công ty" name="companyAddress" value={formData.companyAddress} onChange={handleChange} />
          <Input label="Quy mô công ty" name="companySize" value={formData.companySize} onChange={handleChange} />
          <Input label="Lĩnh vực hoạt động" name="companyField" value={formData.companyField} onChange={handleChange} />
          <Input label="Mã số thuế" name="taxCode" value={formData.taxCode} onChange={handleChange} />
          <Input label="Giấy phép kinh doanh" name="businessLicense" value={formData.businessLicense} onChange={handleChange} />
          <TextArea label="Mô tả công ty" name="companyDescription" value={formData.companyDescription} onChange={handleChange} />
        </div>

        {/* 🌐 Thông tin bổ sung */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-purple-600">🌐 Thông tin bổ sung</h2>
          <Input label="Website công ty" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} />
          <Input label="Mạng xã hội / Liên kết" name="companySocial" value={formData.companySocial} onChange={handleChange} />
        </div>

        <div className="flex justify-center pt-4">
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

// 👉 Input component tái sử dụng
const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </div>
);

// 👉 Textarea component tái sử dụng
const TextArea = ({ label, name, value, onChange, rows = 4 }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">{label}</label>
    <textarea
      name={name}
      value={value || ""}
      onChange={onChange}
      rows={rows}
      className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </div>
);

export default RecruiterProfile;
