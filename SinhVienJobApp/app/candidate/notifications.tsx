import { Client } from "@stomp/stompjs";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import { Bell } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getNotifications, getUnreadCount, markAsRead } from "../../api/NotificationApi";
import HeaderNotifications from "../../components/header/HeaderNotifications";
import { useMenu } from "../../context/MenuContext";

export default function Notifications() {
  const { openMenu } = useMenu();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [candidateId, setCandidateId] = useState<number | null>(null);
  const stompClient = useRef<Client | null>(null);

  // 1️⃣ Lấy thông tin candidate
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const userId = await SecureStore.getItemAsync("userId");
        if (userId) {
          setCandidateId(Number(userId));
        }
      } catch (err) {
        console.error("Lỗi lấy candidate profile:", err);
      }
    };
    fetchCandidate();
  }, []);
  // 2️⃣ Lấy thông báo + số lượng chưa đọc
  useEffect(() => {
    if (!candidateId) return;

    const fetchData = async () => {
      try {
        const [notifs, count] = await Promise.all([
          getNotifications(candidateId),
          getUnreadCount(candidateId),
        ]);

        const formatted = notifs.map((n: any) => ({
          id: n.id,
          message: n.message,
          read: n.readFlag || false,
          createdAt: n.createdAt,
        })).reverse();

        setNotifications(formatted);
        setUnreadCount(count);
      } catch (err: any) {
        console.error("Lỗi tải thông báo:", err.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Cập nhật mỗi 30s
    return () => clearInterval(interval);
  }, [candidateId]);

  // 3️⃣ Kết nối WebSocket
  useEffect(() => {
    if (!candidateId) return;

    const connectWebSocket = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) return;

        const client = new Client({
          brokerURL: `ws://localhost:8080/ws-notifications?token=${encodeURIComponent(token.replace("Bearer ", ""))}`,
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          debug: (str) => console.log("STOMP:", str),
        });

        client.onConnect = () => {
          const topic = `/topic/notifications/${candidateId}`;
          client.subscribe(topic, (msg) => {
            const notif = JSON.parse(msg.body);
            setNotifications((prev) => [{ ...notif, read: notif.readFlag || false }, ...prev]);
            setUnreadCount((prev) => prev + 1);
          });
        };

        client.activate();
        stompClient.current = client;
      } catch (err) {
        console.error("Lỗi kết nối WebSocket:", err);
      }
    };

    connectWebSocket();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [candidateId]);

  // 4️⃣ Đánh dấu 1 thông báo đã đọc
  const handleMarkOne = async (id: number) => {
    try {
      const updated = await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: updated.readFlag } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error("Lỗi đánh dấu đã đọc:", err.message);
    }
  };

  // 5️⃣ Đánh dấu tất cả đã đọc
  const handleMarkAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderNotifications onMenuPress={openMenu} />

      <LinearGradient
        colors={["#2e383cff", "#3d555dff", "#45636fff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}
      >
        {/* Title */}
        <View style={{ marginBottom: 15 }}>
          <Text style={{ color: "white", fontSize: 26, fontWeight: "800" }}>
            Thông báo
          </Text>
          <Text style={{ color: "white", opacity: 0.9, marginTop: 4 }}>
            Bạn có {notifications.filter((x) => !x.read).length} thông báo chưa đọc
          </Text>

          <TouchableOpacity
            onPress={handleMarkAll}
            style={{
              marginTop: 10,
              alignSelf: "flex-start",
              backgroundColor: "rgba(255,255,255,0.25)",
              paddingVertical: 6,
              paddingHorizontal: 16,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.4)",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              Đánh dấu tất cả đã đọc
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              onPress={() => !notif.read && handleMarkOne(notif.id)}
              style={{
                marginBottom: 15,
                backgroundColor: notif.read
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(255,255,255,0.35)",
                padding: 16,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Bell
                  size={22}
                  color={notif.read ? "#ffe4e6" : "#ffeb3b"}
                  style={{ marginRight: 12, marginTop: 2 }}
                />

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 15,
                      fontWeight: notif.read ? "500" : "700",
                    }}
                  >
                    {notif.message}
                  </Text>
                  <Text style={{ color: "#ffe4e6", opacity: 0.8, fontSize: 12, marginTop: 6 }}>
                    {notif.createdAt}
                  </Text>
                </View>

                {!notif.read && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: "#ff2d55",
                      borderRadius: 50,
                      marginLeft: 8,
                      marginTop: 8,
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
