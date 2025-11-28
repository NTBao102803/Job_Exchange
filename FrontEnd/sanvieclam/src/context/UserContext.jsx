import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { getAvatarUrl } from "../api/CandidateApi";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [avatarUrl, setAvatarUrl] = useState("/user-candidate.png");

  // Lưu userId cũ để so sánh
  const lastUserIdRef = useRef(null);

  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.id || null;
    } catch {
      return null;
    }
  };

  // Hàm gọi backend lấy avatar
  const reloadAvatar = async (userId) => {
    try {
      if (!userId) {
        setAvatarUrl("/user-candidate.png");
        return;
      }
      const url = await getAvatarUrl(userId);
      console.log("Avatar URL:", url);
      setAvatarUrl(url || "/user-candidate.png");
    } catch (e) {
      console.error("❌ Lỗi reload avatar:", e);
      setAvatarUrl("/user-candidate.png");
    }
  };

  // 🔥 Auto detect đổi userId (khi login/logout) rồi tự reload
  useEffect(() => {
    const checkUserChange = () => {
      const currentUserId = getCurrentUserId();
      if (currentUserId !== lastUserIdRef.current) {
        // user mới đăng nhập / logout
        lastUserIdRef.current = currentUserId;
        reloadAvatar(currentUserId);
      }
    };

    // chạy ngay lần đầu
    checkUserChange();

    // sau đó 1s check một lần (rất nhẹ)
    const interval = setInterval(checkUserChange, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <UserContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
