import axiosClient from "./axiosClient";

// lấy danh sách job theo status
export const getAllJobsStatus = async (status) => {
  try {
    const response = await axiosClient.get(`/jobs/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi gọi API getAllJobsStatus(${status}):`, error);
    throw error;
  }
};

// Lấy employer theo id
export const getEmployerById = async (id) => {
  try {
    const response = await axiosClient.get(`/employers/id/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi gọi API getEmployerById:", error);
    throw error;
  }
};