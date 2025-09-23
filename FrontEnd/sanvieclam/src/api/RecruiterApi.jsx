import axiosClient from "./axiosClient";

// SIGN UP - gửi OTP
export const requestOTP = async (user) => {
  try {
    const response = await axiosClient.post("/employers/request-otp", user);
    return response.data;
  } catch (error) {
    if (error.response) {
      const data = error.response.data;
      // Nếu backend trả text/plain
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
export const verifyOTP = async (email, otp) => {
  return await axiosClient.post(
    `/employers/verify-otp?email=${email}&otp=${otp}`
  );
};

// lấy hồ sơ
export const getEmployerProfile = async () => {
  try {
    const response = await axiosClient.get("/employers/profile");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// update hồ sơ
export const updateEmployerProfile = async (data) => {
  try {
    const response = await axiosClient.put("/employers/profile", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// đăng tin tuyển dụng
export const createJob = async (data) => {
  try {
    const response = await axiosClient.post("/jobs", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// danh sách job
export const getAllJobs = async () => {
  try {
    const response = await axiosClient.get("/jobs");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getAllJobs:", error);
    throw error;
  }
};

// cập nhật job theo id
export const updateJob = async (id, jobData) => {
  try {
    const response = await axiosClient.put(`/jobs/${id}`, jobData);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật job id=${id}:`, error);
    throw error;
  }
};

// danh sách job theo status
export const getJobsByStatus = async (status) => {
  try {
    const response = await axiosClient.get(`/jobs/status/${status}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API getJobsByStatus:", error);
    throw error;
  }
};

