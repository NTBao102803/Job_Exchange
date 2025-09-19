import React from "react";
import { motion } from "framer-motion";

const jobs = [
  { 
    id:1,
    title: "Frontend Developer",
    company: "Tech Corp",
    salary: "15 - 20 triệu",
    language: "JavaScript, React",
    tools: "VSCode, Git,VSCode, Git,VSCode, Git,VSCode, Git,VSCode, Git,VSCode, Git",
    image: "/images/job1.jpg",
    hot: true,
  },
  {
    id:2,
    title: "Backend Developer",
    company: "Innovatech",
    salary: "18 - 25 triệu",
    language: "Java, Spring Boot",
    tools: "IntelliJ, Docker",
    image: "/images/job2.jpg",
    hot: false,
  },
  {
    id:3,
    title: "UI/UX Designer",
    company: "Creative Studio",
    salary: "12 - 18 triệu",
    language: "Figma, Adobe XD",
    tools: "Photoshop, Illustrator",
    image: "/images/job3.jpg",
    hot: true,
  },
  {
    id:4,
    title: "Fullstack Developer",
    company: "NextGen Tech",
    salary: "20 - 30 triệu",
    language: "React, Node.js",
    tools: "Postman, Git",
    image: "/images/job4.jpg",
    hot: false,
  },
];

const FeaturedJobs = ({ onStartClick,onJob }) => {
  return (
    <section className="w-full py-16 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 text-gray-900">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center">
        Việc làm nổi bật
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
        {jobs.map((job, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.2, duration: 0.6, type: "spring", stiffness: 120 }}
            className="relative bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden hover:scale-105 hover:shadow-2xl transition-transform duration-300 flex flex-col"
          >
            {job.hot && (
              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-lg animate-pulse">
                Hot
              </div>
            )}

            <div className="h-40 w-full overflow-hidden">
              <img
                src={job.image}
                alt={job.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-1">{job.title}</h3>
                <span className="text-sm">{job.company}</span>
                <div className="text-sm font-medium mt-2">{job.salary}</div>
                <div className="mt-2 text-xs space-y-1">
                  <div className="flex">
                    <span className="font-semibold mr-1">Ngôn ngữ:</span>
                    <span 
                      className="truncate max-w-[180px] whitespace-nowrap" 
                      title={job.language}
                    >
                      {job.language}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold mr-1">Công cụ:</span>
                    <span 
                      className="truncate max-w-[180px] whitespace-nowrap" 
                      title={job.tools}
                    >
                      {job.tools}
                    </span>
                  </div>
                </div>

              </div>

              <div className="flex justify-end mt-4">
                <button onClick={()=> onJob(job)}
                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl shadow-lg transition-all duration-300 hover:bg-blue-700">
                  Ứng tuyển
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button onClick={onStartClick}
                className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-3xl shadow-lg hover:bg-blue-700 transition-all duration-300">
          Xem thêm việc làm
        </button>
      </div>
    </section>
  );
};

export default FeaturedJobs;
