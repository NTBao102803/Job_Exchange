import axiosClient from "./axiosClient";

// Lấy danh sách hội thoại
export const getConversations = async () => {
  const res = await axiosClient.get("/messages/conversations");
  return res.data as any[];
};

// Lấy tin nhắn theo conversationId
export const getMessagesByConversation = async (conversationId: number) => {
  const res = await axiosClient.get(
    `/messages/conversations/${conversationId}/messages`
  );
  return res.data as any[];
};

// Tạo hoặc lấy conversation (apply job)
export const createConversation = async (jobId: number) => {
  const res = await axiosClient.post("/messages/conversations", { jobId });
  return res.data as any;
};
