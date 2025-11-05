import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { getAllPublicJobs, getEmployerById } from "../../api/JobApi";

const FeaturedJobs = ({ onStartClick, onJob }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobList = await getAllPublicJobs();

        const jobsWithEmployer = await Promise.all(
          (jobList || []).map(async (job) => {
            try {
              const employerRes = await getEmployerById(job.employerId);
              const employer = employerRes?.data || employerRes;

              return {
                ...job,
                companyName: employer?.companyName || "Công ty chưa cập nhật",
                location: job.location || employer?.address || "Chưa cập nhật",
              };
            } catch (error) {
              return {
                ...job,
                companyName: "Công ty chưa cập nhật",
                location: job.location || "Chưa cập nhật",
              };
            }
          })
        );

        setJobs(jobsWithEmployer.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 text-gray-900">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center flex items-center justify-center gap-3 text-red-600">
          <Star className="w-10 h-10 text-red-600 animate-pulse" />
          Việc làm nổi bật
        </h2>
        <p className="text-center text-gray-600">Đang tải dữ liệu...</p>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-gradient-to-r from-gray-50 via-red-300 to-gray-50 text-gray-900">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center flex items-center justify-center gap-3 text-red-600">
        <Star className="w-10 h-10 text-red-600 animate-pulse" />
        Việc làm nổi bật
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
        {jobs.map((job, idx) => (
          <motion.div
            key={job.id}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: idx * 0.15,
              duration: 0.6,
              type: "spring",
              stiffness: 120,
            }}
            className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col"
          >
            
              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-lg animate-pulse z-10">
                HOT
              </div>
            

            {/* Image */}
            <div className="h-61 w-full overflow-hidden rounded-t-3xl">
              <img
                src={"/cvnoibat1.png"}
                alt={job.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 justify-between bg-white">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 truncate">
                  {job.title}
                </h3>
                <span className="text-sm text-indigo-600 font-medium mb-2 block truncate">
                  {job.companyName}
                </span>
                <p className="text-sm text-gray-600 mb-1">
                  📍 {job.location} | ⏰ {job.jobType}
                </p>
                <p className="text-sm font-semibold text-green-600 mb-2">
                  💰 {job.salary || "Thỏa thuận"}
                </p>
                {job.requirements?.skills && (
                  <p
                    className="text-sm text-gray-700 truncate"
                    title={job.requirements.skills}
                  >
                    🛠 {job.requirements.skills}
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => onJob(job)}
                  className="bg-red-500 text-white font-semibold py-2 px-4 rounded-2xl shadow-lg transition-all duration-300 hover:bg-red-600"
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
          className="bg-red-500 text-white font-semibold py-3 px-8 rounded-3xl shadow-lg hover:bg-indigo-700 transition-all duration-300"
        >
          Xem thêm việc làm
        </button>
      </div>
    </section>
  );
};

export default FeaturedJobs;
