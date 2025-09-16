import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const smartJobs = [
  {
    id: 1,
    title: "AI Engineer",
    company: "FutureAI Labs",
    location: "Hà Nội",
    type: "Fulltime",
    salary: "25 - 35 triệu",
    skills: "Python, TensorFlow, ML",
    match: "95%",
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "Insight Global",
    location: "TP. HCM",
    type: "Fulltime",
    salary: "22 - 30 triệu",
    skills: "R, Python, SQL",
    match: "90%",
  },
  {
    id: 3,
    title: "Cloud Architect",
    company: "SkyNet Cloud",
    location: "Đà Nẵng",
    type: "Fulltime",
    salary: "30 - 40 triệu",
    skills: "AWS, Kubernetes, Terraform",
    match: "88%",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "NextVision",
    location: "Hà Nội",
    type: "Fulltime",
    salary: "20 - 28 triệu",
    skills: "Agile, Jira, Leadership",
    match: "85%",
  },
  {
    id: 5,
    title: "UX Designer",
    company: "DesignPro",
    location: "TP. HCM",
    type: "Fulltime",
    salary: "18 - 25 triệu",
    skills: "Figma, UI/UX, Prototype",
    match: "82%",
  },
];

const SmartJobSuggestionsList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const jobsPerPage = 3;

  const filteredJobs = smartJobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (page - 1) * jobsPerPage;
  const endIndex = Math.min(startIndex + jobsPerPage, filteredJobs.length);
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 pt-32 pb-32 px-6 relative text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm việc làm nổi bật..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full rounded-full border border-white/30 bg-white/20 text-white px-5 py-3 shadow-md 
                       placeholder-white/70 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
          <Search className="absolute right-4 top-3.5 text-yellow-300" size={20} />
        </div>

        {/* Danh sách job */}
        <div className="space-y-4">
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-md p-4 
                           flex flex-col sm:flex-row justify-between items-start sm:items-center 
                           hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:scale-[1.01] 
                           transition transform"
              >
                <div>
                  <h3
                    className="text-lg font-semibold text-yellow-300 cursor-pointer"
                    onClick={() => navigate(`/candidate/jobs/${job.id}`, { state: { job } })}
                  >
                    {job.title}
                  </h3>
                  <p className="text-sm opacity-90">{job.company}</p>
                  <p className="text-sm opacity-90">
                    📍 {job.location} | ⏰ {job.type}
                  </p>
                  <p className="text-sm text-green-300 font-medium">💰 {job.salary}</p>
                  <p className="text-xs mt-1">
                    <span className="font-semibold">Kỹ năng:</span> {job.skills}
                  </p>
                  <p className="text-xs">
                    <span className="font-semibold">Phù hợp:</span>{" "}
                    <span className="text-green-400 font-bold">{job.match}</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/candidate/jobs/${job.id}`, { state: { job } })}
                  className="mt-3 sm:mt-0 bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg shadow-md 
                             hover:bg-yellow-300 transition"
                >
                  Xem chi tiết
                </button>
              </div>
            ))
          ) : (
            <p className="italic text-white/80">Không tìm thấy công việc phù hợp.</p>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="sticky bottom-0 left-0 w-full bg-white/10 backdrop-blur-xl border-t border-white/20 py-3 mt-6 shadow-inner">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-white">
          <p className="text-sm mb-2 md:mb-0">
            Đang xem {startIndex + 1} - {endIndex} trên tổng {filteredJobs.length} công việc
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded-lg ${
                page === 1
                  ? "bg-white/20 text-white/50 cursor-not-allowed"
                  : "bg-white/20 text-white hover:bg-white/30"
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
                    ? "bg-yellow-400 text-gray-900 font-bold shadow-md"
                    : "bg-white/20 text-white hover:bg-white/30"
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
                  ? "bg-white/20 text-white/50 cursor-not-allowed"
                  : "bg-white/20 text-white hover:bg-white/30"
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

export default SmartJobSuggestionsList;
