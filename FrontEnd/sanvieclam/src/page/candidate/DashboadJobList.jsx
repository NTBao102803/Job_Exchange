import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeaderCandidate from "../../components/candidate/HeaderCandidate";
import JobList from "../../components/candidate/JobList";
import Footer from "../../components/Footer";

export default function DashboardJobList() {
  const footerRef = useRef(null);
  const navigate = useNavigate();
     // scroll mượt đến Footer
   const scrollToFooter = () => {
     footerRef.current?.scrollIntoView({ behavior: "smooth" });
   };
    const goHome = () => {
     navigate("/candidate/dashboard-candidate");
   };
   const goJob = () => {
     navigate("/candidate/dashboard-joblist");
   };
     const goCVAIClick = () => { 
     navigate("/candidate/dashboard-candidate#cv-ai-banner");
   };
     const goJobSmartClick = () => { 
     navigate("/candidate/dashboard-candidate#smart-job-suggestions");
   };
     const goJobUTClick = () => { 
     navigate("/candidate/dashboard-candidate#job-applied");
   };
     const goBlog = () => {
     navigate("/candidate/dashboard-candidate#blog-section");
   };
  return (
    <div>
      <HeaderCandidate onHomeClick={goHome} 
                       onJobClick={goJob}
                       onCVAIClick={goCVAIClick}
                       onJobSmartClick={goJobSmartClick}
                       onJobUTClick={goJobUTClick}
                       onBlog={goBlog}
                       onFooter={scrollToFooter} />

     
      <JobList/>
      <div ref={footerRef}>
        <Footer/>
      </div>
    </div>
  );
}
