import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Component bảo vệ route theo role người dùng
 * @param {React.Component} element - Component cần bảo vệ
 * @param {Array<number>} allowedRoles - Danh sách role.id được phép truy cập
 */
const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const storedUser = localStorage.getItem("user");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error("❌ Lỗi parse user trong localStorage:", err);
  }

  // ❌ Nếu chưa đăng nhập
  if (!user) {
    console.warn("⚠️ Người dùng chưa đăng nhập → chuyển về /login");
    return <Navigate to="/login" replace />;
  }

  // ✅ Lấy role.id chính xác từ user.role.id
  const roleId = user?.role?.id;

  // ❌ Nếu không có quyền truy cập
  if (!allowedRoles.includes(roleId)) {
    console.warn(`🚫 Quyền hiện tại (${roleId}) không được phép vào route này`);
    return <Navigate to="/" replace />;
  }

  // ✅ Nếu hợp lệ → render component
  return <Component />;
};

export default ProtectedRoute;
