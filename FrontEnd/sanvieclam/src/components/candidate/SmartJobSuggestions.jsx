import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const smartJobs = [
  {
    title: "AI Engineer",
    company: "FutureAI Labs",
    salary: "25 - 35 triệu",
    skills: "Python, TensorFlow, ML",
    match: "95%",
    image: "/images/ai-job1.jpg",
  },
  {
    title: "Data Scientist",
    company: "Insight Global",
    salary: "22 - 30 triệu",
    skills: "R, Python, SQL",
    match: "90%",
    image: "/images/ai-job2.jpg",
  },
  {
    title: "Cloud Architect",
    company: "SkyNet Cloud",
    salary: "30 - 40 triệu",
    skills: "AWS, Kubernetes, Terraform",
    match: "88%",
    image: "/images/ai-job3.jpg",
  },
  {
    title: "Product Manager",
    company: "NextVision",
    salary: "20 - 28 triệu",
    skills: "Agile, Jira, Leadership",
    match: "85%",
    image: "/images/ai-job4.jpg",
  },
];

const SmartJobSuggestions = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full py-20 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center flex items-center justify-center gap-3">
        <Sparkles className="w-8 h-8 text-yellow-300 animate-spin-slow" />
        Gợi ý việc làm thông minh
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        {smartJobs.map((job, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2, duration: 0.7, type: "spring", stiffness: 100 }}
            className="relative bg-white/20 backdrop-blur-2xl rounded-3xl overflow-hidden 
                       border border-white/30 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] 
                       transition-transform duration-300 flex flex-col"
          >
            <div className="h-44 w-full overflow-hidden">
              <img
                src={job.image}
                alt={job.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>

            <div className="p-5 flex flex-col flex-1 justify-between text-white">
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-1">{job.title}</h3>
                <span className="text-sm opacity-90">{job.company}</span>
                <div className="text-sm font-medium mt-2 text-yellow-300">{job.salary}</div>
                <div className="mt-3 text-xs space-y-1">
                  <div><span className="font-semibold">Kỹ năng:</span> {job.skills}</div>
                  <div>
                    <span className="font-semibold">Phù hợp: </span>
                    <span className="text-green-300 font-bold">{job.match}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button onClick={() =>
                      navigate(`/candidate/jobs/${job.id}`, { state: { job } })
                    }
                        className="bg-yellow-400 text-gray-900 font-bold py-2 px-5 rounded-2xl shadow-lg 
                                   hover:bg-yellow-300 transition-all duration-300">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <button onClick={() => navigate("/candidate/dashboard-smartjobsuggestionslist")}
                className="bg-white text-pink-600 font-bold py-3 px-10 rounded-3xl shadow-lg 
                           hover:bg-pink-100 transition-all duration-300">
          Xem thêm gợi ý
        </button>
      </div>
    </section>
  );
};

export default SmartJobSuggestions;
