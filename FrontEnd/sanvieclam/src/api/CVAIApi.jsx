import axiosClient from "./axiosClient";

// Gọi backend để tạo CV AI
export const generateCV = async (candidate, template) => {
  try {
    const res = await axiosClient.post("/cv/generate", { candidate, template });
    return res.data; // backend trả { cvHtml: "..." }
  } catch (error) {
    console.error("❌ Lỗi khi tạo CV AI:", error);
    throw error;
  }
};
