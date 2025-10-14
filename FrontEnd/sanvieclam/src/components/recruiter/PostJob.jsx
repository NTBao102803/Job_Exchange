import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Calendar, Eye ,AlertTriangle,Loader2} from "lucide-react";
import JobPreviewModal from "./JobPreviewModal";
import { createJob, getEmployerProfile } from "../../api/RecruiterApi";
import axios from "axios";
import {getAllPenDingJobs,getAllPublicJobs }  from "../../api/JobApi";

const PostJob = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    salary: "",
    description: "",
    requirements: "", // mô tả yêu cầu → map với descriptionRequirements
    benefits: "",
    startDate: today,
    endDate: "",
    skills: "",
    experience: "",
    certificates: "", // đổi education -> certificates
    career: "",
  });

  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  // 👉 Lấy thông tin employer từ backend
  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        const employer = await getEmployerProfile();
        setJobData((prev) => ({
          ...prev,
          company: employer.companyName,
          location: employer.companyAddress,
        }));
      } catch (error) {
        console.error("❌ Lỗi khi lấy employer:", error);
        alert("Không thể tải thông tin công ty. Vui lòng thử lại!");
      }
    };
    fetchEmployer();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });

    // reset lỗi khi user nhập lại
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};

    if (!jobData.title || jobData.title.trim().length < 5) {
      newErrors.title = "⛔ Tiêu đề công việc phải có ít nhất 5 ký tự!";
    }
    if (!jobData.company) {
      newErrors.company = "⛔ Vui lòng nhập tên công ty!";
    }
    if (!jobData.location) {
      newErrors.location = "⛔ Vui lòng nhập địa điểm làm việc!";
    }
    if (!jobData.jobType) {
      newErrors.jobType = "⛔ Vui lòng chọn loại việc!";
    }
    if (!jobData.salary || jobData.salary.trim().length < 3) {
      newErrors.salary = "⛔ Vui lòng nhập mức lương (VD: 15 - 20 triệu)!";
    }
    if (!jobData.description || jobData.description.trim().length < 20) {
      newErrors.description = "⛔ Mô tả công việc phải có ít nhất 20 ký tự!";
    }
    if (!jobData.requirements || jobData.requirements.trim().length < 20) {
      newErrors.requirements = "⛔ Yêu cầu ứng viên phải có ít nhất 15 ký tự!";
    }
    if (!jobData.benefits || jobData.benefits.trim().length < 20) {
      newErrors.benefits = "⛔ Quyền lợi phải có ít nhất 10 ký tự!";
    }
    if (!jobData.startDate) {
      newErrors.startDate = "⛔ Vui lòng chọn ngày bắt đầu!";
    }
    if (!jobData.endDate) {
      newErrors.endDate = "⛔ Vui lòng chọn ngày kết thúc!";
    } else if (jobData.endDate < jobData.startDate) {
      newErrors.endDate = "⛔ Ngày kết thúc phải sau hoặc bằng ngày bắt đầu!";
    }
    if (!jobData.skills || jobData.skills.trim().length < 2) {
      newErrors.skills = "⛔ Vui lòng nhập ít nhất 1 kỹ năng!";
    }
    if (!jobData.experience || jobData.experience <= 0) {
      newErrors.experience = "⛔ Vui lòng nhập số năm kinh nghiệm hợp lệ!";
    }
    if (!jobData.career || jobData.career.trim().length < 2) {
      newErrors.career = "⛔ Vui lòng nhập nghề nghiệp/vị trí!";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return; // Nếu có lỗi thì không submit
    }

    try {
      const payload = {
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
          descriptionRequirements: jobData.requirements,
        },
      };

      const response = await createJob(payload);
      alert("✅ Tin tuyển dụng đã được gửi và đang chờ kiểm duyệt!");
      console.log("📥 Phản hồi từ server:", response);
      navigate("/recruiter/dashboard-recruiterjobposts");
    } catch (error) {
      console.error("❌ Lỗi khi tạo tin:", error);
      alert(error.response?.data?.message || "🚨 Đăng tin thất bại!");
    }
  };
  const [currentPlan, setCurrentPlan] = useState("");
  const [totalJobs, setTotalJobs] = useState(null);
  useEffect(() => {

    const fetchCurrentPlan = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    const res = await axios.get(`http://localhost:8080/api/payment-plans/current/${user.id}`);
    setCurrentPlan(res.data?.planName || "");
  } catch (err) {
    console.warn("Không có gói hiện tại hoặc lỗi khi lấy gói hiện tại:", err);
  }
};
const fetchJobCounts = async () => {
      setIsLoading(true);
      setError(null);
      let pendingCount = 0;
      let publicCount = 0;

      try {
        // Sử dụng Promise.all để gọi song song cả hai API, giúp giảm thời gian tải
        const [pendingJobs, publicJobs] = await Promise.all([
            // Tạm thời gọi các hàm mock đã định nghĩa ở trên
            getAllPenDingJobs("PENDING"), 
            getAllPenDingJobs("APPROVED")
        ]);

        // 1. Tính số lượng công việc đang chờ
        // Đảm bảo dữ liệu trả về là mảng trước khi lấy length
        pendingCount = Array.isArray(pendingJobs) ? pendingJobs.length : 0;
        console.log(`Số lượng công việc đang chờ: ${pendingCount}`);

        // 2. Tính số lượng công việc đã công khai
        publicCount = Array.isArray(publicJobs) ? publicJobs.length : 0;
        console.log(`Số lượng công việc đã công khai: ${publicCount}`);

        // 3. Calculate Total
        const total = pendingCount + publicCount;
        setTotalJobs(total);

      } catch (err) {
        // Ghi lại lỗi chi tiết và hiển thị thông báo chung cho người dùng
        console.error("Lỗi khi tải dữ liệu công việc từ API:", err);
        setError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối API.");
        setTotalJobs(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentPlan();
    fetchJobCounts();
  }, []);




  if (!currentPlan) {
    return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen pt-28 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-2xl rounded-2xl p-10 border border-gray-100">
                    <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
                        ✨ Đăng tin tuyển dụng
                    </h1>
                    <div className="text-center p-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl shadow-inner space-y-4">
                        <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto" />
                        <h2 className="text-2xl font-bold text-gray-800">
                            Chức năng bị khóa
                        </h2>
                        <p className="text-lg text-gray-600">
                            Vui lòng **đăng ký gói dịch vụ** để sử dụng chức năng đăng tin tuyển dụng.
                        </p>
                        <button
                            onClick={() => navigate("/recruiter/serviceplans")}
                            className="mt-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition transform hover:scale-105 flex items-center gap-2 mx-auto"
                        >
                            Đăng ký dịch vụ ngay!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }
  if (currentPlan==="Gói Nâng Cao" && totalJobs===10) {
    return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen pt-28 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-2xl rounded-2xl p-10 border border-gray-100">
                    <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
                        ✨ Đăng tin tuyển dụng
                    </h1>
                    <div className="text-center p-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl shadow-inner space-y-4">
                        <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto" />
                        <h2 className="text-2xl font-bold text-gray-800">
                            Chức năng bị khóa vì bạn đang sử dụng gói dịch vụ Nâng Cao nên chỉ được đăng tối đa 10 tin tuyển dụng/tháng.
                        </h2>
                        <p className="text-lg text-gray-600">
                            Vui lòng **nâng cấp gói dịch vụ** để đăng thêm tin tuyển dụng.
                        </p>
                        <button
                            onClick={() => navigate("/recruiter/serviceplans")}
                            className="mt-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition transform hover:scale-105 flex items-center gap-2 mx-auto"
                        >
                            Nâng cấp dịch vụ ngay!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }
  if (currentPlan==="Gói Cơ Bản" && totalJobs===3) {
    return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen pt-28 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-2xl rounded-2xl p-10 border border-gray-100">
                    <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
                        ✨ Đăng tin tuyển dụng
                    </h1>
                    <div className="text-center p-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl shadow-inner space-y-4">
                        <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto" />
                        <h2 className="text-2xl font-bold text-gray-800">
                            Chức năng bị khóa vì bạn đang sử dụng gói dịch vụ Cơ Bản nên chỉ được đăng tối đa 3 tin tuyển dụng/tháng.
                        </h2>
                        <p className="text-lg text-gray-600">
                            Vui lòng **nâng cấp gói dịch vụ** để đăng thêm tin tuyển dụng.
                        </p>
                        <button
                            onClick={() => navigate("/recruiter/serviceplans")}
                            className="mt-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition transform hover:scale-105 flex items-center gap-2 mx-auto"
                        >
                            Nâng cấp dịch vụ ngay!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }

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
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Công ty & Địa điểm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Công ty
                </label>
                <input
                  type="text"
                  name="company"
                  value={jobData.company}
                  readOnly
                  className="w-full border rounded-xl px-4 py-3 bg-gray-100 shadow-sm cursor-not-allowed"
                />
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Địa điểm
                </label>
                <input
                  type="text"
                  name="location"
                  value={jobData.location}
                  readOnly
                  className="w-full border rounded-xl px-4 py-3 bg-gray-100 shadow-sm cursor-not-allowed"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>
            </div>

            {/* Loại việc & Lương */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Loại việc <span className="text-red-500">*</span>
                </label>
                <select
                  name="jobType"
                  value={jobData.jobType}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">-- Chọn loại việc --</option>
                  <option value="Fulltime">Fulltime</option>
                  <option value="Parttime">Parttime</option>
                  <option value="Internship">Internship</option>
                </select>
                {errors.jobType && (
                  <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mức lương<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="salary"
                  value={jobData.salary}
                  onChange={handleChange}
                  placeholder="VD: 15 - 20 triệu"
                  className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {errors.salary && (
                  <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
                )}
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
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate}
                  </p>
                )}
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
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mô tả công việc<span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Nhập mô tả công việc..."
                className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Yêu cầu */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Yêu cầu ứng viên<span className="text-red-500">*</span>
              </label>
              <textarea
                name="requirements"
                value={jobData.requirements}
                onChange={handleChange}
                rows="3"
                placeholder="Nhập yêu cầu ứng viên..."
                className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.requirements && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.requirements}
                </p>
              )}
            </div>
            {/* Kỹ năng */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Kỹ năng (cách nhau bằng dấu phẩy)
              </label>
              <input
                type="text"
                name="skills"
                value={jobData.skills}
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
                value={jobData.experience}
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
                value={jobData.career}
                onChange={handleChange}
                placeholder="VD: Backend Developer"
                className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Quyền lợi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Quyền lợi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="benefits"
                value={jobData.benefits}
                onChange={handleChange}
                rows="3"
                placeholder="Nhập quyền lợi..."
                className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.benefits && (
                <p className="text-red-500 text-sm mt-1">{errors.benefits}</p>
              )}
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
            <JobPreviewModal
              job={jobData}
              onClose={() => setShowPreview(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostJob;