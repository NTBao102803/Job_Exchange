import axiosClient from "./axiosClient";

// lấy danh sách job theo status
// Lấy danh sách job đã được duyệt (public)
export const getAllPublicJobs = async () => {
  try {
    const response = await axiosClient.get("/jobs/public");
    return response.data; // trả về list JobDto
  } catch (error) {
    console.error("❌ Lỗi khi fetch jobs public:", error);
    throw error;
  }
};

// Lấy employer theo id
export const getEmployerById = async (id) => {
  try {
    const response = await axiosClient.get(`/employers/id/${id}`, id);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi gọi API getEmployerById:", error);
    throw error;
  }
};