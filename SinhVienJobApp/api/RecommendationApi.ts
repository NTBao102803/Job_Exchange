import axiosClient from "./axiosClient";

/**
 * Gợi ý việc làm cho user đang đăng nhập (dựa theo userId)
 */
export const getSmartJobRecommendations = async (
  userId: string | number,
  topK: number
): Promise<any[]> => {
  try {
    const response = await axiosClient.get(`/recommend/jobs/${userId}?topK=${topK}`);
    return response.data; // Danh sách jobs, type any[]
  } catch (error) {
    console.error(`❌ Lỗi khi gọi API getSmartJobRecommendations(${userId}):`, error);
    throw error;
  }
};

/**
 * Đồng bộ toàn bộ jobs từ hệ thống chính sang Elasticsearch
 */
export const syncAllJobs = async (): Promise<any> => {
  try {
    const response = await axiosClient.post(`/recommend/sync/jobs`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi đồng bộ job:", error);
    throw error;
  }
};

/**
 * Lấy danh sách ứng viên phù hợp cho jobId
 */
export const getCandidatesForJob = async (
  jobId: string | number,
  topK: number
): Promise<any[]> => {
  try {
    const response = await axiosClient.get(`/recommend/candidates/${jobId}?topK=${topK}`);
    return response.data; // Danh sách candidates, type any[]
  } catch (error) {
    console.error(`❌ Lỗi khi gọi API getCandidatesForJob(${jobId}):`, error);
    throw error;
  }
};

/**
 * Đồng bộ tất cả candidate từ MariaDB -> Elasticsearch
 */
export const syncAllCandidates = async (): Promise<any> => {
  try {
    const response = await axiosClient.post(`/recommend/sync/candidates`);
    return response.data; // "Synced candidates into Elasticsearch!"
  } catch (error) {
    console.error("❌ Lỗi khi gọi API syncAllCandidates:", error);
    throw error;
  }
};
