import axiosClient from "./axiosClient";

// Lấy danh sách ứng viên phù hợp cho jobId
export const getCandidatesForJob = async (jobId) => {
  try {
    const response = await axiosClient.get(`/match/job/${jobId}`, jobId);
    return response.data; // Danh sách CandidateMatchDto
  } catch (error) {
    console.error(`❌ Lỗi khi gọi API getCandidatesForJob(${jobId}):`, error);
    throw error;
  }
};

// Đồng bộ tất cả candidate từ MariaDB -> Elasticsearch
export const syncAllCandidates = async () => {
  try {
    const response = await axiosClient.post(`/match/sync/all`);
    return response.data; // "Synced candidates into Elasticsearch!"
  } catch (error) {
    console.error("❌ Lỗi khi gọi API syncAllCandidates:", error);
    throw error;
  }
};