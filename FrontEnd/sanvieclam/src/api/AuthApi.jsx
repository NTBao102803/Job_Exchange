import axiosClient from "./axiosClient";

// SIGN UP - gửi OTP
export const requestOTP = async (user) => {
  try {
    const response = await axiosClient.post("/auth/request-otp", user);
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
  return await axiosClient.post(`/auth/verify-otp?email=${email}&otp=${otp}`);
};

// LOGIN
export const login = async (loginData) => {
  return await axiosClient.post("/auth/login", loginData);
};

// LOGOUT
export const logout = async () => {
  try {
    const response = await axiosClient.post("/auth/logout");
    localStorage.removeItem("user");
    return response;
  } catch (error) {
    if (error.response?.status === 403) {
      localStorage.removeItem("user");
      document.cookie = "jwtToken=; Max-Age=0; path=/";
      document.cookie = "refreshToken=; Max-Age=0; path=/";
      return { message: "Phiên đăng nhập đã hết hạn. Đã tự động đăng xuất." };
    }
    throw error;
  }
};


// // VERIFY USER
// export const verifyUser = async () => {
//   return await axiosClient.get("/auth/verifyUser");
// };

// // GET USER BY ID
// export const getUserById = async (userId) => {
//   return await axiosClient.get(`/user/${userId}`);
// };

// // Quên mật khẩu - gửi OTP
// export const forgotPassword = async (email) => {
//   return await axiosClient.post("/auth/forgot-password", { email });
// };

// // Reset password bằng OTP
// export const resetPassword = async ({ email, otp, newPassword }) => {
//   return await axiosClient.post("/auth/reset-password", { email, otp, newPassword });
// };

// // Đổi mật khẩu
// export const changePassword = async (data) => {
//   return await axiosClient.post("/auth/change-password", data);
// };
