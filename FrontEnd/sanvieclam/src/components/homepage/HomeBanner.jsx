import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const suggestions = ["Front-end Developer", "Internship", "Remote", "Part-time", "Full-time"];

const HeroBanner = () => {
  return (
    <section className="relative w-full min-h-[750px] bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 overflow-hidden text-gray-900 flex items-center">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 px-4 py-12 pt-52 pb-48 items-center">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          className="relative flex flex-col justify-center space-y-6 max-w-lg self-center"
        >
          {/* BACKGROUND BLOCKS */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl blur-3xl opacity-30 z-0"></div>
          <div className="absolute top-20 -right-16 w-52 h-52 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full blur-2xl opacity-25 z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-300 to-purple-400 rounded-2xl blur-3xl opacity-20 z-0"></div>

          {/* TITLE */}
          <h1 className="relative text-3xl md:text-5xl font-extrabold leading-snug text-gray-900 drop-shadow-md z-10">
            Kết nối sinh viên với{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              cơ hội nghề nghiệp
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="relative text-base md:text-lg text-gray-700 drop-shadow-sm z-10">
            Nền tảng việc làm cho sinh viên: Thực tập, bán thời gian, fulltime và phát triển sự nghiệp.
            Khám phá cơ hội, kết nối nhà tuyển dụng và phát triển bản thân.
          </p>

          {/* Ô TÌM KIẾM */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: false, amount: 0.2 }}
            className="relative flex w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-3 md:p-4 gap-3 items-center z-10"
          >
            <Search className="w-6 h-6 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm công việc, ngành nghề, địa điểm..."
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base md:text-lg"
            />
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-2 rounded-2xl text-black font-semibold shadow hover:scale-105 transition">
              Tìm kiếm
            </button>
          </motion.div>

          {/* SUGGESTIONS */}
          <div className="relative flex flex-wrap gap-3 mt-3 z-10">
            {suggestions.map((s, idx) => (
              <motion.span
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + idx * 0.15, duration: 0.5 }}
                viewport={{ once: false, amount: 0.3 }}
                className="cursor-pointer px-4 py-1 rounded-full text-sm bg-white/30 hover:bg-white/50 transition font-medium backdrop-blur-sm"
              >
                #{s}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div className="relative w-full h-full flex justify-center items-center self-center">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-60 h-80 md:w-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl cursor-pointer border border-white/20 absolute"
              initial={{
                x: 200 * (i - 1),
                y: -100 * (i - 1),
                opacity: 0,
                rotate: i % 2 === 0 ? -10 : 10,
              }}
              whileInView={{
                x: (i - 2) * 220,
                y: (i - 2) * 70,
                opacity: 1,
                rotate: 0,
              }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
              style={{ zIndex: 3 - i }}
            >
              <motion.img
                src={`/logohomebanner${i}.png`}
                alt={`Slide ${i}`}
                className="w-full h-full object-cover"
                animate={{
                  x: [0, i % 2 === 0 ? -10 : 10, 0],
                  y: [0, -5, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
