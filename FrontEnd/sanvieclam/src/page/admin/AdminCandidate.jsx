import React, { useState, useEffect } from "react";

const AdminCandidate = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // Gọi API lấy danh sách ứng viên (demo dữ liệu)
    const fetchCandidates = async () => {
      const data = [
        { id: 1, name: "Nguyễn Văn A", email: "vana@example.com", status: "Đang tìm việc" },
        { id: 2, name: "Trần Thị B", email: "thib@example.com", status: "Đang làm việc" },
        { id: 3, name: "Lê Văn C", email: "vanc@example.com", status: "Đang tìm việc" },
      ];
      setCandidates(data);
    };

    fetchCandidates();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý ứng viên</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-4 border">ID</th>
              <th className="p-4 border">Tên ứng viên</th>
              <th className="p-4 border">Email</th>
              <th className="p-4 border">Trạng thái</th>
              <th className="p-4 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-4 border">{c.id}</td>
                <td className="p-4 border">{c.name}</td>
                <td className="p-4 border">{c.email}</td>
                <td className="p-4 border">{c.status}</td>
                <td className="p-4 border space-x-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Xem
                  </button>
                  <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                    Sửa
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCandidate;
