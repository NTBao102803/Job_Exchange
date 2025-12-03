import axiosClient from "./axiosClient";

// SIGN UP - gửi OTP
export const requestOTP = async (
  user: { fullname?: string; email?: string; password?: string }
): Promise<any> => {
  try {
    const response = await axiosClient.post("/auth/request-otp", user);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const data = error.response.data;
      if (typeof data === "string") throw new Error(data);
      throw new Error(data.message || data.error || "Có lỗi xảy ra");
    } else {
      throw new Error("Không kết nối được server");
    }
  }
};

// Xác thực OTP
export const verifyOTP = async (email: string, otp: string): Promise<any> => {
  return await axiosClient.post(`/auth/verify-otp?email=${email}&otp=${otp}`);
};

// LOGIN
export const login = async (loginData: { email: string; password: string }): Promise<any> => {
  return await axiosClient.post("/auth/login", loginData);
};

// LOGOUT
export const logout = async (): Promise<void> => {
  try {
    await axiosClient.post("/auth/logout");
  } catch (error) {
    console.error("Lỗi khi gọi API logout:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

// Quên mật khẩu - gửi OTP
export const forgotPassword = async (email: string): Promise<any> => {
  return await axiosClient.post("/auth/forgot-password", { email });
};

// Xác thực OTP khi quên mật khẩu
export const verifyOtpPassword = async (email: string, otp: string): Promise<any> => {
  return await axiosClient.post("/auth/verify-otp-password", { email, otp });
};

// Reset password bằng OTP
export const resetPassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<any> => {
  return await axiosClient.post("/auth/reset-password", data);
};

// Đổi mật khẩu
export const changePassword = async (data: {
  oldPassword?: string;
  newPassword: string;
}): Promise<any> => {
  return await axiosClient.post("/auth/change-password", data);
};

// Khoá tài khoản người dùng (ADMIN)
export const lockUser = async (userId: number): Promise<any> => {
  try {
    const response = await axiosClient.put(`/admin/users/${userId}/lock`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Không thể khoá người dùng");
    }
    throw new Error("Lỗi kết nối đến server");
  }
};

// Mở khoá tài khoản người dùng (ADMIN)
export const unlockUser = async (userId: number): Promise<any> => {
  try {
    const response = await axiosClient.put(`/admin/users/${userId}/unlock`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Không thể mở khoá người dùng");
    }
    throw new Error("Lỗi kết nối đến server");
  }
};

// Danh sách tất cả tài khoản
export const getAllUser = async (): Promise<any> => {
  try {
    const response = await axiosClient.get("/admin/users/all");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Không có danh sách nào tồn tại");
    }
    throw new Error("Lỗi kết nối đến server");
  }
};
