import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllPublicJobs, getEmployerById } from "../../api/JobApi";

const FeaturedJobs = ({ onStartClick, onJob }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobList = await getAllPublicJobs();
        console.log("JobList từ API:", jobList);

        const jobsWithEmployer = await Promise.all(
          (jobList || []).map(async (job) => {
            try {
              const employerRes = await getEmployerById(job.employerId);
              console.log("Employer:", employerRes);

              const employer = employerRes?.data || employerRes;

              return {
                ...job,
                companyName: employer?.companyName || "Công ty chưa cập nhật",
                location: job.location || employer?.address || "Chưa cập nhật",
              };
            } catch (error) {
              console.error("❌ Lỗi khi lấy employer:", error);
              return {
                ...job,
                companyName: "Công ty chưa cập nhật",
                location: job.location || "Chưa cập nhật",
              };
            }
          })
        );

        setJobs(jobsWithEmployer);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách job:", error);
      } finally {
        setLoading(false); // ✅ đảm bảo tắt loading
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 text-gray-900">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center">
          Việc làm nổi bật
        </h2>
        <p className="text-center text-gray-600">Đang tải dữ liệu...</p>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 text-gray-900">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center">
        Việc làm nổi bật
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
        {jobs.map((job, idx) => (
          <motion.div
            key={job.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: idx * 0.2,
              duration: 0.6,
              type: "spring",
              stiffness: 120,
            }}
            className="relative bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden hover:scale-105 hover:shadow-2xl transition-transform duration-300 flex flex-col"
          >
            {job.hot && (
              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-lg animate-pulse">
                Hot
              </div>
            )}

            <div className="h-44 w-full overflow-hidden">
              <img
                src={job.image || "/images/default-job.jpg"}
                alt={job.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-1">
                  {job.title}
                </h3>
                <span className="text-sm opacity-90">{job.companyName}</span>
                <p className="text-x text-gray-600">
                  📍 {job.location} | ⏰ {job.jobType}
                </p>
                <p className="text-x text-green-600 font-medium">
                  💰 {job.salary || "Thỏa thuận"}
                </p>
                {job.requirements?.skills && (
                  <p
                    className="text-x text-gray-700 truncate"
                    title={job.requirements.skills}
                  >
                    🛠 {job.requirements.skills}
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => onJob(job)}
                  className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl shadow-lg transition-all duration-300 hover:bg-blue-700"
                >
                  Ứng tuyển
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={onStartClick}
          className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-3xl shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          Xem thêm việc làm
        </button>
      </div>
    </section>
  );
};

export default FeaturedJobs;
