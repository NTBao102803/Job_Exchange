import axiosClient from "./axiosClient";

// 🔹 1. Lấy danh sách thông báo theo receiverId
export const getNotifications = async (receiverId: string): Promise<any> => {
  try {
    const response = await axiosClient.get(`/notifications/${receiverId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Token hết hạn, vui lòng đăng nhập lại");
    }
    throw new Error(error.response?.data?.message || "Lỗi khi tải thông báo");
  }
};

// 🔹 2. Đánh dấu 1 thông báo đã đọc
export const markAsRead = async (notificationId: string): Promise<any> => {
  try {
    const response = await axiosClient.put(`/notifications/${notificationId}/read`);
    return response.data; // Trả về notification đã cập nhật
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Thông báo không tồn tại");
    }
    if (error.response?.status === 401) {
      throw new Error("Token hết hạn, vui lòng đăng nhập lại");
    }
    throw new Error(error.response?.data?.message || "Lỗi khi đánh dấu đã đọc");
  }
};

// 🔹 3. Đánh dấu tất cả thông báo đã đọc
export const markAllAsRead = async (receiverId: string): Promise<any> => {
  try {
    const response = await axiosClient.put(`/notifications/read-all?receiverId=${receiverId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Lỗi khi đánh dấu tất cả đã đọc");
  }
};

// 🔹 6. Lấy thống kê thông báo (unread count)
export const getUnreadCount = async (receiverId: string): Promise<any> => {
  try {
    const response = await axiosClient.get(`/notifications/unread-count/${receiverId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Lỗi khi lấy số thông báo chưa đọc");
  }
};
