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
  return await axiosClient.post(`/employers/verify-otp?email=${email}&otp=${otp}`);
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