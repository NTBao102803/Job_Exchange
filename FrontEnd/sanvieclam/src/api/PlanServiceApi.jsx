import axiosClient from "./axiosClient";

// lấy gói dịch vụ đang sử dụng
export const getCurrentPlan = async (userId) => {
  try {
    const res = await axiosClient.get(`/payment-plans/current/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy gói dịch vụ:", error);
    throw error;
  }
};

// Lấy danh sách tất cả gói dịch vụ 
export const getAllPlans = async () => {
  try {
    const res = await axiosClient.get("/payment-plans");
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách gói:", error);
    throw error;
  }
};
// Lấy tất cả subscriptions (đăng ký dịch vụ)
export const getAllSubscriptions = async () => {
  try {
    const res = await axiosClient.get("/payment-plans/subscriptions");
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy subscriptions:", error);
    throw error;
  }
};
