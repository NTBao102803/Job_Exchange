import React from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";

const CvAiBanner = () => {
  return (
    <section className="relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 px-6 overflow-hidden">
      {/* Hiệu ứng background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-white blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 0.1, y: 0 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-pink-400 blur-3xl"
      />

      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Tạo <span className="text-yellow-300">CV AI</span> chuyên nghiệp <br />
            chỉ trong vài phút ✨
          </h1>
          <p className="text-lg text-gray-200">
            Sử dụng sức mạnh của trí tuệ nhân tạo để tạo ra CV nổi bật,
            thu hút nhà tuyển dụng ngay từ cái nhìn đầu tiên.
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-2xl bg-yellow-400 text-gray-900 font-semibold shadow-lg hover:bg-yellow-300 transition"
            onClick={() => window.location.href = "/login"}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Bắt đầu ngay
            </div>
          </motion.button>
        </motion.div>

        {/* Hình minh họa CV */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-80 mx-auto text-gray-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
              <h2 className="font-bold text-xl">CV AI</h2>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Tên: <span className="font-medium">Nguyễn Văn A</span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Vị trí: <span className="font-medium">Frontend Developer</span>
            </p>
            <p className="text-sm text-gray-600">
              Kỹ năng: React, Tailwind, Node.js
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CvAiBanner;
