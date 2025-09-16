import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  ArrowLeft,
} from "lucide-react";

const JobDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(state?.job || null);

  useEffect(() => {
    if (!job) {
      // fetch(`/api/jobs/${id}`).then(res => res.json()).then(setJob);
    }
  }, [id, job]);

  if (!job) {
    return (
      <div className="pt-32 text-center">
        <p className="text-gray-600">Không tìm thấy thông tin công việc.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg"
        >
          Quay lại
        </button>
      </div>
    );
  }

  // Helper function hiển thị fallback
  const displayValue = (val) =>
    val && val !== "" ? val : "Chưa có thông tin";

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-10 border border-gray-200">
          {/* Header */}
          <h1 className="text-3xl font-bold text-indigo-700">
            {displayValue(job.title)}
          </h1>
          <p className="text-lg text-gray-600 mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />{" "}
            {displayValue(job.company)}
          </p>

          {/* Thông tin nhanh */}
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-gray-700">
            <p className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />{" "}
              {displayValue(job.location)}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />{" "}
              {displayValue(job.type)}
            </p>
            <p className="flex items-center gap-2 text-green-600 font-medium">
              <DollarSign className="w-5 h-5" /> {displayValue(job.salary)}
            </p>
          </div>

          {/* Nội dung */}
          <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
            {/* Mô tả */}
            <div>
              <h2 className="text-xl font-semibold text-indigo-600">
                📝 Mô tả công việc
              </h2>
              <p className="mt-2">{displayValue(job.description)}</p>
            </div>

            {/* Yêu cầu */}
            <div>
              <h2 className="text-xl font-semibold text-indigo-600">
                ✅ Yêu cầu ứng viên
              </h2>
              {job.requirements && job.requirements.length > 0 ? (
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-gray-500">Chưa có thông tin</p>
              )}
            </div>

            {/* Quyền lợi */}
            <div>
              <h2 className="text-xl font-semibold text-indigo-600">
                🎁 Quyền lợi
              </h2>
              {job.benefits && job.benefits.length > 0 ? (
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  {job.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-gray-500">Chưa có thông tin</p>
              )}
            </div>

            {/* Liên hệ */}
            <div>
              <h2 className="text-xl font-semibold text-indigo-600">
                📞 Thông tin liên hệ
              </h2>
              <p className="mt-2">
                Người liên hệ:{" "}
                <span className="font-medium">
                  {displayValue(job.contactName)}
                </span>
              </p>
              <p>
                Email:{" "}
                <span className="font-medium">
                  {displayValue(job.contactEmail)}
                </span>
              </p>
              <p>
                SĐT:{" "}
                <span className="font-medium">
                  {displayValue(job.contactPhone)}
                </span>
              </p>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="mt-10 flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 flex items-center gap-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow hover:from-indigo-600 hover:to-purple-600 transition font-medium">
              Ứng tuyển ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
