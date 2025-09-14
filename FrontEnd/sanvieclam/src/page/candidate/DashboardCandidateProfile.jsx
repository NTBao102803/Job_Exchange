import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeaderCandidate from "../../components/candidate/HeaderCandidate";
import CandidateProfile from "../../components/candidate/CandidateProfile";
import Footer from "../../components/Footer";

export default function DashboardCandidateProfile() {
    const navigate = useNavigate();
    const footerRef = useRef(null);
    // scroll mượt đến Footer
  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };
   const goHome = () => {
    navigate("/candidate/dashboard-candidate");
  };
  const goJob = () => {
    navigate("/candidate/dashboard-candidate#featured-jobs");
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
      <HeaderCandidate  onHomeClick={goHome}
                        onJobClick={goJob}
                        onCVAIClick={goCVAIClick}
                        onJobSmartClick={goJobSmartClick}
                        onJobUTClick={goJobUTClick}
                        onBlog={goBlog}
                        onFooter={scrollToFooter} />
      <CandidateProfile/>
      <div ref={footerRef}>
        <Footer/>
      </div>
    </div>
  );
}
