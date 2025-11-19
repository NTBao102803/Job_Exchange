import axiosClient from "./axiosClient"; // nếu dùng axiosClient
// hoặc import axios from "axios";

export const sendChatMessage = async (prompt) => {
  try {
    const res = await axiosClient.post("/chat", { prompt });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gửi chat:", error);
    throw error;
  }
};
