import axiosClient from "./axiosClient";

// Hàm để phê duyệt (approve) một employer
export const approveEmployer = async (id, authUserId) => {
  try {
    const response = await axiosClient.put(`/admin/employers/${id}/approve?authUserId=${authUserId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi phê duyệt employer id=${id}:`, error);
    throw error;
  }
};

// Hàm để từ chối (reject) một employer
export const rejectEmployer = async (id) => {
  try {
    const response = await axiosClient.put(`/admin/employers/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi từ chối employer id=${id}:`, error);
    throw error;
  }
};

// Lấy tất cả job
export const getAllJobs = async () => {
  try {
    const response = await axiosClient.get("/admin/jobs");
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách jobs:", error);
    throw error;
  }
};

// Lấy job theo status
export const getJobsByStatus = async (status) => {
  try {
    const response = await axiosClient.get(`/admin/jobs/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi lấy jobs theo status=${status}:`, error);
    throw error;
  }
};

// Lấy job pending
export const getPendingJobs = async () => {
  try {
    const response = await axiosClient.get("/admin/jobs/pending");
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy jobs pending:", error);
    throw error;
  }
};

// Phê duyệt job
export const approveJob = async (id) => {
  try {
    const response = await axiosClient.post(`/admin/jobs/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi phê duyệt job id=${id}:`, error);
    throw error;
  }
};

// Từ chối job (có thể kèm lý do)
export const rejectJob = async (id, reason) => {
  try {
    const response = await axiosClient.post(`/admin/jobs/${id}/reject`, 
      reason ? { reason } : {}
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi từ chối job id=${id}:`, error);
    throw error;
  }
};