import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CreditCard,
  Settings,
  LogOut,
  UserCheck,
  Building2,
  Receipt,
  RefreshCw,
  Wallet,
  Package,
  ChevronDown,
  ChevronRight,
  FileBarChart,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { logout } from "../../api/AuthApi";

const AdminSidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = async () => {
    try {
      await logout();   // gọi API logout + xoá token
      navigate("/login"); // điều hướng về trang login
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  };

  const menu = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, link: "/admin/dashboard" },

    {
      title: "Quản lý người dùng",
      icon: <Users size={20} />,
      children: [
        { title: "Ứng viên", icon: <UserCheck size={18} />, link: "/admin/dashboard/candidates" },
        { title: "Nhà tuyển dụng", icon: <Building2 size={18} />, link: "/admin/dashboard/recruiters" },
      ],
    },

    {
      title: "Quản lý việc làm",
      icon: <Briefcase size={20} />,
      children: [
        { title: "Tin tuyển dụng", icon: <Briefcase size={18} />, link: "/admin/dashboard/jobs" },
      ],
    },

    {
      title: "Quản lý giao dịch",
      icon: <CreditCard size={20} />,
      children: [
        { title: "Thanh toán", icon: <CreditCard size={18} />, link: "/admin/dashboard/payments" },
        { title: "Hoàn tiền", icon: <RefreshCw size={18} />, link: "/admin/dashboard/refunds" },
        { title: "Phương thức thanh toán", icon: <Wallet size={18} />, link: "/admin/dashboard/payment-methods" },
        { title: "Gói dịch vụ", icon: <Package size={18} />, link: "/admin/dashboard/service-packages" },
      ],
    },

    {
      title: "Báo cáo",
      icon: <Receipt size={20} />,
      children: [
        { title: "Người dùng", icon: <Users size={18} />, link: "/admin/dashboard/reports/users" },
        { title: "Việc làm", icon: <Briefcase size={18} />, link: "/admin/dashboard/reports/jobs" },
        { title: "Tài chính", icon: <FileBarChart size={18} />, link: "/admin/dashboard/reports/finance" },
      ],
    },

    { title: "Cài đặt", icon: <Settings size={20} />, link: "/admin/dashboard/settings" },
  ];

  return (
    <aside className="h-screen w-72 bg-gradient-to-b from-indigo-800 via-indigo-900 to-black text-gray-100 flex flex-col shadow-2xl">
      {/* Logo + Tên trang */}
      <div className="h-20 flex items-center justify-center gap-3 border-b border-indigo-700">
        <img src="/Logo.png" alt="Company Logo" className="h-12 w-12 drop-shadow-lg rounded-lg" />
        <span className="text-xl font-bold tracking-wide text-white">SinhVienJob</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
        {menu.map((item, idx) => (
          <div key={idx}>
            {item.children ? (
              <>
                {/* Menu lớn */}
                <button
                  onClick={() => toggleMenu(item.title)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-indigo-700/60 hover:shadow-lg hover:pl-5 transition-all duration-300 font-semibold tracking-wide"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-indigo-300">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  {openMenus[item.title] ? (
                    <ChevronDown size={18} className="text-indigo-400" />
                  ) : (
                    <ChevronRight size={18} className="text-indigo-400" />
                  )}
                </button>

                {/* Menu con */}
                {openMenus[item.title] && (
                  <div className="ml-8 mt-2 space-y-2 border-l border-indigo-700 pl-4">
                    {item.children.map((sub, subIdx) => (
                      <NavLink
                        key={subIdx}
                        to={sub.link}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm 
                          ${isActive
                            ? "bg-indigo-700 text-white font-bold shadow-md"
                            : "text-gray-300 hover:bg-indigo-700/50 hover:text-white"}`
                        }
                      >
                        <span className="text-indigo-400">{sub.icon}</span>
                        {sub.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // Menu không con
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold tracking-wide
                  ${isActive
                    ? "bg-indigo-700 text-white font-bold shadow-lg pl-5"
                    : "text-gray-300 hover:bg-indigo-700/60 hover:pl-5"}`
                }
              >
                <span className="text-indigo-300">{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-indigo-700 px-4 py-4">
        <button  onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600/90 hover:bg-red-600 w-full font-semibold shadow-md hover:shadow-lg transition-all duration-300">
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
