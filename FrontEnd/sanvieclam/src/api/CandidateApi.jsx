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

// upload avatar
export const uploadAvatar = async (file, userId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("category", "AVATAR"); // category cố định là AVATAR

    const response = await axiosClient.post("/storage/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // Trả về FileResponse từ backend
  } catch (error) {
    console.error("❌ Lỗi upload avatar:", error);
    throw error;
  }
};


// Lấy avatar URL của user
export const getAvatarUrl = async (userId) => {
  try {
    const response = await axiosClient.get(`/storage/avatar-url`, {
      params: { userId },
    });

    // Nếu backend trả null thì vẫn xử lý an toàn
    return response.data || null;
  } catch (error) {
    console.error("❌ Lỗi lấy avatar URL:", error);
    throw error;
  }
};