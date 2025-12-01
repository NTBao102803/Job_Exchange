// api/JobApi.ts
import axiosClient from "./axiosClient";

// ------------------------------
// Lấy danh sách job đã được duyệt (public)
// ------------------------------
export const getAllPublicJobs = async (): Promise<any[]> => {
  try {
    const response = await axiosClient.get("/jobs/public");
    return response.data; // trả về list bất kỳ (any[])
  } catch (error) {
    console.error("❌ Lỗi khi fetch jobs public:", error);
    throw error;
  }
};

// ------------------------------
// Lấy employer theo id
// ------------------------------
export const getEmployerById = async (id: string): Promise<any> => {
  try {
    const response = await axiosClient.get(`/employers/id/${id}`);
    return response.data; // trả về bất kỳ
  } catch (error) {
    console.error(`❌ Lỗi khi gọi API getEmployerById với id=${id}:`, error);
    throw error;
  }
};

// ------------------------------
// Lấy job theo id
// ------------------------------
export const getJobById = async (id: string): Promise<any> => {
  try {
    const response = await axiosClient.get(`/jobs/${id}`);
    return response.data; // trả về bất kỳ
  } catch (error) {
    console.error(`❌ Lỗi khi gọi API getJobById với id=${id}:`, error);
    throw error;
  }
};

// ------------------------------
// Lấy danh sách job theo trạng thái (pending, approved, etc.)
// ------------------------------
export const getAllPendingJobs = async (status: string): Promise<any[]> => {
  try {
    const response = await axiosClient.get(`/jobs/statusByEmployer/${status}`);
    return response.data; // trả về list bất kỳ
  } catch (error) {
    console.error(`❌ Lỗi khi fetch jobs theo status=${status}:`, error);
    throw error;
  }
};
