import axiosClient from "./axiosClient";

// Lấy danh sách hội thoại
export const getConversations = async () => {
  const res = await axiosClient.get("/messages/conversations");
  return res.data;
};

// Lấy tin nhắn theo conversationId
export const getMessagesByConversation = async (conversationId) => {
  const res = await axiosClient.get(
    `/messages/conversations/${conversationId}/messages`
  );
  return res.data;
};

// Tạo hoặc lấy conversation (apply job)
export const createConversation = async (jobId) => {
  const res = await axiosClient.post("/messages/conversations", { jobId });
  return res.data;
};
export const getUnreadMessageCount = async () => {
  const res = await axiosClient.get("/messages/unread-count"); 
  return res.data;
};