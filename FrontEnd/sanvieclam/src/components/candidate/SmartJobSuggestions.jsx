import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import {
  getSmartJobRecommendations,
  syncAllJobs,
} from "../../api/RecommendationApi";
import { getEmployerById } from "../../api/JobApi";

const SmartJobSuggestions = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]); // ✅ danh sách job gợi ý
  const [loading, setLoading] = useState(false);

  // ✅ Lấy userId từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // ✅ Auto sync khi mở trang
  useEffect(() => {
    const autoSync = async () => {
      try {
        setLoading(true);
        await syncAllJobs();
        console.log("✅ Đồng bộ job thành công!");

        if (userId) {
          await fetchRecommendedJobs();
        } else {
          console.warn("⚠️ Không tìm thấy userId trong localStorage");
        }
      } catch (err) {
        console.error("❌ Lỗi khi auto sync job:", err);
      } finally {
        setLoading(false);
      }
    };
    autoSync();
  }, []);

  // ✅ Hàm lấy danh sách job gợi ý (kèm dữ liệu chi tiết)
  const fetchRecommendedJobs = async () => {
    setLoading(true);
    try {
      console.log(`🚀 Gọi API getSmartJobRecommendations(${userId})`);
      const res = await getSmartJobRecommendations(userId, 10);

      console.log("📦 Response từ API:", res);

      // Duyệt qua từng job, đồng thời gọi thêm API lấy thông tin employer
      const mappedJobs = await Promise.all(
        res.map(async (item, index) => {
          const job = item.job || {};
          const requirements = job.requirements || {};
          let companyName = "Không rõ công ty";

          // ✅ Nếu có employerId → gọi API lấy thông tin công ty
          if (job.employerId) {
            try {
              const employer = await getEmployerById(job.employerId);
              console.log("📦 Response employer:", employer);
              companyName =
                employer?.companyName ||
                employer?.company ||
                `Công ty ID ${job.employerId}`;
            } catch (error) {
              console.warn(`⚠️ Lỗi lấy employer ${job.employerId}:`, error);
            }
          }

          return {
            id: job.id,
            title: job.title || "Chưa có tiêu đề",
            company: companyName,
            location: job.location || "Không rõ",
            salary: job.salary || "Thỏa thuận",
            jobType: job.jobType || "Fulltime",
            match: item.score ? `${(item.score * 100).toFixed(1)}%` : "N/A",
            skills: Array.isArray(requirements.skills)
              ? requirements.skills.join(", ")
              : "Không có kỹ năng yêu cầu",
            image: `/images/ai-job${(index % 4) + 1}.jpg`, // ✅ ảnh ngẫu nhiên 1–4
            jobDetail: { ...job, companyName },
          };
        })
      );

      console.log("📌 mappedJobs (đã có companyName):", mappedJobs);
      setJobs(mappedJobs);
    } catch (err) {
      console.error("❌ Lỗi load job recommendations:", err);

      if (err.response) {
        console.error("❌ Error status:", err.response.status);
        console.error("❌ Error data:", err.response.data);
      } else if (err.request) {
        console.error("❌ Không nhận được response từ server:", err.request);
      } else {
        console.error("❌ Lỗi khi setup request:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Hiển thị loading
  if (loading) {
    return (
      <section className="w-full py-20 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white text-center">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
        </div>
        <p className="mt-4 text-lg">Đang tải gợi ý việc làm...</p>
      </section>
    );
  }

  return (
    <section className="w-full py-20 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center flex items-center justify-center gap-3">
        <Sparkles className="w-8 h-8 text-yellow-300 animate-spin-slow" />
        Gợi ý việc làm thông minh
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        {jobs.slice(0, 4).map((job, idx) => (
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
            <div className="h-60 w-full overflow-hidden">
              <img
                src={"/cvphuhop.png"}
                alt={job.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>

            <div
              className="p-5 flex flex-col text-white flex-1 bg-gradient-to-br from-pink-500/20 to-purple-500/10 
                rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 min-h-[250px]"
            >
              {/* Nội dung chính */}
              <div className="flex flex-col flex-grow justify-start space-y-2">
                {/* Tiêu đề */}
                <h3 className="text-xl font-bold line-clamp-1 leading-tight max-w-[250px] text-white">
                  {job.title}
                </h3>

                {/* Tên công ty */}
                <p className="text-base text-yellow-200 font-medium line-clamp-1 max-w-[350px]">
                  {job.company}
                </p>

                {/* Lương */}
                <p className="text-sm md:text-base font-semibold text-yellow-300 max-w-[350px]">
                  💰 {job.salary}
                </p>

                {/* Địa điểm + loại hình */}
                <p className="text-sm opacity-90 line-clamp-1 max-w-[350px]">
                  📍 {job.location} | ⏰ {job.jobType}
                </p>

                {/* Kỹ năng */}
                <p
                  className="text-sm text-gray-200 leading-snug line-clamp-1 max-w-[350px]"
                  title={job.skills}
                >
                  <span className="font-semibold text-white">Kỹ năng:</span>{" "}
                  {job.skills}
                </p>

                {/* Phù hợp */}
                <p className="text-sm">
                  <span className="font-semibold text-white">Phù hợp:</span>{" "}
                  <span className="text-green-300 font-bold">{job.match}</span>
                </p>
              </div>

              {/* Nút xem chi tiết - gần hơn */}
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() =>
                    navigate(`/candidate/jobs/${job.id}`, {
                      state: { job: job.jobDetail },
                    })
                  }
                  className="bg-yellow-400 text-gray-900 font-bold text-base py-2.5 px-6 rounded-full shadow-lg 
                 hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nút xem thêm */}
      {jobs.length > 4 && (
        <div className="mt-14 flex justify-center">
          <button
            onClick={() =>
              navigate("/candidate/dashboard-smartjobsuggestionslist")
            }
            className="bg-white text-pink-600 font-bold py-3 px-10 rounded-3xl shadow-lg 
                       hover:bg-pink-100 transition-all duration-300"
          >
            Xem thêm gợi ý
          </button>
        </div>
      )}
    </section>
  );
};

export default SmartJobSuggestions;