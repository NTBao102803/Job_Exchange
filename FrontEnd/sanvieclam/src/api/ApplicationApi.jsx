import axiosClient from "./axiosClient";

// Nộp CV ứng tuyển
export const applyJob = async (jobId, file) => {
  try {
    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("file", file);

    const response = await axiosClient.post("/applications/user", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
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

// Ứng viên lấy tất cả đơn ứng tuyển của mình
export const getApplicationsByCandidate = async (candidateId) => {
  try {
    const response = await axiosClient.get(`/applications/user/${candidateId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      const data = error.response.data;
      if (typeof data === "string") throw new Error(data);
      throw new Error(data.message || data.error || "Có lỗi xảy ra");
    }
    throw new Error("Không kết nối được server");
  }
};

// Nhà tuyển dụng lấy tất cả đơn ứng tuyển theo job
export const getApplicationsByJob = async (jobId) => {
  try {
    const response = await axiosClient.get(`/applications/employer/job/${jobId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      const data = error.response.data;
      if (typeof data === "string") throw new Error(data);
      throw new Error(data.message || data.error || "Có lỗi xảy ra");
    }
    throw new Error("Không kết nối được server");
  }
};

// Nhà tuyển dụng cập nhật trạng thái đơn ứng tuyển
export const updateApplicationStatus = async (id, status, rejectReason = null) => {
  try {
    const params = new URLSearchParams();
    params.append("status", status);
    if (rejectReason) params.append("rejectReason", rejectReason);

    const response = await axiosClient.put(
      `/application-service/employer/${id}/status?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      const data = error.response.data;
      if (typeof data === "string") throw new Error(data);
      throw new Error(data.message || data.error || "Có lỗi xảy ra");
    }
    throw new Error("Không kết nối được server");
  }
};

// duyệt hồ sơ ứng viên ứng tuyển
export const approveApplication = async (id) => {
  try {
    const response = await axiosClient.put(`/employer/applications/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error("Lỗi duyệt hồ sơ:", error);
    throw error;
  }
};

export const rejectApplication = async (id) => {
  try {
    const response = await axiosClient.put(`/employer/applications/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error("Lỗi từ chối hồ sơ:", error);
    throw error;
  }
};