// src/components/RecruiterSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Sparkles } from "lucide-react";

const RecruiterSection = () => {
  return (
    <section className="relative w-full min-h-[700px] bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex items-center overflow-hidden">
      <div className="absolute inset-0">
        {/* Hiệu ứng background khối sáng */}
        <div className="absolute top-10 left-20 w-72 h-72 bg-green-400/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-10 right-32 w-96 h-96 bg-cyan-400/20 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 px-6 py-24 relative z-10">
        {/* LEFT: TEXT */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col justify-center space-y-6"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold leading-snug">
            Tiếp cận{" "}
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              tài năng trẻ
            </span>{" "}
            – Xây dựng{" "}
            <span className="text-cyan-300">tương lai doanh nghiệp</span>
          </h2>

          <p className="text-base md:text-lg text-gray-300 max-w-xl leading-relaxed">
            Nhà tuyển dụng có thể dễ dàng tìm kiếm, sàng lọc và kết nối với
            những sinh viên giỏi nhất.  
            Nổi bật thương hiệu tuyển dụng, rút ngắn quy trình, và thu hút nhân tài phù hợp.
          </p>

          <div className="flex gap-4 mt-4">
            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-400 to-cyan-400 text-black font-semibold shadow hover:scale-105 transition">
              Đăng tuyển ngay
            </button>
            <button className="px-6 py-3 rounded-2xl border border-cyan-400/50 hover:bg-cyan-400/10 transition">
              Tìm ứng viên
            </button>
          </div>
        </motion.div>

        {/* RIGHT: ANIMATION CARDS */}
<motion.div
  initial={{ x: 200, opacity: 0 }}
  whileInView={{ x: 0, opacity: 1 }}
  transition={{ duration: 1 }}
  className="relative w-full flex justify-center items-center"
>
  {[
    { icon: Briefcase, title: "Tin tuyển dụng", desc: "Đăng tuyển dễ dàng, tiếp cận hàng nghìn sinh viên." },
    { icon: Users, title: "Ứng viên chất lượng", desc: "CV AI hiện đại, gợi ý ứng viên phù hợp." },
    { icon: Sparkles, title: "Thương hiệu tuyển dụng", desc: "Nâng tầm hình ảnh công ty trước thế hệ trẻ." },
  ].map((item, i) => (
    <motion.div
      key={i}
      initial={{ y: 100, opacity: 0, scale: 0.9 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 * i, duration: 0.8 }}
      whileHover={{ scale: 1.05 }}
      className="absolute w-64 md:w-72 p-6 rounded-3xl bg-gray-800/80 border border-gray-700 backdrop-blur-lg shadow-xl cursor-pointer"
      style={{
        top: i * 110, // khoảng cách giữa các card (70px)
        left: i * 190, // lệch ngang chút xíu
        zIndex: 10 - i,
      }}
    >
      <item.icon className="w-10 h-10 text-cyan-300 mb-3" />
      <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
    </motion.div>
  ))}
</motion.div>

      </div>
    </section>
  );
};

export default RecruiterSection;
