import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./page/homepage/HomePage";
import LoginPage from "./page/admin/LoginPage";
import Login from "./page/login/Login"; 
import RegisterCandidate from "./page/register/RegisterCandidate";
import RegisterRecruiter from "./page/register/RegisterRecruiter";
import ChangePassword from "./page/changepassword/ChangePassword"
import DashboardCandidate from "./page/candidate/DashboardCandidate";
import DashboardRecruiter from "./page/recruiter/DashboardRecruiter";
import AdminLayout from "./layout/AdminLayout";
import AdminCandidate from "./page/admin/AdminCandidate";
import AdminDashboard from "./page/admin/AdminDashboad";
import AdminRecruiter from "./page/admin/AdminRecruiter";
import AdminJob from "./page/admin/AdminJob";
import DashboardCandidateProfile from "./page/candidate/DashboardCandidateProfile";
import DashboardRecruiterProfile from "./page/recruiter/DashboardRecruiterProfile";
import DashboardJobList from "./page/candidate/DashboardJobList";
import DashboardJobDetail from "./page/candidate/DashboardJobDetail";
import DashboardSmartJobSuggestionsList from "./page/candidate/DashboardSmartJobSuggestionsList";
import DashboardAppliedJobsList from "./page/candidate/DashboardAppliedJobsList";
import DashboardCreatCVAI from "./page/candidate/DashboardCreatCVAI";

import DashboardPostJob from "./page/recruiter/DashboardPostJob";
import DashboardSmartCandidateSuggestionsList from "./page/recruiter/DashboardSmartCandidateSuggestionsList";
import DashboardRecruiterJobPosts from "./page/recruiter/DashboardRecruiterJobPosts";
import DashboardCandidateshaveApplied from "./page/recruiter/DashboardCandidatesHaveApplied";
import DashboardServicePlans from "./page/recruiter/DashboardServicePlans";
import DashboardRegisterServiceForm from "./page/recruiter/DashboardRegisterServiceForm";




import ChatboxAI from "./page/chatboxAI/ChatBoxAI";

import ScrollToTop from "./components/ScrollToTop";
function AppContent() {
  // useLocation MUST be used inside a Router
  const location = useLocation();
  const isCandidateRoute = location.pathname.startsWith("/candidate/");

  return (
    <>
    < ScrollToTop />
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<HomePage />} />

        {/* Trang login admin */}
        <Route path="/admin" element={<LoginPage />} />
        
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="candidates" element={<AdminCandidate />} />
          <Route path="recruiters" element={<AdminRecruiter />} />
          <Route path="jobs" element={<AdminJob />} />
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
        <Route path="/candidate/dashboard-creatcvai" element={<DashboardCreatCVAI />} />
        <Route path="/candidate/change-password" element={<ChangePassword />} />


        {/* Dashboard nhà tuyển dụng */}
        <Route path="/recruiter/dashboard-recruiter" element={<DashboardRecruiter />} />
        <Route path="/recruiter/recruiterprofile" element={<DashboardRecruiterProfile />} />
        <Route path="/recruiter/dashboard-postjob" element={<DashboardPostJob />} />
        <Route path="/recruiter/dashboard-smartcandidatesuggestionslist" element={<DashboardSmartCandidateSuggestionsList />} />
        <Route path="/recruiter/dashboard-recruiterjobposts" element={<DashboardRecruiterJobPosts />} />
        <Route path="/recruiter/dashboard-candidateshaveapplied" element={<DashboardCandidateshaveApplied />} />
        <Route path="/recruiter/change-password" element={<ChangePassword />} />
        <Route path="/recruiter/serviceplans" element={<DashboardServicePlans />} />
        <Route path="/recruiter/register-service" element={<DashboardRegisterServiceForm />} />
      </Routes>

      {/* Chatbox floating / global: chỉ render khi ở route của candidate */}
      {isCandidateRoute && <ChatboxAI />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
