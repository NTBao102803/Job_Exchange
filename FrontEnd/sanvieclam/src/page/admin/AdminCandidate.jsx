import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, User, Search } from "lucide-react";
import CandidateProfileModal from "../../components/candidate/CandidateProfileModal";
import UpdateCandidateProfileModal from "../../components/candidate/UpdateCandidateProfileModal";

const AdminCandidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [searchEmail, setSearchEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  // 👉 Modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      // Fake API data
      const data = [
        {
          id: 1,
          fullName: "Nguyễn Văn A",
          email: "vana@example.com",
          status: "Đang tìm việc",
          major: "Công nghệ thông tin",
          skills: "React, Node.js, SQL",
          experience: "2 năm",
          graduationYear: 2022,
          gpa: 3.4,
          dob: "1999-05-12",
          gender: "Nam",
          phone: "0901234567",
          address: "Hà Nội",
          school: "ĐH Bách Khoa",
          projects: "Website thương mại điện tử",
          certificates: "IELTS 6.5",
          careerGoal: "Trở thành fullstack developer",
          hobbies: "Đọc sách, chơi bóng đá",
          social: "linkedin.com/in/nguyenvana",
        },
        {
          id: 2,
          fullName: "Trần Thị B",
          email: "thib@example.com",
          status: "Đang làm việc",
          major: "Quản trị kinh doanh",
          skills: "Excel, PowerBI",
          experience: "1 năm",
          graduationYear: 2021,
          gpa: 3.6,
          dob: "2000-01-10",
          gender: "Nữ",
          phone: "0909876543",
          address: "TP.HCM",
          school: "ĐH Kinh tế",
          projects: "Quản lý bán hàng",
          certificates: "MOS Excel",
          careerGoal: "Quản lý dự án",
          hobbies: "Du lịch, nấu ăn",
          social: "facebook.com/tranthib",
        },
        {
          id: 3,
          fullName: "Trần Thị B",
          email: "thib@example.com",
          status: "Đang làm việc",
          major: "Quản trị kinh doanh",
          skills: "Excel, PowerBI",
          experience: "1 năm",
          graduationYear: 2021,
          gpa: 3.6,
          dob: "2000-01-10",
          gender: "Nữ",
          phone: "0909876543",
          address: "TP.HCM",
          school: "ĐH Kinh tế",
          projects: "Quản lý bán hàng",
          certificates: "MOS Excel",
          careerGoal: "Quản lý dự án",
          hobbies: "Du lịch, nấu ăn",
          social: "facebook.com/tranthib",
        },
        {
          id: 4,
          fullName: "Trần Thị B",
          email: "thib@example.com",
          status: "Đang làm việc",
          major: "Quản trị kinh doanh",
          skills: "Excel, PowerBI",
          experience: "1 năm",
          graduationYear: 2021,
          gpa: 3.6,
          dob: "2000-01-10",
          gender: "Nữ",
          phone: "0909876543",
          address: "TP.HCM",
          school: "ĐH Kinh tế",
          projects: "Quản lý bán hàng",
          certificates: "MOS Excel",
          careerGoal: "Quản lý dự án",
          hobbies: "Du lịch, nấu ăn",
          social: "facebook.com/tranthib",
        },
        {
          id: 5,
          fullName: "Trần Thị B",
          email: "thib@example.com",
          status: "Đang làm việc",
          major: "Quản trị kinh doanh",
          skills: "Excel, PowerBI",
          experience: "1 năm",
          graduationYear: 2021,
          gpa: 3.6,
          dob: "2000-01-10",
          gender: "Nữ",
          phone: "0909876543",
          address: "TP.HCM",
          school: "ĐH Kinh tế",
          projects: "Quản lý bán hàng",
          certificates: "MOS Excel",
          careerGoal: "Quản lý dự án",
          hobbies: "Du lịch, nấu ăn",
          social: "facebook.com/tranthib",
        },
      ];
      setCandidates(data);
    };
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((c) => {
    const matchEmail = c.email.toLowerCase().includes(searchEmail.toLowerCase());
    const matchStatus = filterStatus === "Tất cả" ? true : c.status === filterStatus;
    return matchEmail && matchStatus;
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

  // 👉 Mở modal xem hồ sơ
  const handleView = (candidate) => {
    setSelectedCandidate(candidate);
    setIsViewModalOpen(true);
  };

  // 👉 Mở modal chỉnh sửa
  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate);
    setIsEditModalOpen(true);
  };

  // 👉 Cập nhật candidate trong state sau khi sửa
  const handleUpdateCandidate = (updatedCandidate) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === updatedCandidate.id ? updatedCandidate : c))
    );
    setIsEditModalOpen(false);
  };

  return (
    <div className="p-1">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản lý ứng viên</h1>

      {/* Thanh tìm kiếm và lọc */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center mt-10">
        <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-full sm:w-1/2">
          <Search className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo email..."
            value={searchEmail}
            onChange={(e) => {
              setSearchEmail(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 outline-none text-gray-700"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 rounded-lg shadow bg-white text-gray-700 border w-full sm:w-1/3"
        >
          <option value="Tất cả">Tất cả</option>
          <option value="Đang tìm việc">Đang tìm việc</option>
          <option value="Đang làm việc">Đang làm việc</option>
        </select>
      </div>

      {/* Bảng ứng viên */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 p-6 rounded-2xl shadow-lg mt-10">
        <table className="w-full text-left border-collapse rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-white/20 text-white uppercase text-sm tracking-wider">
              <th className="p-4">ID</th>
              <th className="p-4">Ứng viên</th>
              <th className="p-4">Thông tin</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentCandidates.map((c) => (
              <tr key={c.id} className="bg-white/10 backdrop-blur-xl hover:bg-white/20 transition border-b border-white/30">
                <td className="p-4 font-semibold text-white">{c.id}</td>
                <td className="p-4 flex items-center gap-3 text-white">
                  <div className="bg-white/30 w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-bold">{c.fullName}</p>
                    <p className="text-xs opacity-80">{c.email}</p>
                  </div>
                </td>
                <td className="p-4 text-sm text-white space-y-1 max-w-[250px]">
                  <p className="truncate"><span className="font-semibold">Ngành: </span>{c.major}</p>
                  <p className="truncate"><span className="font-semibold">Kỹ năng: </span>{c.skills}</p>
                  <p className="truncate"><span className="font-semibold">Tốt nghiệp: </span>{c.graduationYear} ({c.gpa})</p>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.status === "Đang tìm việc" ? "bg-yellow-400 text-gray-900" : "bg-green-500 text-white"}`}>{c.status}</span>
                </td>
                <td className="p-4 text-center space-x-2">
                  <button onClick={() => handleView(c)} className="p-2 bg-white/30 rounded-lg hover:bg-white/40 text-white transition">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleEdit(c)} className="p-2 bg-yellow-400 rounded-lg hover:bg-yellow-300 text-gray-900 transition">
                    <Edit size={18} />
                  </button>
                  <button className="p-2 bg-red-500 rounded-lg hover:bg-red-400 text-white transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-white">
          <span className="text-sm mb-2 sm:mb-0">
            Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCandidates.length)} trong {filteredCandidates.length} ứng viên
          </span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-white/30 rounded-lg hover:bg-white/40 disabled:opacity-40">Trước</button>
            <span className="px-3 py-1 bg-white/20 rounded-lg">{currentPage} / {totalPages || 1}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 bg-white/30 rounded-lg hover:bg-white/40 disabled:opacity-40">Sau</button>
          </div>
        </div>
      </div>

      {/* Modal xem hồ sơ */}
      <CandidateProfileModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        candidate={selectedCandidate}
      />

      {/* Modal chỉnh sửa hồ sơ */}
      <UpdateCandidateProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        candidate={selectedCandidate}
        onUpdate={handleUpdateCandidate}
      />
    </div>
  );
};

export default AdminCandidate;
