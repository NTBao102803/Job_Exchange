import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page /homepage/HomePage";
import LoginPage from "./page /admin/LoginPage";
import Login from "./page /login/Login"; 
import RegisterCandidate from "./page /register/RegisterCandidate";

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<HomePage />} />

        {/* Trang login admin */}
        <Route path="/admin" element={<LoginPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-candidate" element={<RegisterCandidate />} />
      </Routes>
    </Router>
  );
}

export default App;
