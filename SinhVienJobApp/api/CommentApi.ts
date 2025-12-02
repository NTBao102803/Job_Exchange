import axiosClient from "./axiosClient";

// --- Lấy danh sách comment theo employerId ---
export const getCommentsByEmployer = async (employerId: number) => {
  try {
    const res = await axiosClient.get(`/comments/${employerId}`);
    return res.data as any[]; // server trả về mảng CommentResponseDTO
  } catch (err) {
    console.error("❌ Lỗi khi lấy comment:", err);
    return [];
  }
};

// --- Gửi comment mới hoặc reply (nhà tuyển dụng) ---
export const submitComment = async ({
  employerId,
  content,
  authorName,
  parentId,
}: {
  employerId: number;
  content: string;
  authorName: string;
  parentId?: number;
}) => {
  try {
    const payload: any = { employerId, content, authorName };

    if (parentId) payload.parentId = parentId;

    const res = await axiosClient.post("/comments", payload);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi khi gửi comment:", err);
    throw err;
  }
};

// --- Gửi comment mới hoặc reply (ứng viên) ---
export const submitCandidateComment = async ({
  employerId,
  content,
  authorName,
  rating,
  userId,
  parentId,
}: {
  employerId: number;
  content: string;
  authorName: string;
  rating: number;
  userId: number;
  parentId?: number;
}) => {
  try {
    const payload: any = { employerId, content, authorName, rating, userId };

    console.log("🚀 Sending comment payload:", payload);

    if (parentId) payload.parentId = parentId;

    const res = await axiosClient.post("/comments", payload);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi khi gửi comment:", err);
    throw err;
  }
};
