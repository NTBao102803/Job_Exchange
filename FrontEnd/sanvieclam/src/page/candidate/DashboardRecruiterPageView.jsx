import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeaderCandidate from "../../components/candidate/HeaderCandidate";
import Footer from "../../components/Footer";
import RecruiterPageView from "../../components/recruiter/RecruiterPageView";
export default function DashboardRecruiterPageView() {
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
    navigate("/candidate/dashboard-joblist");
  };
    const goCVAIClick = () => { 
    navigate("/candidate/dashboard-creatcvai");
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
      <HeaderCandidate  onHomeClick={goHome}
                        onJobClick={goJob}
                        onCVAIClick={goCVAIClick}
                        onJobSmartClick={goJobSmartClick}
                        onJobUTClick={goJobUTClick}
                        onBlog={goBlog}
                        onFooter={scrollToFooter} />
      <RecruiterPageView/>
      <div ref={footerRef}>
        <Footer/>
      </div>
    </div>
  );
}
