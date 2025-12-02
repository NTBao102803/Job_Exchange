import axiosClient from "./axiosClient";

// SIGN UP - gửi OTP
export const requestOTP = async (user: any): Promise<any> => {
  try {
    const response = await axiosClient.post("/employers/request-otp", user);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const data = error.response.data;
      if (typeof data === "string") {
        throw new Error(data);
      }
      throw new Error(data.message || data.error || "Có lỗi xảy ra");
    } else {
      throw new Error("Không kết nối được server");
    }
  }
};

// Xác thực OTP
export const verifyOTP = async (email: string, otp: string): Promise<any> => {
  const res = await axiosClient.post(
    `/employers/verify-otp?email=${email}&otp=${otp}`
  );
  return res.data;
};

// lấy hồ sơ
export const getEmployerProfile = async (): Promise<any> => {
  const response = await axiosClient.get("/employers/profile");
  return response.data;
};

// lấy employer theo ID
export const getEmployerById = async (id: any): Promise<any> => {
  try {
    const res = await axiosClient.get(`/employers/id/${id}`, id);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi lấy employer theo id:", err);
    throw err;
  }
};

// update hồ sơ
export const updateEmployerProfile = async (data: any): Promise<any> => {
  const response = await axiosClient.put("/employers/profile", data);
  return response.data;
};

// tạo job
export const createJob = async (data: any): Promise<any> => {
  const response = await axiosClient.post("/jobs", data);
  return response.data;
};

// danh sách job
export const getAllJobs = async (): Promise<any[]> => {
  const response = await axiosClient.get("/jobs");
  return response.data;
};

// danh sách job theo employer hiện tại
export const getAllJobsByEmail = async (): Promise<any[]> => {
  const response = await axiosClient.get("/jobs/jobByEmployer");
  return response.data;
};

// cập nhật job
export const updateJob = async (id: any, jobData: any): Promise<any> => {
  const response = await axiosClient.put(`/jobs/${id}`, jobData);
  return response.data;
};

// danh sách job theo status
export const getJobsByStatus = async (status: string): Promise<any[]> => {
  const response = await axiosClient.get(`/jobs/status/${status}`);
  return response.data;
};

// danh sách job theo status + employer
export const getJobsByStatusByEmployer = async (
  status: string
): Promise<any[]> => {
  const response = await axiosClient.get(`/jobs/statusByEmployer/${status}`);
  return response.data;
};

// lấy danh sách employers (admin)
export const getAllEmployer = async (): Promise<any[]> => {
  const response = await axiosClient.get("/admin/employers/all");
  return response.data;
};

// upload avatar
export const uploadAvatar = async (file: any, userId: any): Promise<any> => {
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

// lấy avatar URL
export const getAvatarUrl = async (userId: any): Promise<string | null> => {
  try {
    const response = await axiosClient.get(`/storage/avatar-url`, {
      params: { userId },
    });
    return response.data || null;
  } catch (error) {
    console.error("❌ Lỗi lấy avatar URL:", error);
    throw error;
  }
};
