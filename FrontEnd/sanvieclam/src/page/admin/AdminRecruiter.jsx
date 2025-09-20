import React, { useState, useEffect } from "react";
import { Search, Trash2, CheckCircle, XCircle, Building2 , Lock, Unlock} from "lucide-react";
import RecruiterActiveModal from "../../components/admin/RecruiterActiveModal";

const AdminRecruiter = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [searchEmail, setSearchEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [recruiterToToggle, setRecruiterToToggle] = useState(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);


  useEffect(() => {
    const fetchRecruiters = async () => {
      const data = [
        { id: 1, fullName: "Nguyễn Quang hà ", email: "contact@abc.com", companyName: "ABC Corp", companyField: "Công nghệ", companyAddress: "Hà Nội", status: "Đang chờ xác minh",active: "Tạm thời vô hiệu hoá", },
        { id: 2, fullName: "Nguyễn Quang hà", email: "info@xyz.com", companyName: "XYZ Group", companyField: "Sản xuất", companyAddress: "TP.HCM", status: "Đã xác minh",active: "Đang hoạt động", },
        { id: 3, fullName: "Nguyễn Quang hà", email: "fail@test.com", companyName: "Test Co", companyField: "Dịch vụ", companyAddress: "Đà Nẵng", status: "Xác minh thất bại",active: "Tạm thời vô hiệu hoá", },
        { id: 4, fullName: "Nguyễn Quang hà", email: "demo@company.com", companyName: "Demo Inc", companyField: "Marketing", companyAddress: "Huế", status: "Đang chờ xác minh",active: "Tạm thời vô hiệu hoá", },
      ];
      setRecruiters(data);
    };
    fetchRecruiters();
  }, []);

  // lọc recruiter theo email + trạng thái
  const filteredRecruiters = recruiters.filter((r) => {
    const matchEmail = r.email.toLowerCase().includes(searchEmail.toLowerCase());
    const matchStatus = filterStatus === "Tất cả" || r.status === filterStatus;
    return matchEmail && matchStatus;
  });

  const totalPages = Math.ceil(filteredRecruiters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecruiters = filteredRecruiters.slice(startIndex, startIndex + itemsPerPage);

 
  // Mở modal xác nhận thay đổi trạng thái
  const handleActiveClick = (recruiters) => {
    setRecruiterToToggle(recruiters);
    setIsConfirmModalOpen(true);
  };


  const confirmToggleActive = () => {
    if (recruiterToToggle) {
      setRecruiters((prev) =>
        prev.map((r) =>
          r.id === recruiterToToggle.id
            ? {
                ...r,
                active:
                  r.active === "Đang hoạt động"
                    ? "Tạm thời vô hiệu hóa"
                    : "Đang hoạt động",
              }
            : r
        )
      );
      setRecruiterToToggle(null);
      setIsConfirmModalOpen(false);
    }
  };

  const cancelToggleActive = () => {
    setRecruiterToToggle(null);
    setIsConfirmModalOpen(false);
  };


  return (
    <div className="p-1">
      <h1 className="flex items-center gap-3 text-3xl font-extrabold mb-8 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">
        <Building2 className="w-9 h-9 text-green-600 drop-shadow-sm" />
        Quản lý nhà tuyển dụng
      </h1>

      {/* Thanh tìm kiếm + bộ lọc */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 mt-10">
        {/* Search */}
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

        {/* Bộ lọc trạng thái */}
        <div className="flex gap-2">
          {["Tất cả", "Đã xác minh", "Đang chờ xác minh", "Xác minh thất bại"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                filterStatus === status
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bảng recruiter */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 p-6 rounded-2xl shadow-lg mt-10">
        <table className="w-full text-left border-collapse rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-white/20 text-white uppercase text-sm tracking-wider">
              <th className="p-4">ID</th>
              <th className="p-4">Nhà tuyển dụng</th>
              <th className="p-4">Công ty</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentRecruiters.map((r) => (
              <tr key={r.id} className="bg-white/10 backdrop-blur-xl hover:bg-white/20 transition border-b border-white/30">
                <td className="p-4 font-semibold text-white">{r.id}</td>
                <td className="p-4 flex items-center gap-3 text-white">
                  <div className="bg-white/30 w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                    <Building2 className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-bold">{r.fullName}</p>
                    <p className="text-xs opacity-80">{r.email}</p>
                  </div>
                </td>
                <td className="p-4 text-sm text-white space-y-1 max-w-[250px]">
                  <p className="truncate "><span className="font-semibold">Tên CT: </span>{r.companyName}</p>
                  <p className="truncate"><span className="font-semibold">Lĩnh vực: </span>{r.companyField}</p>
                  <p className="truncate"><span className="font-semibold">Địa chỉ: </span>{r.companyAddress}</p>
                </td>
                <td className="p-4 text-white">
                  {r.status === "Đã xác minh" && (
                    <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">{r.status}</span>
                  )}
                  {r.status === "Đang chờ xác minh" && (
                    <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">{r.status}</span>
                  )}
                  {r.status === "Xác minh thất bại" && (
                    <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">{r.status}</span>
                  )}
                </td>
                <td className="p-4 text-center space-x-2">
                <button
                    disabled={r.status !== "Đang chờ xác minh"}
                    onClick={() => setSelectedRecruiter(r)}
                    title={
                    r.status !== "Đang chờ xác minh"
                        ? "Chỉ xét duyệt khi trạng thái là Đang chờ xác minh"
                        : ""
                    }
                    className={`p-2 rounded-lg text-white transition ${
                    r.status === "Đang chờ xác minh"
                        ? "bg-blue-500 hover:bg-blue-400"
                        : "bg-gray-400 cursor-not-allowed opacity-50"
                    }`}
                >
                    Xét duyệt
                </button>
                <button className="p-2 bg-red-500 rounded-lg hover:bg-red-400 text-white transition">
                    <Trash2 size={18} />
                </button>
                {/* Nút thay đổi trạng thái */}
                  {/* Nút thay đổi trạng thái */}
                    <button
                    disabled={r.status !== "Đã xác minh"}
                    onClick={() => handleActiveClick(r)}
                    title={
                        r.status !== "Đã xác minh"
                        ? "Chỉ thay đổi hoạt động khi trạng thái là Đã xác minh"
                        : ""
                    }
                    className={`p-2 rounded-lg transition ${
                        r.status === "Đã xác minh"
                        ? r.active === "Đang hoạt động"
                            ? "bg-green-500 hover:bg-green-400 text-white"
                            : "bg-red-500 hover:bg-red-400 text-white"
                        : "bg-gray-400 cursor-not-allowed opacity-50"
                    }`}
                    >
                    {r.active === "Đang hoạt động" ? <Unlock size={18} /> : <Lock size={18} />}
                    </button>
           
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-white">
          <span className="text-sm mb-2 sm:mb-0">
            Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRecruiters.length)} trong {filteredRecruiters.length} nhà tuyển dụng
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white/30 rounded-lg hover:bg-white/40 disabled:opacity-40"
            >
              Trước
            </button>
            <span className="px-3 py-1 bg-white/20 rounded-lg">{currentPage} / {totalPages || 1}</span>
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

      {/* Modal xác nhận thay đổi trạng thái */}
      {isConfirmModalOpen && recruiterToToggle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <h2 className="text-lg font-bold mb-4">
              {recruiterToToggle.active === "Đang hoạt động" ? "Vô hiệu hóa tài khoản" : "Kích hoạt tài khoản"}
            </h2>
            <p className="mb-6">
              {recruiterToToggle.active === "Đang hoạt động"
                ? `Bạn có muốn vô hiệu hóa tài khoản của ${recruiterToToggle.fullName}?`
                : `Bạn có muốn kích hoạt lại tài khoản của ${recruiterToToggle.fullName}?`}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmToggleActive}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
              >
                Đồng ý
              </button>
              <button
                onClick={cancelToggleActive}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-200"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
       {/* Modal xét duyệt recruiter */}
{selectedRecruiter && (
  <RecruiterActiveModal
    recruiter={selectedRecruiter}
    onClose={() => setSelectedRecruiter(null)}
    onApprove={({ id, active }) => {
      setRecruiters((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: "Đã xác minh", active }
            : r
        )
      );
      setSelectedRecruiter(null);
    }}
    onReject={({ id, active }) => {
      setRecruiters((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: "Xác minh thất bại", active }
            : r
        )
      );
      setSelectedRecruiter(null);
    }}
  />
)}


    </div>
  );
};

export default AdminRecruiter;
