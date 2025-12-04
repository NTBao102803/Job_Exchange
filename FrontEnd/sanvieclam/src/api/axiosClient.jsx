import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // đổi thành URL backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Nếu có token (login) thì thêm vào:
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // hoặc Redux store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
