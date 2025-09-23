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