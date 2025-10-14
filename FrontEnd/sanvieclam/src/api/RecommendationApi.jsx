import axiosClient from "./axiosClient";

/**
 * Gợi ý việc làm cho user đang đăng nhập (dựa theo userId)
 */
export const getSmartJobRecommendations = async (userId, topK) => {
  try {
    const response = await axiosClient.get(`/recommend/jobs/${userId}?topK=${topK}`);
    return response.data; // Danh sách JobMatchDto
  } catch (error) {
    console.error(`❌ Lỗi khi gọi API getSmartJobRecommendations(${userId}):`, error);
    throw error;
  }
};

/**
 * Đồng bộ toàn bộ jobs từ hệ thống chính sang Elasticsearch
 */
export const syncAllJobs = async () => {
  try {
    const response = await axiosClient.post(`/recommend/sync/jobs`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi đồng bộ job:", error);
    throw error;
  }
};