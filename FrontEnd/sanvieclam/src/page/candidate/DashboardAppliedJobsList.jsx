import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeaderCandidate from "../../components/candidate/HeaderCandidate";
import AppliedJobsList from "../../components/candidate/AppliedJobsList";
import Footer from "../../components/Footer";

export default function DashboardAppliedJobsList() {
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
     navigate("/candidate/dashboard-smartjobsuggestionslist");
   };
     const goJobUTClick = () => { 
     navigate("/candidate/dashboard-appliedjobslist");
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

     
      <AppliedJobsList/>
      <div ref={footerRef}>
        <Footer/>
      </div>
    </div>
  );
}
