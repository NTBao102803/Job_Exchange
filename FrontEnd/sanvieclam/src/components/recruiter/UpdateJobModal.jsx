import React, { useState, useEffect } from "react";
import { Save, Calendar, X } from "lucide-react";

const UpdateJobModal = ({ job, employer, onClose, onUpdate }) => {
  const [jobData, setJobData] = useState({
    ...job,
    companyName: employer?.companyName || "",
    // ép về phẳng để dễ xử lý form
    skills: Array.isArray(job?.requirements?.skills)
      ? job.requirements.skills.join(", ")
      : job?.skills || "",
    experience: job?.requirements?.experience || "",
    certificates: job?.requirements?.certificates || "",
    career: job?.requirements?.career || "",
    descriptionRequirements: job?.requirements?.descriptionRequirements || "",
  });

  useEffect(() => {
    setJobData({ 
      ...job, 
      companyName: employer?.companyName || "",
      skills: Array.isArray(job?.requirements?.skills)
        ? job.requirements.skills.join(", ")
        : job?.skills || "",
      experience: job?.requirements?.experience || "",
      certificates: job?.requirements?.certificates || "",
      career: job?.requirements?.career || "",
      descriptionRequirements: job?.requirements?.descriptionRequirements || "",
    });
  }, [job, employer]);

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

    // tách skills thành mảng như bên PostJob
    const payload = {
      ...jobData,
        title: jobData.title,
        location: jobData.location,
        jobType: jobData.jobType,
        salary: jobData.salary,
        startDate: jobData.startDate,
        endDate: jobData.endDate,
        description: jobData.description,
        benefits: jobData.benefits,
        requirements: {
          skills: jobData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          experience: jobData.experience,
          certificates: jobData.certificates,
          career: jobData.career,
          descriptionRequirements: jobData.descriptionRequirements,
        },
    };

    onUpdate(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8 relative 
                   max-h-[90vh] overflow-y-auto hide-scrollbar"
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          ✏️ Cập nhật tin tuyển dụng
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tiêu đề công việc */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tiêu đề công việc <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={jobData.title || ""}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Công ty & Địa điểm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Công ty
              </label>
              <input
                type="text"
                name="companyName"
                value={jobData.companyName || ""}
                readOnly
                className="w-full border rounded-xl px-4 py-3 bg-gray-100 shadow-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Địa điểm
              </label>
              <input
                type="text"
                name="location"
                value={jobData.location || ""}
                readOnly
                className="w-full border rounded-xl px-4 py-3 bg-gray-100 shadow-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Loại việc & Lương */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Loại việc <span className="text-red-500">*</span>
              </label>
              <select
                name="jobType"
                value={jobData.jobType || ""}
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
                Mức lương<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="salary"
                value={jobData.salary || ""}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Thời gian tuyển dụng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" /> Ngày bắt đầu
              </label>
              <input
                type="date"
                name="startDate"
                value={jobData.startDate || ""}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" /> Ngày kết thúc<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={jobData.endDate || ""}
                onChange={handleChange}
                min={jobData.startDate}
                className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mô tả công việc<span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={jobData.description || ""}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Yêu cầu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Yêu cầu ứng viên<span className="text-red-500">*</span>
            </label>
            <textarea
              name="descriptionRequirements"
              value={jobData.descriptionRequirements || ""}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Kỹ năng */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Kỹ năng (cách nhau bằng dấu phẩy)
            </label>
            <input
              type="text"
              name="skills"
              // value={Array.isArray(jobData.skills) ? jobData.skills.join(", ") : jobData.skills || ""}
              value={jobData.skills || ""}
              onChange={handleChange}
              placeholder="VD: Java, Spring Boot, SQL"
              className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Kinh nghiệm */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Kinh nghiệm (năm)
            </label>
            <input
              type="text"
              name="experience"
              value={jobData.experience || ""}
              onChange={handleChange}
              placeholder="VD: 2 năm, 3-5 năm..."
              className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

            {/* Chứng chỉ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Chứng chỉ
              </label>
              <input
                type="text"
                name="certificates"
                value={jobData.certificates}
                onChange={handleChange}
                placeholder="VD: AWS, IELTS..."
                className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

          {/* Nghề nghiệp */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nghề nghiệp / Vị trí
            </label>
            <input
              type="text"
              name="career"
              value={jobData.career || ""}
              onChange={handleChange}
              placeholder="VD: Backend Developer"
              className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Quyền lợi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Quyền lợi<span className="text-red-500">*</span>
            </label>
            <textarea
              name="benefits"
              value={jobData.benefits || ""}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition font-medium text-sm"
            >
              <Save className="w-4 h-4" /> Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateJobModal;
