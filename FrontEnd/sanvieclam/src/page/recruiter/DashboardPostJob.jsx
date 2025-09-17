import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeaderRecruiter from "../../components/recruiter/HeaderRecruiter";
import PostJob from "../../components/recruiter/PostJob";
import Footer from "../../components/Footer";

export default function DashboardPostJob() {
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
    navigate("/recruiter/dashboard-smartcandidatesuggestionslist");
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
      <PostJob/>
      <div ref={footerRef}>
        <Footer/>
      </div>
    </div>
  );
}
