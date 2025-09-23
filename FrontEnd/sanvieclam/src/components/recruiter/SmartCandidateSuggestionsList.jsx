import React, { useState } from "react";
import { Search ,Briefcase} from "lucide-react";
import CandidateProfileModal from "../candidate/CandidateProfileModal";

const jobs = [
  { id: 1, title: "AI Engineer" },
  { id: 2, title: "Data Scientist" },
  { id: 3, title: "Cloud Architect" },
];

const smartCandidates = [
  {
    id: 1,
    jobId:1,
    fullName: "Nguyễn Văn A",
    dob: "01/01/1998",
    gender: "Nam",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    address: "Hà Nội",
    school: "ĐH Bách Khoa Hà Nội",
    major: "Khoa học máy tính",
    gpa: "3.5/4",
    graduationYear: "2020",
    experience: "2 năm làm AI Engineer",
    projects: "Phát triển hệ thống nhận diện khuôn mặt",
    skills: "Python, TensorFlow, ML",
    certificates: "Chứng chỉ TensorFlow Developer",
    careerGoal: "Trở thành chuyên gia AI",
    hobbies: "Đọc sách, chơi cờ vua",
    social: "linkedin.com/in/nguyenvana",
    match: "95%",
  },
  {
    id: 2,
    jobId:1,
    fullName: "Trần Thị B",
    dob: "15/03/1997",
    gender: "Nữ",
    email: "tranthib@example.com",
    phone: "0912345678",
    address: "TP. HCM",
    school: "ĐH Khoa học Tự nhiên",
    major: "Toán tin",
    gpa: "3.7/4",
    graduationYear: "2019",
    experience: "3 năm làm Data Scientist",
    projects: "Phân tích dữ liệu tài chính",
    skills: "Python, R, SQL",
    certificates: "Chứng chỉ Data Science IBM",
    careerGoal: "Làm chuyên gia Data Scientist",
    hobbies: "Du lịch, nghe nhạc",
    social: "linkedin.com/in/tranthib",
    match: "90%",
  },
  {
    id: 3,
    jobId:1,
    fullName: "Lê Văn C",
    dob: "22/06/1996",
    gender: "Nam",
    email: "levanc@example.com",
    phone: "0923456789",
    address: "Đà Nẵng",
    school: "ĐH FPT",
    major: "Cloud Computing",
    gpa: "3.4/4",
    graduationYear: "2018",
    experience: "4 năm làm Cloud Architect",
    projects: "Triển khai hệ thống AWS cho doanh nghiệp",
    skills: "AWS, Kubernetes, Terraform,AWS, Kubernetes, Terraform,AWS, Kubernetes, Terraform",
    certificates: "AWS Solution Architect",
    careerGoal: "Kiến trúc sư Cloud hàng đầu",
    hobbies: "Chạy bộ, bóng đá",
    social: "linkedin.com/in/levanc",
    match: "88%",
  },
  {
    id: 4,
    jobId:1,
    fullName: "Lê Văn C",
    dob: "22/06/1996",
    gender: "Nam",
    email: "levanc@example.com",
    phone: "0923456789",
    address: "Đà Nẵng",
    school: "ĐH FPT",
    major: "Cloud Computing",
    gpa: "3.4/4",
    graduationYear: "2018",
    experience: "4 năm làm Cloud Architect",
    projects: "Triển khai hệ thống AWS cho doanh nghiệp",
    skills: "AWS, Kubernetes, Terraform",
    certificates: "AWS Solution Architect",
    careerGoal: "Kiến trúc sư Cloud hàng đầu",
    hobbies: "Chạy bộ, bóng đá",
    social: "linkedin.com/in/levanc",
    match: "88%",
  },
  {
    id: 5,
    jobId:2,
    fullName: "Lê Văn C",
    dob: "22/06/1996",
    gender: "Nam",
    email: "levanc@example.com",
    phone: "0923456789",
    address: "Đà Nẵng",
    school: "ĐH FPT",
    major: "Cloud Computing",
    gpa: "3.4/4",
    graduationYear: "2018",
    experience: "4 năm làm Cloud Architect",
    projects: "Triển khai hệ thống AWS cho doanh nghiệp",
    skills: "AWS, Kubernetes, Terraform",
    certificates: "AWS Solution Architect",
    careerGoal: "Kiến trúc sư Cloud hàng đầu",
    hobbies: "Chạy bộ, bóng đá",
    social: "linkedin.com/in/levanc",
    match: "88%",
  },
];

const SmartCandidateSuggestionsList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [selectedJob, setSelectedJob] = useState(jobs[0].id);
   // Lọc ứng viên theo job đã chọn
  const filteredCandidates = smartCandidates.filter(
    (candidate) => candidate.jobId === selectedJob
  );


  const candidatesPerPage = 4;


  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  const startIndex = (page - 1) * candidatesPerPage;
  const endIndex = Math.min(startIndex + candidatesPerPage, filteredCandidates.length);
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 pt-32 pb-32 px-6 relative text-white">
  <div className="max-w-6xl mx-auto space-y-6">
    {/* Select chọn job */}
        <div className="relative">
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(Number(e.target.value))}
            className="w-full rounded-lg border border-white/30 bg-white/20 text-white px-5 py-3 shadow-md 
                       focus:ring-2 focus:ring-yellow-300 focus:outline-none appearance-none"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id} className="text-black">
                {job.title}
              </option>
            ))}
          </select>
          <Briefcase className="absolute right-4 top-3.5 text-yellow-300" size={20} />
        </div>
    {/* Danh sách ứng viên */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {currentCandidates.length > 0 ? (
    currentCandidates.map((candidate) => (
      <div
        key={candidate.id}
        className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-md p-6 
                   flex justify-between items-center 
                   hover:shadow-[0_0_25px_rgba(255,255,255,0.7)] hover:scale-[1.02] 
                   transition transform"
      >
        {/* Thông tin ứng viên */}
        <div className="flex-1 pr-4">
          <h3 className="text-xl md:text-2xl font-bold mb-2 text-yellow-300">
            {candidate.fullName}
          </h3>
          <span className="text-base opacity-90">{candidate.major}</span>
          <div className="mt-2 text-sm md:text-base space-y-1">
            <div className="truncate max-w-[220px]">
              <span className="font-semibold">Kỹ năng: </span>
              {candidate.skills}
            </div>
            <div className="truncate max-w-[220px]">
              <span className="font-semibold">Kinh nghiệm: </span>
              {candidate.experience}
            </div>
            <div className="truncate max-w-[220px]">
              <span className="font-semibold">Tốt nghiệp: </span>
              {candidate.graduationYear} ({candidate.gpa})
            </div>
            <div className="truncate max-w-[220px]">
              <span className="font-semibold">Phù hợp: </span>
              <span className="text-green-300 font-bold">{candidate.match}</span>
            </div>
          </div>

        </div>

        {/* Button xem hồ sơ */}
        <div className="flex-shrink-0">
          <button
            onClick={() => {
              setSelectedCandidate(candidate);
              setIsModalOpen(true);
            }}
            className="bg-yellow-400 text-gray-900 font-bold px-5 py-2.5 rounded-lg shadow-md 
                       hover:bg-yellow-300 transition text-sm md:text-base"
          >
            Xem hồ sơ
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="italic text-white/80 col-span-2 text-lg">
      Không tìm thấy ứng viên phù hợp.
    </p>
  )}
</div>

  </div>

  {/* Pagination */}
  <div className="sticky bottom-0 left-0 w-full bg-white/10 backdrop-blur-xl border-t border-white/20 py-3 mt-6 shadow-inner">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-white">
      <p className="text-sm mb-2 md:mb-0">
        Đang xem {startIndex + 1} - {endIndex} trên tổng {filteredCandidates.length} ứng viên
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

  {/* Modal hồ sơ */}
  <CandidateProfileModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    candidate={selectedCandidate}
  />
</div>

  );
};

export default SmartCandidateSuggestionsList;
