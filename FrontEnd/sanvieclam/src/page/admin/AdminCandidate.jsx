import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, User, Search } from "lucide-react";

const AdminCandidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Thêm state cho tìm kiếm & lọc
  const [searchEmail, setSearchEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  useEffect(() => {
    const fetchCandidates = async () => {
      const data = [
        {
          id: 1,
          name: "Nguyễn Văn A",
          email: "vana@example.com",
          status: "Đang tìm việc",
          major: "Công nghệ thông tin",
          skills: "React, Node.js, SQL, React, Node.js, SQL, React, Node.js, SQL",
          experience: "2 năm",
          graduationYear: 2022,
          gpa: 3.4,
        },
        {
          id: 2,
          name: "Trần Thị B",
          email: "thib@example.com",
          status: "Đang làm việc",
          major: "Quản trị kinh doanh",
          skills: "Excel, PowerBI",
          experience: "1 năm",
          graduationYear: 2021,
          gpa: 3.6,
        },
        {
          id: 3,
          name: "Lê Văn C",
          email: "vanc@example.com",
          status: "Đang tìm việc",
          major: "Kỹ thuật phần mềm",
          skills: "Java, Spring Boot, Docker",
          experience: "Thực tập 6 tháng",
          graduationYear: 2023,
          gpa: 3.8,
        },
        {
          id: 4,
          name: "Phạm Thị D",
          email: "thid@example.com",
          status: "Đang tìm việc",
          major: "Kế toán",
          skills: "Excel, Kế toán tổng hợp",
          experience: "3 năm",
          graduationYear: 2020,
          gpa: 3.2,
        },
        {
          id: 5,
          name: "Nguyễn Văn E",
          email: "vane@example.com",
          status: "Đang tìm việc",
          major: "Marketing",
          skills: "SEO, Google Ads, Facebook Ads",
          experience: "1 năm",
          graduationYear: 2021,
          gpa: 3.5,
        },
        {
          id: 6,
          name: "Trần Thị F",
          email: "thif@example.com",
          status: "Đang làm việc",
          major: "Luật",
          skills: "Pháp lý doanh nghiệp",
          experience: "2 năm",
          graduationYear: 2019,
          gpa: 3.7,
        },
        {
          id: 7,
          name: "Lê Văn G",
          email: "vang@example.com",
          status: "Đang tìm việc",
          major: "Kỹ thuật phần mềm",
          skills: "Java, Spring Boot, Docker",
          experience: "Thực tập 6 tháng",
          graduationYear: 2023,
          gpa: 3.8,
        },
      ];
      setCandidates(data);
    };

    fetchCandidates();
  }, []);

  // Lọc theo email và trạng thái
  const filteredCandidates = candidates.filter((c) => {
    const matchEmail = c.email.toLowerCase().includes(searchEmail.toLowerCase());
    const matchStatus =
      filterStatus === "Tất cả" ? true : c.status === filterStatus;
    return matchEmail && matchStatus;
  });

  // Tính toán dữ liệu phân trang
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-1">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Quản lý ứng viên
      </h1>

      {/* Thanh tìm kiếm và lọc */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center mt-10">
        {/* Tìm theo email */}
        <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-full sm:w-1/2">
          <Search className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo email..."
            value={searchEmail}
            onChange={(e) => {
              setSearchEmail(e.target.value);
              setCurrentPage(1); // reset về trang đầu khi tìm
            }}
            className="flex-1 outline-none text-gray-700"
          />
        </div>

        {/* Lọc theo trạng thái */}
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
              <tr
                key={c.id}
                className="bg-white/10 backdrop-blur-xl hover:bg-white/20 transition border-b border-white/30"
              >
                {/* ID */}
                <td className="p-4 font-semibold text-white">{c.id}</td>

                {/* Ứng viên */}
                <td className="p-4 flex items-center gap-3 text-white">
                  <div className="bg-white/30 w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-xs opacity-80">{c.email}</p>
                  </div>
                </td>

                {/* Thông tin thêm */}
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

                {/* Trạng thái */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.status === "Đang tìm việc"
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                {/* Action buttons */}
                <td className="p-4 text-center space-x-2">
                  <button className="p-2 bg-white/30 rounded-lg hover:bg-white/40 text-white transition">
                    <Eye size={18} />
                  </button>
                  <button className="p-2 bg-yellow-400 rounded-lg hover:bg-yellow-300 text-gray-900 transition">
                    <Edit size={18} />
                  </button>
                  <button className="p-2 bg-red-500 rounded-lg hover:bg-red-400 text-white transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {currentCandidates.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-white py-6">
                  Không tìm thấy ứng viên nào
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-white">
          {/* Bộ đếm */}
          <span className="text-sm mb-2 sm:mb-0">
            Hiển thị {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filteredCandidates.length)} trong{" "}
            {filteredCandidates.length} ứng viên
          </span>

          {/* Nút phân trang */}
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
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 bg-white/30 rounded-lg hover:bg-white/40 disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCandidate;
