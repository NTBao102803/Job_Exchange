import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
} from "lucide-react";
import { getAllJobsByEmail } from "../../api/RecruiterApi";
import { getApplicationsByJob } from "../../api/ApplicationApi";

const HeroBanner = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    approvedJobs: 0,
    pendingJobs: 0,
    successJobs: 0,
    failedJobs: 0,
    totalApplicants: 0,
  });

  useEffect(() => {
    fetchRecruiterStats();
  }, []);

  const fetchRecruiterStats = async () => {
    try {
      // 🧭 Lấy tất cả job của recruiter
      const jobsRes = await getAllJobsByEmail();
      const jobs = jobsRes || [];
      console.log("Jobs của recruiter:", jobs);
      // 🧮 Tính trạng thái job
      const approved = jobs.filter((j) => j.status != "PENDING").length;
      const pending = jobs.filter((j) => j.status === "PENDING").length;
      const success = jobs.filter((j) => j.status === "APPROVED").length;
      const failed = jobs.filter((j) => j.status === "REJECTED").length;

      // 🧩 Lấy toàn bộ ứng viên theo job.id
      let totalApplicants = 0;
      for (const job of jobs) {
        try {
          const appsRes = await getApplicationsByJob(job.id);
          totalApplicants += appsRes?.length || 0;
        } catch {
          console.warn(`⚠️ Không lấy được ứng viên cho job ${job.id}`);
        }
      }

      setStats({
        totalJobs: jobs.length,
        approvedJobs: approved,
        pendingJobs: pending,
        successJobs: success,
        failedJobs: failed,
        totalApplicants,
      });
    } catch (err) {
      console.error("Lỗi tải dữ liệu recruiter:", err);
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
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 px-4 py-12 pt-36 pb-48 items-center">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          className="relative flex flex-col justify-center space-y-6 max-w-lg self-center"
        >
          {/* Hiệu ứng nền */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl blur-3xl opacity-30 z-0"></div>
          <div className="absolute top-20 -right-16 w-52 h-52 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full blur-2xl opacity-25 z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-300 to-purple-400 rounded-2xl blur-3xl opacity-20 z-0"></div>

          {/* Tiêu đề */}
          <h1 className="relative text-3xl md:text-5xl font-extrabold leading-snug text-gray-900 drop-shadow-md z-10">
            Kết nối sinh viên với{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              cơ hội nghề nghiệp
            </span>
          </h1>

          {/* Mô tả */}
          <p className="relative text-base md:text-lg text-gray-700 drop-shadow-sm z-10">
            Nền tảng tuyển dụng việc làm cho sinh viên: Thực tập, bán thời gian, fulltime và phát triển sự nghiệp. Khám phá cơ hội, kết nối nhà tuyển dụng với các sinh viên.
          </p>

          {/* Ô thống kê */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 z-10 mt-6">
            <StatCard
              icon={Briefcase}
              label="Công việc đã đăng"
              value={stats.totalJobs}
              color="text-blue-600"
            />
            <StatCard
              icon={CheckCircle2}
              label="Đã được duyệt"
              value={stats.approvedJobs}
              color="text-green-600"
            />
            <StatCard
              icon={Clock}
              label="Đang chờ duyệt"
              value={stats.pendingJobs}
              color="text-yellow-600"
            />
            <StatCard
              icon={CheckCircle2}
              label="Duyệt thành công"
              value={stats.successJobs}
              color="text-indigo-600"
            />
            <StatCard
              icon={XCircle}
              label="Duyệt thất bại"
              value={stats.failedJobs}
              color="text-red-600"
            />
            <StatCard
              icon={Users}
              label="Ứng viên đã ứng tuyển"
              value={stats.totalApplicants}
              color="text-purple-600"
            />
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
