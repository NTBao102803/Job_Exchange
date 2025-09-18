import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeaderCandidate from "../../components/candidate/HeaderCandidate";
import HomeBanner from "../../components/homepage/HomeBanner";
import JobCriteria from "../../components/homepage/JobCriteria";
import FeaturedJobs from "../../components/homepage/FeaturedJobs";
import CvAiBanner from "../../components/homepage/CvAiBanner";
import BlogSection from "../../components/homepage/BlogSection";
import Footer from "../../components/Footer";
import SmartJobSuggestions from "../../components/candidate/SmartJobSuggestions";

export default function DashboardCandidate() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const blogRef = useRef(null);
  const footerRef = useRef(null);
  // scroll mượt đến HeroBanner
  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  };
    // scroll mượt đến blogsection
  const scrollToBlogSection = () => {
    blogRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // scroll mượt đến Footer
  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
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
  return (
    <div>
      <HeaderCandidate onHomeClick={scrollToHero} 
                       onJobClick={goJob}
                       onCVAIClick={goCVAIClick}
                       onJobSmartClick={goJobSmartClick}
                       onJobUTClick={goJobUTClick}
                       onBlog={scrollToBlogSection}
                       onFooter={scrollToFooter} />
      <div ref={heroRef}>
        <HomeBanner />
      </div>
      <JobCriteria/>
      <FeaturedJobs onStartClick={() => navigate("/candidate/dashboard-joblist")}
                    onJob={(job) => navigate(`/candidate/jobs/${job.id}`, { state: { job } })}
      />
      <CvAiBanner/>
      <SmartJobSuggestions/>
      <div ref={blogRef}>
        <BlogSection/>
      </div>
      <div ref={footerRef}>
        <Footer/>
      </div>
    </div>
  );
}
