import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, User, Search, Lock, Unlock } from "lucide-react";
import CandidateProfileModal from "../../components/candidate/CandidateProfileModal";
const AdminCandidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [searchEmail, setSearchEmail] = useState("");

  // 👉 Modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [candidateToToggle, setCandidateToToggle] = useState(null);


  useEffect(() => {
    const fetchCandidates = async () => {
      // Fake API data
      const data = [
        {
          id: 1,
          fullName: "Nguyễn Văn A",
          email: "vana@example.com",
          status: "Tạm thời vô hiệu hoá",
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
          status: "Đang hoạt động",
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
          status: "Tạm thời vô hiệu hoá",
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
          status: "Tạm thời vô hiệu hoá",
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
          status: "Đang hoạt động",
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
    return matchEmail ;
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

  // Mở modal xác nhận thay đổi trạng thái
  const handleStatusClick = (candidate) => {
    setCandidateToToggle(candidate);
    setIsConfirmModalOpen(true);
  };

  const confirmToggleStatus = () => {
    if (candidateToToggle) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateToToggle.id
            ? {
                ...c,
                status:
                  c.status === "Đang hoạt động"
                    ? "Tạm thời vô hiệu hóa"
                    : "Đang hoạt động",
              }
            : c
        )
      );
      setCandidateToToggle(null);
      setIsConfirmModalOpen(false);
    }
  };

  const cancelToggleStatus = () => {
    setCandidateToToggle(null);
    setIsConfirmModalOpen(false);
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

      </div>

      {/* Bảng ứng viên */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 p-6 rounded-2xl shadow-lg mt-10">
        <table className="w-full text-left border-collapse rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-white/20 text-white uppercase text-sm tracking-wider">
              <th className="p-4">ID</th>
              <th className="p-4">Ứng viên</th>
              <th className="p-4">Thông tin</th>
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
                <td className="p-4 text-center space-x-2">
                  <button onClick={() => handleView(c)} className="p-2 bg-white/30 rounded-lg hover:bg-white/40 text-white transition">
                    <Eye size={18} />
                  </button>
                  <button className="p-2 bg-red-500 rounded-lg hover:bg-red-400 text-white transition">
                    <Trash2 size={18} />
                  </button>
                  {/* Nút thay đổi trạng thái */}
                  <button
                    onClick={() => handleStatusClick(c)}
                    className={`p-2 rounded-lg transition ${
                      c.status === "Đang hoạt động"
                        ? "bg-green-500 hover:bg-green-400 text-white"
                        : "bg-red-500 hover:bg-red-400 text-white"
                    }`}
                  >
                    {c.status === "Đang hoạt động" ? <Unlock size={18} /> : <Lock size={18} />}
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
      {/* Modal xác nhận thay đổi trạng thái */}
      {isConfirmModalOpen && candidateToToggle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <h2 className="text-lg font-bold mb-4">
              {candidateToToggle.status === "Đang hoạt động" ? "Vô hiệu hóa tài khoản" : "Kích hoạt tài khoản"}
            </h2>
            <p className="mb-6">
              {candidateToToggle.status === "Đang hoạt động"
                ? `Bạn có muốn vô hiệu hóa tài khoản của ${candidateToToggle.fullName}?`
                : `Bạn có muốn kích hoạt lại tài khoản của ${candidateToToggle.fullName}?`}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmToggleStatus}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
              >
                Đồng ý
              </button>
              <button
                onClick={cancelToggleStatus}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-200"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default AdminCandidate;
