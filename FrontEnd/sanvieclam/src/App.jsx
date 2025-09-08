import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page /homepage/HomePage";
import LoginPage from "./page /admin/LoginPage";
import Login from "./page /login/Login"; // 

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<HomePage />} />

        {/* Trang login admin */}
        <Route path="/admin" element={<LoginPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
