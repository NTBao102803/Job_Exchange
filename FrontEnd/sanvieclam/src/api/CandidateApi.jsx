import axiosClient from "./axiosClient";

// lấy hồ sơ
export const getCandidateProfile = async () => {
  try {
    const response = await axiosClient.get("/candidate");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// update hồ sơ
export const updateCandidateProfile = async (data) => {
  try {
    const response = await axiosClient.put("/candidate", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// lấy danh sách ứng viên 
export const getCandidates = async () => {
  try {
    const response = await axiosClient.get("/candidate/all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy candidate theo id
export const getCandidateById = async (id) => {
  try {
    const response = await axiosClient.get(`/candidate/by-id/${id}`);
    return response.data; // trả về Candidate
  } catch (error) {
    console.error(`❌ Lỗi khi gọi API getCandidateById với id=${id}:`, error);
    throw error;
  }
};