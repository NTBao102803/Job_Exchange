import React, { useRef } from "react";
import Header from "../../components/homepage/Header";
import Footer from "../../components/Footer";
import HomeBanner from "../../components/homepage/HomeBanner";
import JobCriteria from "../../components/homepage/JobCriteria";
import FeaturedJobs from "../../components/homepage/FeaturedJobs";
import CvAiBanner from "../../components/homepage/CvAiBanner";
import RecruiterSection from "../../components/homepage/RecruiterSection";
import BlogSection from "../../components/homepage/BlogSection";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
   const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const cvAiBannerRef = useRef(null);
  const recruiterRef = useRef(null);
  const blogRef = useRef(null);
  const footerRef = useRef(null);

  // scroll mượt đến HeroBanner
  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // scroll mượt đến FeaturedJobs
  const scrollToFeaturedJobs = () => {
    featuredRef.current?.scrollIntoView({ behavior: "smooth" });

  };
  // scroll mượt đến CvAiBanner
  const scrollToCvAiBanner = () => {
    cvAiBannerRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // scroll mượt đến RecruiterSection
  const scrollToRecruiterSection = () => {
    recruiterRef.current?.scrollIntoView({ behavior: "smooth" });
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
      <Header onHomeClick={scrollToHero} 
              onJobsClick={scrollToFeaturedJobs} 
              onCvAiBannerClick={scrollToCvAiBanner} 
              onRecruiterSection={scrollToRecruiterSection}
              onBlog={scrollToBlogSection}
              onFooter={scrollToFooter} />
      <div ref={heroRef}>
        <HomeBanner onStartClick={() => navigate("/login")}/>
      </div>
      <JobCriteria />
      <div ref={featuredRef}>
        <FeaturedJobs onStartClick={() => navigate("/login")}
                      onJob={() => navigate("/login")}
        />
      </div>
      <div ref={cvAiBannerRef}>
        <CvAiBanner onStartClick={() => navigate("/login")}/>
      </div>
      <div ref={recruiterRef}>
        <RecruiterSection />
      </div>
      <div ref={blogRef}>
        <BlogSection />
      </div>
      <div ref={footerRef}>   
      <Footer />
      </div>
    </div>
  );
}
