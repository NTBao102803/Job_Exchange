import React, { useEffect, useState,useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Briefcase, CheckCircle2, ThumbsUp, XCircle,Clock } from "lucide-react";
import { getApplicationsByCandidate } from "../../api/ApplicationApi";
import { getAllPublicJobs } from "../../api/JobApi";

const suggestions = ["Front-end Developer", "Internship", "Remote", "Part-time", "Full-time"];

const HeroBanner = ({ onStartClick }) => {
   const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const [stats, setStats] = useState({
    totalApplications: 0,
    totalJobs: 0,
    approved: 0,
    matched: 0,
    notMatched: 0,
    pending: 0,
  });

  useEffect(() => {
    if (user?.role?.roleName === "USER") {
      fetchCandidateStats();
    }
  }, []);

  const fetchCandidateStats = async () => {
    try {
      const [appsRes, jobsRes] = await Promise.all([
        getApplicationsByCandidate(user.id),
        getAllPublicJobs(),
      ]);

      const applications = appsRes || [];
      const jobs = jobsRes|| [];
      console.log("Ứng dụng:", appsRes);
      console.log("Công việc:", jobs);
      const approved = applications.filter((a) => a.status != "PENDING").length;
      const matched = applications.filter((a) => a.status === "APPROVED").length;
      const notMatched = applications.filter((a) => a.status === "REJECTED").length;
      const pending = applications.filter((a) => a.status === "PENDING").length;


      setStats({
        totalApplications: applications.length,
        totalJobs: jobs.length,
        approved,
        matched,
        notMatched,
        pending,
      });
    } catch (err) {
      console.error("Lỗi tải thống kê:", err);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.2 }}
      className={`flex flex-col items-center justify-center bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-5 border border-white/40 hover:scale-105 transition ${color}`}
    >
      <Icon className="w-8 h-8 mb-2" />
      <h3 className="text-xl font-bold">{value}</h3>
      <p className="text-sm text-gray-700">{label}</p>
    </motion.div>
  );

  return (
    <section className="relative w-full min-h-[750px] bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 overflow-hidden text-gray-900 flex items-center">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 px-4 py-12 pt-40 pb-48 items-center">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          className="relative flex flex-col justify-center space-y-6 max-w-lg self-center"
        >
          {/* Background glow */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl blur-3xl opacity-30 z-0"></div>
          <div className="absolute top-20 -right-16 w-52 h-52 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full blur-2xl opacity-25 z-0"></div>

          {/* Title */}
          <h1 className="relative text-3xl md:text-5xl font-extrabold leading-snug text-gray-900 drop-shadow-md z-10">
            Kết nối sinh viên với{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              cơ hội nghề nghiệp
            </span>
          </h1>

          {/* Description */}
          <p className="relative text-base md:text-lg text-gray-700 drop-shadow-sm z-10">
            Nền tảng việc làm cho sinh viên: Thực tập, bán thời gian, fulltime và phát triển sự nghiệp.
            Khám phá cơ hội, kết nối nhà tuyển dụng và phát triển bản thân.
          </p>

          {user?.role?.roleName === "USER" ? (
            // 🎯 Candidate Stats Section
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 z-10 mt-6">
              <StatCard icon={Briefcase} label="Đã nộp CV" value={stats.totalApplications} color="text-blue-600" />
              <StatCard icon={CheckCircle2} label="Được duyệt" value={stats.approved} color="text-green-600" />
              <StatCard icon={Clock} label="Đang chờ duyệt" value={stats.pending} color="text-yellow-600"/>
              <StatCard icon={ThumbsUp} label="Phù hợp" value={stats.matched} color="text-yellow-600" />
              <StatCard icon={XCircle} label="Không phù hợp" value={stats.notMatched} color="text-red-600" />
              <StatCard icon={Briefcase} label="Tổng công việc" value={stats.totalJobs} color="text-purple-600 col-span-2 sm:col-span-1" />
            </div>
          ) : (
            // 🔍 Search Box (default)
            <>
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
                <button
                  onClick={onStartClick}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-2 rounded-2xl text-black font-semibold shadow hover:scale-105 transition"
                >
                  Tìm kiếm
                </button>
              </motion.div>

              {/* Suggestions */}
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
            </>
          )}
        </motion.div>

        {/* RIGHT SIDE (giữ nguyên hình ảnh động) */}
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
