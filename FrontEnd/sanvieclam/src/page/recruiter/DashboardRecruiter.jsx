import React, { useRef } from "react";
import HeaderRecruiter from "../../components/recruiter/HeaderRecruiter";
import HomeBanner from "../../components/recruiter/HomeBanner";
import JobCriteria from "../../components/homepage/JobCriteria";
import BlogSection from "../../components/homepage/BlogSection";
import Footer from "../../components/Footer";
import SmartCandidateSuggestions from "../../components/recruiter/SmartCandidateSuggestions";

export default function DashboardCandidate() {
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

  return (
    <div>
      <HeaderRecruiter onHomeClick={scrollToHero} 
                       onBlog={scrollToBlogSection}
                       onFooter={scrollToFooter} />
      <div ref={heroRef}>
        <HomeBanner />
      </div>
      <JobCriteria/>
      <SmartCandidateSuggestions/>
      <div ref={blogRef}>
        <BlogSection/>
      </div>
      <div ref={footerRef}>
        <Footer/>
      </div>
    </div>
  );
}
