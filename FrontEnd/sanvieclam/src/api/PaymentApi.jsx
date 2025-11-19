import axiosClient from "./axiosClient";




// Tạo thanh toán
export const createPayment = async (data) => {
  try {
    const res = await axiosClient.post("/payment/create", data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán:", error);
    throw error;
  }
};
// Giả lập quét QR
export const simulateScanPayment = async (orderId) => {
  try {
    const res = await axiosClient.post("/payment/scan", null, {
      params: { orderId },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi giả lập quét QR:", error);
    throw error;
  }
};
// Lấy danh sách thanh toán của recruiter
export const getPaymentsByRecruiter = async (recruiterId) => {
  try {
    const res = await axiosClient.get(`/payment/recruiter/${recruiterId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thanh toán:", error);
    throw error;
  }
};
// Lấy danh sách tất cả thanh toán
export const getAllPayments = async () => {
  try {
    const res = await axiosClient.get("/payment/all"); 
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất cả thanh toán:", error);
    throw error;
  }
};
