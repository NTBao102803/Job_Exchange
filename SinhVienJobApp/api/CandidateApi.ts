import axiosClient from "./axiosClient";
 
// --- API Calls ---

// Lấy hồ sơ
export const getCandidateProfile = async (): Promise<any> => {
  try {
    const response = await axiosClient.get("/candidate");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update hồ sơ
export const updateCandidateProfile = async (data: Partial<any>): Promise<any> => {
  try {
    const response = await axiosClient.put("/candidate", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách ứng viên
export const getCandidates = async (): Promise<any[]> => {
  try {
    const response = await axiosClient.get("/candidate/all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy candidate theo id
export const getCandidateById = async (id: string): Promise<any> => {
  try {
    const response = await axiosClient.get(`/candidate/by-id/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi gọi API getCandidateById với id=${id}:`, error);
    throw error;
  }
};

// Upload avatar
export const uploadAvatar = async (file: any, userId: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("category", "AVATAR");

    const response = await axiosClient.post("/storage/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Lỗi upload avatar:", error);
    throw error;
  }
};

// Lấy avatar URL của user
export const getAvatarUrl = async (userId: string): Promise<string | null> => {
  try {
    const response = await axiosClient.get("/storage/avatar-url", {
      params: { userId },
    });
    return response.data || null;
  } catch (error) {
    console.error("❌ Lỗi lấy avatar URL:", error);
    throw error;
  }
};
