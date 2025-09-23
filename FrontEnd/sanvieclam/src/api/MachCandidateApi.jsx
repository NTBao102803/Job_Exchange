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