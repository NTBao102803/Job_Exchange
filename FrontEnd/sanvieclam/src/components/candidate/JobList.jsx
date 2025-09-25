import React, { useState, useEffect } from "react";
import { Search, Flame, Briefcase, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllPublicJobs, getEmployerById } from "../../api/JobApi";

const JobList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [jobs, setJobs] = useState([]);
  const jobsPerPage = 3;

  // ✅ Lấy job từ API thay vì hardcode
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobList = await getAllPublicJobs();
        console.log("JobList từ API:", jobList);
        const jobsWithEmployer = await Promise.all(
          jobList.map(async (job) => {
            try {
              const employer = await getEmployerById(job.employerId);
              console.log("Employer:", employer);
              return {
                ...job,
                companyName: employer.companyName,
                location: job.location,
              };
            } catch (error) {
              console.error("❌ Lỗi khi lấy employer:", error);
              return job;
            }
          })
        );

        setJobs(jobsWithEmployer);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách job:", error);
      }
    };

    fetchJobs();
  }, []);

  // ✅ Lọc job
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory ? job.category === selectedCategory : true) &&
      (selectedLocation ? job.location === selectedLocation : true) &&
      (selectedType ? job.type === selectedType : true)
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (page - 1) * jobsPerPage;
  const endIndex = Math.min(startIndex + jobsPerPage, filteredJobs.length);
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // icon mapping cho ngành nghề hot
  const categoryIcons = {
    "Công nghệ thông tin": <Flame size={16} className="text-red-500" />,
    "Kinh doanh": <Briefcase size={16} className="text-blue-500" />,
    Marketing: <TrendingUp size={16} className="text-green-500" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-32 pb-32 px-6 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar filter */}
        <div className="md:col-span-1 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-lg rounded-xl p-5 space-y-6 border border-indigo-200 h-fit sticky top-32">
          <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
            Bộ lọc
          </h2>

          {/* Ngành nghề HOT */}
          <div>
            <h3 className="font-medium text-red-600 mb-3 flex items-center gap-2">
              <Flame className="text-red-500" size={18} /> Ngành nghề HOT
            </h3>
            <ul className="space-y-2 text-gray-700 text-x">
              {["Công nghệ thông tin", "Kinh doanh", "Marketing"].map((cat) => (
                <li
                  key={cat}
                  className={`p-2 rounded-lg cursor-pointer flex items-center gap-2 transition ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-red-100 to-pink-100 font-semibold border border-red-300"
                      : "hover:bg-red-50"
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                >
                  {categoryIcons[cat]}
                  {cat}
                </li>
              ))}
              <button
                onClick={() => setSelectedCategory("")}
                className="text-x text-indigo-600 mt-2 underline"
              >
                Xóa lọc
              </button>
            </ul>
          </div>

          {/* Địa điểm */}
          <div>
            <h3 className="font-medium text-indigo-600 mb-2">Địa điểm</h3>
            <ul className="space-y-2 text-gray-700 text-x">
              {Array.from(new Set(jobs.map((job) => job.location))).map(
                (loc) => (
                  <li key={loc}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={selectedLocation === loc}
                        onChange={() => {
                          setSelectedLocation(loc);
                          setPage(1);
                        }}
                      />
                      {loc}
                    </label>
                  </li>
                )
              )}
              <button
                onClick={() => setSelectedLocation("")}
                className="text-x text-indigo-600 mt-2 underline"
              >
                Xóa lọc
              </button>
            </ul>
          </div>

          {/* Loại hình */}
          <div>
            <h3 className="font-medium text-indigo-600 mb-2">Loại hình</h3>
            <ul className="space-y-2 text-gray-700 text-x">
              {["Fulltime", "Parttime", "Internship"].map((type) => (
                <li key={type}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectedType === type}
                      onChange={() => {
                        setSelectedType(type);
                        setPage(1);
                      }}
                    />
                    {type}
                  </label>
                </li>
              ))}
              <button
                onClick={() => setSelectedType("")}
                className="text-x text-indigo-600 mt-2 underline"
              >
                Xóa lọc
              </button>
            </ul>
          </div>
        </div>

        {/* Job list */}
        <div className="md:col-span-3 space-y-6">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm công việc..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-full rounded-full border border-indigo-200 px-5 py-3 shadow-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            <Search
              className="absolute right-4 top-3.5 text-indigo-400"
              size={20}
            />
          </div>
          {/* Danh sách job */}
          <div className="space-y-4">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl border border-indigo-200 shadow-md p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-xl hover:scale-[1.01] transition transform"
                >
                  {/* Thông tin bên trái */}
                  <div className="max-w-xl">
                    <h3
                      className="text-lg font-semibold text-indigo-700 truncate cursor-pointer"
                      onClick={() =>
                        navigate(`/candidate/jobs/${job.id}`, {
                          state: { job },
                        })
                      }
                      title={job.title}
                    >
                      {job.title}
                    </h3>
                    <p
                      className="text-x text-gray-600 truncate"
                      title={job.companyName}
                    >
                      {job.companyName}
                    </p>
                    <p className="text-x text-gray-600">
                      📍 {job.location} | ⏰ {job.jobType}
                    </p>
                    <p className="text-x text-green-600 font-medium">
                      💰 {job.salary}
                    </p>
                    {job.requirements && (
                      <div className="text-x text-gray-700 truncate">
                        {/* Mô tả yêu cầu chính */}
                        {/* Kỹ năng */}
                        {job.requirements.skills && (
                          <p title={job.requirements.skills}>
                            🛠 {job.requirements.skills}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Nút ứng tuyển */}
                  <button
                    onClick={() =>
                      navigate(`/candidate/jobs/${job.id}`, { state: { job } })
                    }
                    className="mt-3 sm:mt-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition"
                  >
                    Ứng tuyển
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600 italic">
                Không tìm thấy công việc phù hợp.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3 mt-6 shadow-inner">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-600 mb-2 md:mb-0">
            Đang xem {startIndex + 1} - {endIndex} trên tổng{" "}
            {filteredJobs.length} công việc
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded-lg ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Trước
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  page === i + 1
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-lg ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
