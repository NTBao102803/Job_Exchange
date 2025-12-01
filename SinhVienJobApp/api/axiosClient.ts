// src/api/axiosClient.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const axiosClient = axios.create({
  baseURL: "http://192.168.1.200:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm token vào header nếu có
axiosClient.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync("token"); // đọc token từ SecureStore
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log("Lỗi lấy token:", error);
  }
  return config;
});

export default axiosClient;
