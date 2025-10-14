import React, { createContext, useContext, useState, useEffect } from "react";
import { getAvatarUrl } from "../api/CandidateApi"; // API đã có sẵn của bạn

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [avatarUrl, setAvatarUrl] = useState("/user-candidate.png");

  // Lấy avatar khi app load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    if (userId) {
      getAvatarUrl(userId)
        .then((url) => setAvatarUrl(url))
        .catch(() => setAvatarUrl("/user-candidate.png"));
    }
  }, []);

  return (
    <UserContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);