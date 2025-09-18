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
import DashboardCandidateProfile from "./page/candidate/DashboardCandidateProfile";
import DashboardRecruiterProfile from "./page/recruiter/DashboardRecruiterProfile";
import DashboardJobList from "./page/candidate/DashboardJobList";
import DashboardJobDetail from "./page/candidate/DashboardJobDetail";
import DashboardSmartJobSuggestionsList from "./page/candidate/DashboardSmartJobSuggestionsList";
import DashboardAppliedJobsList from "./page/candidate/DashboardAppliedJobsList";

import DashboardPostJob from "./page/recruiter/DashboardPostJob";
import DashboardSmartCandidateSuggestionsList from "./page/recruiter/DashboardSmartCandidateSuggestionsList";

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
        <Route path="/candidate/candidateprofile" element={<DashboardCandidateProfile />} />
        <Route path="/candidate/dashboard-joblist" element={<DashboardJobList />} />
        <Route path="/candidate/jobs/:id" element={<DashboardJobDetail />} />
        <Route path="/candidate/dashboard-smartjobsuggestionslist" element={<DashboardSmartJobSuggestionsList />} />
        <Route path="/candidate/dashboard-appliedjobslist" element={<DashboardAppliedJobsList />} />
          {/* Dashboard nhà tuyển dụng */}
        <Route path="/recruiter/dashboard-recruiter" element={<DashboardRecruiter />} />
        <Route path="/recruiter/recruiterprofile" element={<DashboardRecruiterProfile />} />
        <Route path="/recruiter/dashboard-postjob" element={<DashboardPostJob />} />
        <Route path="/recruiter/dashboard-smartcandidatesuggestionslist" element={<DashboardSmartCandidateSuggestionsList />} />
      </Routes>
    </Router>
  );
}

export default App;
