// src/page/admin/AdminDashboard.js
import React from "react";
import { BarChart3, Users, Briefcase, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-6xl h-full bg-white rounded-2xl shadow-xl p-10 flex flex-col justify-between">
        {/* Logo + Tiêu đề */}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-indigo-600 text-center">
            📊 Bảng Điều Khiển Quản Trị
          </h1>
          <p className="text-gray-600 mt-2 text-center text-lg">
            Chào mừng bạn đến với hệ thống quản lý.  
            Hãy theo dõi thống kê và chọn menu bên trái để thao tác chi tiết.
          </p>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 place-items-center">
          <div className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition w-full">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 text-white rounded-full">
                <Users size={28} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ứng viên</h3>
                <p className="text-2xl font-bold text-indigo-700">1,245</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-lg transition w-full">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-600 text-white rounded-full">
                <Briefcase size={28} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Nhà tuyển dụng</h3>
                <p className="text-2xl font-bold text-green-700">326</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl shadow hover:shadow-lg transition w-full">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-600 text-white rounded-full">
                <DollarSign size={28} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Giao dịch</h3>
                <p className="text-2xl font-bold text-yellow-700">3,567</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-xl shadow hover:shadow-lg transition w-full">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-600 text-white rounded-full">
                <BarChart3 size={28} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Báo cáo</h3>
                <p className="text-2xl font-bold text-red-700">89</p>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="bg-gray-50 rounded-xl p-8 shadow-inner text-center mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Hướng dẫn nhanh
          </h2>
          <p className="text-gray-600 leading-relaxed">
            - Chọn mục <b>Ứng viên</b> để quản lý danh sách ứng viên. <br />
            - Chọn mục <b>Nhà tuyển dụng</b> để xem và phê duyệt tài khoản. <br />
            - Vào phần <b>Giao dịch</b> để theo dõi các gói dịch vụ đã mua. <br />
            - Phần <b>Báo cáo</b> giúp bạn theo dõi hiệu suất hệ thống.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
