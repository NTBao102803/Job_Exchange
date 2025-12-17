import axiosClient from "./axiosClient";

/**
 * ===============================
 * JOB RECOMMENDATION
 * ===============================
 */

/**
 * Gợi ý việc làm cho user đang đăng nhập (dựa theo userId)
 * GET /api/recommend/jobs/{userId}?topK=10
 */
export const getSmartJobRecommendations = async (
  userId: string | number,
  topK: number = 10
): Promise<any[]> => {
  try {
    const response = await axiosClient.get(
      `/recommend/jobs/${userId}`,
      {
        params: { topK }
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Lỗi khi gọi API getSmartJobRecommendations(${userId}):`,
      error
    );
    throw error;
  }
};

/**
 * Gợi ý việc làm từ profile gửi trực tiếp
 * POST /api/recommend/jobs?topK=10
 */
export const recommendJobsFromProfile = async (
  candidateProfile: any,
  topK: number = 10
): Promise<any[]> => {
  try {
    const response = await axiosClient.post(
      `/recommend/jobs`,
      candidateProfile,
      {
        params: { topK }
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi gọi API recommendJobsFromProfile:", error);
    throw error;
  }
};

/**
 * ===============================
 * SYNC JOB TO ELASTICSEARCH
 * ===============================
 */

/**
 * Đồng bộ toàn bộ jobs từ hệ thống chính sang Elasticsearch
 * POST /api/recommend/sync/jobs
 */
export const syncAllJobs = async (): Promise<string> => {
  try {
    const response = await axiosClient.post(`/recommend/sync/jobs`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi đồng bộ tất cả jobs:", error);
    throw error;
  }
};

/**
 * Đồng bộ 1 job theo ID
 * POST /api/recommend/sync/job/{id}
 */
export const syncJobById = async (
  jobId: string | number
): Promise<string> => {
  try {
    const response = await axiosClient.post(
      `/recommend/sync/job/${jobId}`
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi sync job ${jobId}:`, error);
    throw error;
  }
};
