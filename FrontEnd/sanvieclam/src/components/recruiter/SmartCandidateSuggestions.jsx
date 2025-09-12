import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const smartCandidates = [
  {
    name: "Nguyễn Văn A",
    position: "Frontend Developer",
    skills: "ReactJS, TailwindCSS, JavaScript",
    experience: "2 năm",
    match: "95%",
    image: "/images/candidate1.jpg",
  },
  {
    name: "Trần Thị B",
    position: "UI/UX Designer",
    skills: "Figma, Adobe XD, Design System",
    experience: "3 năm",
    match: "92%",
    image: "/images/candidate2.jpg",
  },
  {
    name: "Phạm Văn C",
    position: "Backend Developer",
    skills: "Java, Spring Boot, MySQL",
    experience: "2.5 năm",
    match: "89%",
    image: "/images/candidate3.jpg",
  },
  {
    name: "Lê Thị D",
    position: "Data Analyst",
    skills: "SQL, Power BI, Python",
    experience: "1.5 năm",
    match: "87%",
    image: "/images/candidate4.jpg",
  },
];

const SmartCandidateSuggestions = () => {
  return (
    <section className="w-full py-20 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 text-white">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center flex items-center justify-center gap-3">
        <Sparkles className="w-8 h-8 text-yellow-300 animate-spin-slow" />
        Gợi ý ứng viên thông minh
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        {smartCandidates.map((candidate, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: idx * 0.2,
              duration: 0.7,
              type: "spring",
              stiffness: 100,
            }}
            className="relative bg-white/20 backdrop-blur-2xl rounded-3xl overflow-hidden 
                       border border-white/30 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] 
                       transition-transform duration-300 flex flex-col"
          >
            <div className="h-44 w-full overflow-hidden">
              <img
                src={candidate.image}
                alt={candidate.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>

            <div className="p-5 flex flex-col flex-1 justify-between text-white">
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-1">
                  {candidate.name}
                </h3>
                <span className="text-sm opacity-90">
                  {candidate.position}
                </span>
                <div className="mt-3 text-xs space-y-1">
                  <div>
                    <span className="font-semibold">Kỹ năng: </span>
                    {candidate.skills}
                  </div>
                  <div>
                    <span className="font-semibold">Kinh nghiệm: </span>
                    {candidate.experience}
                  </div>
                  <div>
                    <span className="font-semibold">Phù hợp: </span>
                    <span className="text-green-300 font-bold">
                      {candidate.match}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button className="bg-yellow-400 text-gray-900 font-bold py-2 px-5 rounded-2xl shadow-lg 
                                   hover:bg-yellow-300 transition-all duration-300">
                  Xem hồ sơ
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <button className="bg-white text-indigo-600 font-bold py-3 px-10 rounded-3xl shadow-lg 
                           hover:bg-indigo-100 transition-all duration-300">
          Xem thêm ứng viên
        </button>
      </div>
    </section>
  );
};

export default SmartCandidateSuggestions;
