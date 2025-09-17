import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeaderRecruiter from "../../components/recruiter/HeaderRecruiter";
import RecruiterProfile from "../../components/recruiter/RecruiterProfile";
import Footer from "../../components/Footer";

export default function DashboardCandidateProfile() {
  const navigate = useNavigate();
  const footerRef = useRef(null);
  
  // scroll mượt đến Footer
  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const goHome = () => {
    navigate("/recruiter/dashboard-recruiter");
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
      <HeaderRecruiter onHomeClick={goHome}
                       onUpTinClick={goUpTin}
                       onSmartCandidate={goSmartCandidate}
                       onQLBD={goQLBD}
                       onFooter={scrollToFooter} />
      <RecruiterProfile/>
      <div ref={footerRef}>
        <Footer/>
      </div>
    </div>
  );
}
