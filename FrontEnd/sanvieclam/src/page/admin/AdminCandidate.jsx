import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, User, Search, Lock, Unlock } from "lucide-react";
import CandidateProfileModal from "../../components/candidate/CandidateProfileModal";
import { getCandidates } from "../../api/CandidateApi";
import { lockUser, unlockUser, getAllUser } from "../../api/AuthApi";

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
    const fetchData = async () => {
      try {
        const [candidateData, userData] = await Promise.all([
          getCandidates(),
          getAllUser(),
        ]);

        console.log("📦 Candidate data:", candidateData);
        console.log("📦 User data:", userData);

        // Gộp dữ liệu dựa theo email (hoặc id nếu trùng)
        const mergedData = candidateData.map((c) => {
          const matchedUser = userData.find((u) => u.email === c.email);
          return {
            ...c,
            isActive: matchedUser ? matchedUser.isActive : true,
            status: matchedUser?.isActive
              ? "Đang hoạt động"
              : "Tạm thời vô hiệu hóa",
          };
        });

        setCandidates(mergedData);
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const filteredCandidates = candidates.filter((c) => {
    const matchEmail = c.email
      .toLowerCase()
      .includes(searchEmail.toLowerCase());
    return matchEmail;
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Mở modal xác nhận thay đổi trạng thái
  const handleActiveClick = (candidate) => {
    setCandidateToToggle(candidate);
    setIsConfirmModalOpen(true);
  };
  // Hàm mở modal xem hồ sơ
  const handleView = (candidate) => {
    setSelectedCandidate(candidate);
    setIsViewModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!candidateToToggle) return;

    try {
      let updatedUser;

      if (candidateToToggle.isActive) {
        updatedUser = await lockUser(candidateToToggle.id);
        alert(`✅ Đã khóa tài khoản của ${candidateToToggle.fullName}`);
      } else {
        updatedUser = await unlockUser(candidateToToggle.id);
        alert(`✅ Đã mở khóa tài khoản của ${candidateToToggle.fullName}`);
      }

      // Cập nhật lại danh sách hiển thị
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateToToggle.id
            ? {
                ...c,
                isActive: updatedUser.isActive,
                status: updatedUser.isActive
                  ? "Đang hoạt động"
                  : "Tạm thời vô hiệu hóa",
              }
            : c
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi thay đổi trạng thái:", error);
      alert("Không thể thay đổi trạng thái tài khoản");
    } finally {
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
      <h1 className="flex items-center gap-3 text-3xl font-extrabold mb-8 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
        <User className="w-9 h-9 text-indigo-600 drop-shadow-sm" />
        Quản lý ứng viên
      </h1>

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
              <tr
                key={c.id}
                className="bg-white/10 backdrop-blur-xl hover:bg-white/20 transition border-b border-white/30"
              >
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
                  <p className="truncate">
                    <span className="font-semibold">Ngành: </span>
                    {c.major}
                  </p>
                  <p className="truncate">
                    <span className="font-semibold">Kỹ năng: </span>
                    {c.skills}
                  </p>
                  <p className="truncate">
                    <span className="font-semibold">Tốt nghiệp: </span>
                    {c.graduationYear} ({c.gpa})
                  </p>
                </td>
                <td className="p-4 text-center flex justify-center gap-2">
                  {/* Nút xem hồ sơ */}
                  <button
                    onClick={() => handleView(c)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                    title="Xem hồ sơ"
                  >
                    <Eye size={18} />
                  </button>

                  {/* Nút khóa/mở khóa tài khoản */}
                  <button
                    onClick={() => handleActiveClick(c)}
                    className={`p-2 rounded-lg transition ${
                      c.status === "Đang hoạt động"
                        ? "bg-green-500 hover:bg-green-400 text-white"  // đang hoạt động → màu xanh
                        : "bg-red-500 hover:bg-red-400 text-white"      // bị khóa → màu đỏ
                    }`}
                    title={
                      c.status === "Đang hoạt động"
                        ? "Vô hiệu hóa"
                        : "Kích hoạt lại"
                    }
                  >
                    {c.status === "Đang hoạt động" ? (
                      <Unlock size={18} />
                    ) : (
                      <Lock size={18} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-white">
          <span className="text-sm mb-2 sm:mb-0">
            Hiển thị {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, filteredCandidates.length)}{" "}
            trong {filteredCandidates.length} ứng viên
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white/30 rounded-lg hover:bg-white/40 disabled:opacity-40"
            >
              Trước
            </button>
            <span className="px-3 py-1 bg-white/20 rounded-lg">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 bg-white/30 rounded-lg hover:bg-white/40 disabled:opacity-40"
            >
              Sau
            </button>
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
              {candidateToToggle.status === "Đang hoạt động"
                ? "Vô hiệu hóa tài khoản"
                : "Kích hoạt tài khoản"}
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