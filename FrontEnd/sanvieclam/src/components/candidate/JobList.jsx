import React, { useState } from "react";
import { Search, Flame, Briefcase, TrendingUp } from "lucide-react";

const JobList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const jobsPerPage = 3;

  const jobs = [
    {
      id: 1,
      title: "Lập trình viên Backend (Java, Spring Boot)",
      company: "Công ty ABC",
      location: "Hà Nội",
      type: "Fulltime",
      category: "Công nghệ thông tin",
      salary: "15 - 20 triệu",
    },
    {
      id: 2,
      title: "Nhân viên Part-time bán hàng",
      company: "Cửa hàng XYZ",
      location: "TP. HCM",
      type: "Parttime",
      category: "Kinh doanh",
      salary: "30k/giờ",
    },
    {
      id: 3,
      title: "Thực tập sinh Frontend ReactJS",
      company: "Startup EFG",
      location: "Đà Nẵng",
      type: "Parttime",
      category: "Công nghệ thông tin",
      salary: "Hỗ trợ 3 triệu",
    },
    {
      id: 4,
      title: "Data Engineer",
      company: "Tập đoàn DataTech",
      location: "TP. HCM",
      type: "Fulltime",
      category: "Công nghệ thông tin",
      salary: "20 - 25 triệu",
    },
    {
      id: 5,
      title: "Chuyên viên Marketing",
      company: "Công ty Quảng Cáo KLM",
      location: "Hà Nội",
      type: "Fulltime",
      category: "Marketing",
      salary: "12 - 18 triệu",
    },
    {
      id: 6,
      title: "Chuyên viên Kinh doanh Bất động sản",
      company: "Tập đoàn SunLand",
      location: "Hà Nội",
      type: "Fulltime",
      category: "Kinh doanh",
      salary: "20 - 30 triệu",
    },
  ];

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
    "Marketing": <TrendingUp size={16} className="text-green-500" />,
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
            <ul className="space-y-2 text-gray-700 text-sm">
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
                className="text-xs text-indigo-600 mt-2 underline"
              >
                Xóa lọc
              </button>
            </ul>
          </div>

          {/* Địa điểm */}
          <div>
            <h3 className="font-medium text-indigo-600 mb-2">Địa điểm</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              {["Hà Nội", "TP. HCM", "Đà Nẵng"].map((loc) => (
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
              ))}
              <button
                onClick={() => setSelectedLocation("")}
                className="text-xs text-indigo-600 mt-2 underline"
              >
                Xóa lọc
              </button>
            </ul>
          </div>

          {/* Loại hình */}
          <div>
            <h3 className="font-medium text-indigo-600 mb-2">Loại hình</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              {["Fulltime", "Parttime"].map((type) => (
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
                className="text-xs text-indigo-600 mt-2 underline"
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
                  className="bg-white rounded-xl border border-indigo-200 shadow-md p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-xl hover:scale-[1.01] transition transform"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-700">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <p className="text-sm text-gray-600">
                      📍 {job.location} | ⏰ {job.type}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      💰 {job.salary}
                    </p>
                  </div>
                  <button className="mt-3 sm:mt-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition">
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
          {/* Thông tin xem */}
          <p className="text-sm text-gray-600 mb-2 md:mb-0">
            Đang xem {startIndex + 1} - {endIndex} trên tổng {filteredJobs.length} công việc
          </p>

          {/* Nút phân trang */}
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
