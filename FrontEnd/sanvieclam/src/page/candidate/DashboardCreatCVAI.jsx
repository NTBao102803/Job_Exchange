import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeaderCandidate from "../../components/candidate/HeaderCandidate";
import CreatCVAI from "../../components/candidate/CreatCVAI";
import Footer from "../../components/Footer";

export default function DashboardCreatCVAI() {
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
      <HeaderCandidate onHomeClick={goHome} 
                       onJobClick={goJob}
                       onCVAIClick={goCVAIClick}
                       onJobSmartClick={goJobSmartClick}
                       onJobUTClick={goJobUTClick}
                       onBlog={goBlog}
                       onFooter={scrollToFooter} />

     
      <CreatCVAI/>
      <div ref={footerRef}>
        <Footer/>
      </div>
    </div>
  );
}
