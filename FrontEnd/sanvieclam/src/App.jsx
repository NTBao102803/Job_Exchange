import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/homepage/HomePage";
import LoginPage from "./page/admin/LoginPage";
import Login from "./page/login/Login"; 
import RegisterCandidate from "./page/register/RegisterCandidate";
import RegisterRecruiter from "./page/register/RegisterRecruiter";
import DashboardCandidate from "./page/candidate/DashboardCandidate";
import DashboardRecruiter from "./page/recruiter/DashboardRecruiter";
import AdminLayout from "./layout/AdminLayout";
import AdminCandidate from "./page/admin/AdminCandidate";
import AdminDashboard from "./page/admin/AdminDashboad";

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<HomePage />} />

        {/* Trang login admin */}
        <Route path="/admin" element={<LoginPage />} />
        
        <Route path="/admin/dashboard" element={< AdminLayout/>} >
          <Route index element={<AdminDashboard />} />
          <Route path="candidates" element={<AdminCandidate />} />
        </Route>

          {/* Trang login ứng viên và nhà tuyển dụng */}
        <Route path="/login" element={<Login />} />
        <Route path="/register-candidate" element={<RegisterCandidate />} />
        <Route path="/register-recruiter" element={<RegisterRecruiter />} />
          {/* Dashboard ứng viên */}
        <Route path="/candidate/dashboard-candidate" element={<DashboardCandidate />} />
          {/* Dashboard nhà tuyển dụng */}
        <Route path="/recruiter/dashboard-recruiter" element={<DashboardRecruiter />} />
      </Routes>
    </Router>
  );
}

export default App;
