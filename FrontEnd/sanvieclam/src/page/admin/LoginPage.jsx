import React from "react";
import AdminLogin from "../../components/admin/AdminLogin";

export default function LoginPage() {
  // callback sau khi đăng nhập
  const handleLogin = (credentials) => {
    console.log("Thông tin đăng nhập:", credentials);
    // api.post("/admin/login", credentials).then(...)
    alert(`Xin chào ${credentials.username}, bạn đã đăng nhập thành công!`);
  };

  return <AdminLogin onSubmit={handleLogin} />;
}
