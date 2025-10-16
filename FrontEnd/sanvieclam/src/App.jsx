import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";


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
import AdminUserReport from "./page/admin/AdminUserReport";

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
import DashboardPaymentHistory from "./page/recruiter/DashboardPaymentHistory";
import ForgotPassword from "./page/forgotpassword/ForgotPassword";




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

  {/* Login admin */}
  <Route path="/admin" element={<LoginPage />} />

  {/* Admin - chỉ cho role_id === 2 */}
  <Route
    path="/admin/dashboard"
    element={
      <ProtectedRoute element={AdminLayout} allowedRoles={[2]} />
    }
  >
    <Route index element={<AdminDashboard />} />
    <Route path="candidates" element={<AdminCandidate />} />
    <Route path="recruiters" element={<AdminRecruiter />} />
    <Route path="jobs" element={<AdminJob />} />
    <Route path="reports/users" element={<AdminUserReport />} />
  </Route>

  {/* Login, đăng ký */}
  <Route path="/login" element={<Login />} />
  <Route path="/register-candidate" element={<RegisterCandidate />} />
  <Route path="/register-recruiter" element={<RegisterRecruiter />} />
    {/* Quên mật khẩu */}
  <Route path="/forgot-password" element={<ForgotPassword />} />

  {/* Candidate - chỉ cho role_id === 1 */}
  <Route
    path="/candidate/dashboard-candidate"
    element={<ProtectedRoute element={DashboardCandidate} allowedRoles={[1]} />}
  />
  <Route
    path="/candidate/candidateprofile"
    element={<ProtectedRoute element={DashboardCandidateProfile} allowedRoles={[1]} />}
  />
  <Route
    path="/candidate/dashboard-joblist"
    element={<ProtectedRoute element={DashboardJobList} allowedRoles={[1]} />}
  />
  <Route
    path="/candidate/jobs/:id"
    element={<ProtectedRoute element={DashboardJobDetail} allowedRoles={[1]} />}
  />
  <Route
    path="/candidate/dashboard-smartjobsuggestionslist"
    element={<ProtectedRoute element={DashboardSmartJobSuggestionsList} allowedRoles={[1]} />}
  />
  <Route
    path="/candidate/dashboard-appliedjobslist"
    element={<ProtectedRoute element={DashboardAppliedJobsList} allowedRoles={[1]} />}
  />
  <Route
    path="/candidate/dashboard-creatcvai"
    element={<ProtectedRoute element={DashboardCreatCVAI} allowedRoles={[1]} />}
  />
  <Route
    path="/candidate/change-password"
    element={<ProtectedRoute element={ChangePassword} allowedRoles={[1]} />}
  />

  {/* Recruiter - chỉ cho role_id === 3 */}
  <Route
    path="/recruiter/dashboard-recruiter"
    element={<ProtectedRoute element={DashboardRecruiter} allowedRoles={[3]} />}
  />
  <Route
    path="/recruiter/recruiterprofile"
    element={<ProtectedRoute element={DashboardRecruiterProfile} allowedRoles={[3]} />}
  />
  <Route
    path="/recruiter/dashboard-postjob"
    element={<ProtectedRoute element={DashboardPostJob} allowedRoles={[3]} />}
  />
  <Route
    path="/recruiter/dashboard-smartcandidatesuggestionslist"
    element={<ProtectedRoute element={DashboardSmartCandidateSuggestionsList} allowedRoles={[3]} />}
  />
  <Route
    path="/recruiter/dashboard-recruiterjobposts"
    element={<ProtectedRoute element={DashboardRecruiterJobPosts} allowedRoles={[3]} />}
  />
  <Route
    path="/recruiter/dashboard-candidateshaveapplied"
    element={<ProtectedRoute element={DashboardCandidateshaveApplied} allowedRoles={[3]} />}
  />
  <Route
    path="/recruiter/change-password"
    element={<ProtectedRoute element={ChangePassword} allowedRoles={[3]} />}
  />
  <Route
    path="/recruiter/serviceplans"
    element={<ProtectedRoute element={DashboardServicePlans} allowedRoles={[3]} />}
  />
  <Route
    path="/recruiter/register-service"
    element={<ProtectedRoute element={DashboardRegisterServiceForm} allowedRoles={[3]} />}
  />
  <Route
    path="/recruiter/payment-history"
    element={<ProtectedRoute element={DashboardPaymentHistory} allowedRoles={[3]} />}
  />
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
