import React, { useEffect, useState, useMemo } from "react";
import {
  Briefcase,
  PieChart,
  BarChart3,
  TrendingUp,
  MapPin,
  Layers,
} from "lucide-react";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import WordCloud from "react-d3-cloud";
import { getAllJobs } from "../../api/AdminApi";

const AdminJobReport = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllJobs();
        setJobs(res || []);
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu công việc:", err);
      }
    };
    fetchData();
  }, []);

  // 🟩 1. Thẻ tổng quan
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "ACTIVE").length;
  const expiredJobs = jobs.filter((j) => j.status === "EXPIRED").length;
  const hiddenJobs = jobs.filter((j) => j.status === "HIDDEN").length;

  // 🟩 2. Top ngành nghề phổ biến
  const industryData = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      const field = job.industry || "Khác";
      map[field] = (map[field] || 0) + 1;
    });
    const top = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 7);
    return {
      labels: top.map(([key]) => key),
      datasets: [
        {
          label: "Ngành nghề",
          data: top.map(([, val]) => val),
          backgroundColor: [
            "#3B82F6",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
            "#14B8A6",
            "#A855F7",
          ],
        },
      ],
    };
  }, [jobs]);

  // 🟩 3. Khu vực tuyển dụng
  const locationData = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      const loc = job.location || "Khác";
      map[loc] = (map[loc] || 0) + 1;
    });
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return {
      labels: sorted.map(([key]) => key),
      datasets: [
        {
          data: sorted.map(([, val]) => val),
          backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#A855F7"],
        },
      ],
    };
  }, [jobs]);

  // 🟩 4. Phân loại theo hình thức làm việc
  const typeData = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      const type = job.type || "Khác"; // Fulltime, Parttime, Remote...
      map[type] = (map[type] || 0) + 1;
    });
    return {
      labels: Object.keys(map),
      datasets: [
        {
          data: Object.values(map),
          backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"],
        },
      ],
    };
  }, [jobs]);

  // 🟩 5. Mức lương trung bình
  const salaryData = useMemo(() => {
    const ranges = [
      { label: "< 10 triệu", min: 0, max: 10 },
      { label: "10–20 triệu", min: 10, max: 20 },
      { label: "20–30 triệu", min: 20, max: 30 },
      { label: "30–50 triệu", min: 30, max: 50 },
      { label: "> 50 triệu", min: 50, max: 999 },
    ];
    const counts = Array(ranges.length).fill(0);
    jobs.forEach((job) => {
      const avg =
        ((job.salary_min || 0) + (job.salary_max || 0)) / 2 / 1000000; // triệu
      const idx = ranges.findIndex((r) => avg >= r.min && avg < r.max);
      if (idx >= 0) counts[idx]++;
    });
    return {
      labels: ranges.map((r) => r.label),
      datasets: [
        {
          label: "Mức lương (triệu VNĐ)",
          data: counts,
          backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"],
        },
      ],
    };
  }, [jobs]);

  // 🟩 6. WordCloud – từ khóa phổ biến
  const wordData = useMemo(() => {
    const map = {};
    jobs.forEach((j) => {
      (j.title || "")
        .split(" ")
        .filter((w) => w.length > 2)
        .forEach((w) => {
          const key = w.toLowerCase();
          map[key] = (map[key] || 0) + 1;
        });
    });
    return Object.entries(map)
      .map(([text, value]) => ({ text, value }))
      .filter((w) => w.value > 1);
  }, [jobs]);

  // 🧭 UI Render
  return (
    <div className="p-6 space-y-8 h-[calc(100vh-80px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
      <h1 className="flex items-center gap-2 text-3xl font-bold text-indigo-600">
        <Briefcase /> Báo cáo tuyển dụng
      </h1>

      {/* 🧊 Thẻ tổng quan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Tổng việc làm", value: totalJobs, color: "bg-blue-500" },
          { title: "Đang tuyển", value: activeJobs, color: "bg-green-500" },
          { title: "Hết hạn", value: expiredJobs, color: "bg-yellow-500" },
          { title: "Đang ẩn", value: hiddenJobs, color: "bg-red-500" },
        ].map((card, i) => (
          <div
            key={i}
            className={`rounded-xl text-white ${card.color} p-5 shadow-lg flex flex-col justify-center`}
          >
            <span className="text-sm opacity-80">{card.title}</span>
            <span className="text-3xl font-bold">{card.value}</span>
          </div>
        ))}
      </div>

      {/* 🔶 Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="flex items-center gap-2 mb-3 text-gray-700 font-semibold">
            <BarChart3 size={18} /> Top ngành nghề
          </h3>
          <Bar data={industryData} options={{ indexAxis: "y" }} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="flex items-center gap-2 mb-3 text-gray-700 font-semibold">
            <MapPin size={18} /> Khu vực tuyển dụng
          </h3>
          <Pie data={locationData} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="flex items-center gap-2 mb-3 text-gray-700 font-semibold">
            <Layers size={18} /> Hình thức làm việc
          </h3>
          <Doughnut data={typeData} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="flex items-center gap-2 mb-3 text-gray-700 font-semibold">
            <TrendingUp size={18} /> Phân bố mức lương
          </h3>
          <Bar data={salaryData} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow col-span-1 lg:col-span-2">
          <h3 className="flex items-center gap-2 mb-3 text-gray-700 font-semibold">
            <Briefcase size={18} /> Từ khóa tuyển dụng phổ biến
          </h3>
          <div className="w-full h-[320px] flex justify-center items-center">
            <WordCloud
              data={wordData}
              font="sans-serif"
              fontSize={(word) => Math.log2(word.value) * 8 + 16}
              rotate={() => (Math.random() > 0.5 ? 0 : 90)}
              padding={2}
              width={600}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobReport;
