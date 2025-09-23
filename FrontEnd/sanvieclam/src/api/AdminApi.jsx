import axios from "axios";

// Hàm để phê duyệt (approve) một employer
export const approveEmployer = async (id, authUserId) => {
  try {
    const response = await axiosClient.put(`/admin/employers/${id}/approve?authUserId=${authUserId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi phê duyệt employer id=${id}:`, error);
    throw error;
  }
};

// Hàm để từ chối (reject) một employer
export const rejectEmployer = async (id) => {
  try {
    const response = await axiosClient.put(`/admin/employers/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi từ chối employer id=${id}:`, error);
    throw error;
  }
};