import axiosClient from "./axiosClient";

// --- Lấy danh sách comment theo employerId ---
export const getCommentsByEmployer = async (employerId) => {
  try {
    const res = await axiosClient.get(`/comments/${employerId}`);
    return res.data; // server trả về mảng CommentResponseDTO
  } catch (err) {
    console.error("❌ Lỗi khi lấy comment:", err);
    return []; // tránh crash frontend
  }
};

// --- Gửi comment mới hoặc reply --- nha tuyen dung
export const submitComment = async ({ employerId, content,authorName, parentId }) => {
  try {
    const payload = { employerId, content,authorName };
    if (parentId) payload.parentId = parentId;

    const res = await axiosClient.post("/comments", payload);
    // Không cần update state trực tiếp, WebSocket sẽ push comment mới
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi khi gửi comment:", err);
    throw err;
  }
};
// --- Gửi comment mới hoặc reply --- ung vien 
export const submitCandidateComment = async ({ employerId, content,authorName,rating,userId, parentId }) => {
  try {
    const payload = { employerId, content,authorName,rating,userId };
    console.log("🚀 Sending comment payload:", payload);
    if (parentId) payload.parentId = parentId;

    const res = await axiosClient.post("/comments", payload);
    // Không cần update state trực tiếp, WebSocket sẽ push comment mới
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi khi gửi comment:", err);
    throw err;
  }
};

