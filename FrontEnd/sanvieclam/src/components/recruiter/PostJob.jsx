import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Calendar, Eye } from "lucide-react";
import JobPreviewModal from "./JobPreviewModal";

const PostJob = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
    startDate: today,
    endDate: "",
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (jobData.endDate && jobData.endDate < jobData.startDate) {
      alert("⛔ Ngày kết thúc phải sau ngày bắt đầu!");
      return;
    }

    console.log("Dữ liệu tin tuyển dụng:", jobData);
    alert("✅ Tin tuyển dụng đang đợi nền tảng kiểm duyệt!");
    navigate(-1);
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl p-10 border border-gray-100">
          {/* Header */}
          <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
            ✨ Đăng tin tuyển dụng
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tiêu đề công việc */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tiêu đề công việc <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="VD: Lập trình viên Backend Java"
                className="w-full border rounded-xl px-4 py-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Công ty & Địa điểm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Công ty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={jobData.company}
                  onChange={handleChange}
                  placeholder="Tên công ty"
                  className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Địa điểm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  placeholder="VD: Hà Nội, TP.HCM"
                  className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Loại việc & Lương */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Loại việc <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={jobData.type}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">-- Chọn loại việc --</option>
                  <option value="Fulltime">Fulltime</option>
                  <option value="Parttime">Parttime</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mức lương
                </label>
                <input
                  type="text"
                  name="salary"
                  value={jobData.salary}
                  onChange={handleChange}
                  placeholder="VD: 15 - 20 triệu"
                  className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Thời gian tuyển dụng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" /> Ngày bắt đầu
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={jobData.startDate}
                  readOnly
                  className="w-full border rounded-xl px-4 py-3 bg-gray-100 shadow-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" /> Ngày kết thúc{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={jobData.endDate}
                  onChange={handleChange}
                  min={jobData.startDate}
                  className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mô tả công việc
              </label>
              <textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Nhập mô tả công việc..."
                className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Yêu cầu */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Yêu cầu ứng viên
              </label>
              <textarea
                name="requirements"
                value={jobData.requirements}
                onChange={handleChange}
                rows="3"
                placeholder="Nhập yêu cầu ứng viên..."
                className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Quyền lợi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Quyền lợi
              </label>
              <textarea
                name="benefits"
                value={jobData.benefits}
                onChange={handleChange}
                rows="3"
                placeholder="Nhập quyền lợi..."
                className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Nút hành động */}
            <div className="flex justify-between items-center pt-6 gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2 flex items-center gap-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium text-sm shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="px-5 py-2 flex items-center gap-2 border border-blue-500 text-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition font-medium text-sm"
                >
                  <Eye className="w-4 h-4" /> Xem trước
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition font-medium text-sm"
                >
                  <Save className="w-4 h-4" /> Đăng tin
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showPreview && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 relative overflow-y-auto max-h-[90vh]">
      <button
        onClick={() => setShowPreview(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
      >
        ✖
      </button>
      <JobPreviewModal job={jobData} />
    </div>
  </div>
)}
    </div>
  );
};

export default PostJob;
