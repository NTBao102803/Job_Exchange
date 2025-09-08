import React from "react";
import { motion } from "framer-motion";
import { Search, Briefcase, BookOpen, Users } from "lucide-react";

const criteria = [
  { title: "Tìm việc nhanh chóng", icon: <Search className="w-8 h-8 text-yellow-500" /> },
  { title: "Cơ hội đa dạng", icon: <Briefcase className="w-8 h-8 text-blue-500" /> },
  { title: "Phát triển kỹ năng", icon: <BookOpen className="w-8 h-8 text-purple-500" /> },
  { title: "Kết nối nhà tuyển dụng", icon: <Users className="w-8 h-8 text-green-500" /> },
];

const JobCriteriaMini = () => {
  return (
    <section className="w-full py-16 flex justify-center bg-gray-50">
      <div className="max-w-4xl w-full grid grid-cols-2 sm:grid-cols-4 gap-6">
        {criteria.map((c, idx) => (
          <motion.div
            key={idx}
            initial={{ 
              x: idx % 2 === 0 ? -100 : 100, // chẵn bay từ trái, lẻ bay từ phải
              opacity: 0 
            }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }} // ❌ bỏ once:true để chạy lại mỗi lần lướt
            transition={{ delay: idx * 0.15, duration: 0.6, type: "spring", stiffness: 120 }}
            className="bg-white/70 backdrop-blur-md rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:scale-105 hover:shadow-lg transition-transform duration-300"
          >
            <div className="mb-3 p-3 rounded-full bg-white/30 flex items-center justify-center">
              {c.icon}
            </div>
            <h3 className="text-base font-semibold text-gray-800">{c.title}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default JobCriteriaMini;
