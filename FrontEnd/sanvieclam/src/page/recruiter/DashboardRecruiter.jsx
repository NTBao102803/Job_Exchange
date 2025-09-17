import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeaderRecruiter from "../../components/recruiter/HeaderRecruiter";
import HomeBanner from "../../components/recruiter/HomeBanner";
import JobCriteria from "../../components/homepage/JobCriteria";
import Footer from "../../components/Footer";
import SmartCandidateSuggestions from "../../components/recruiter/SmartCandidateSuggestions";

export default function DashboardCandidate() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const footerRef = useRef(null);
  // scroll mượt đến HeroBanner
  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // scroll mượt đến Footer
  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const goUpTin = () => {  
    navigate("/recruiter/dashboard-postjob");
  };
  const goSmartCandidate = () => {  
    navigate("/recruiter/dashboard-recruiter#smart-candidate-suggestions");
  };
  const goQLBD = () => {  
    navigate("/recruiter/dashboard-recruiter#quan-ly-bai-dang");
  }; 

  return (
    <div>
      <HeaderRecruiter onHomeClick={scrollToHero} 
                       onUpTinClick={goUpTin}
                       onSmartCandidate={goSmartCandidate}
                       onQLBD={goQLBD} 
                       onFooter={scrollToFooter} />
      <div ref={heroRef}>
        <HomeBanner />
      </div>
      <JobCriteria/>
      <SmartCandidateSuggestions/>
      <div ref={footerRef}>
        <Footer/>
      </div>
    </div>
  );
}
