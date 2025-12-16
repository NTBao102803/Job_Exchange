import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let notificationClient = null;

export const connectNotificationSocket = (token, onConnect) => {
  if (notificationClient?.connected) return;

  notificationClient = new Client({
    webSocketFactory: () =>
      new SockJS(
        `${import.meta.env.VITE_API_URL}/ws-notifications`),

    connectHeaders: {
      Authorization: token ? `Bearer ${token}` : "",
    },

    reconnectDelay: 5000,
    heartbeatIncoming: 20000,
    heartbeatOutgoing: 20000,
    debug: () => {},

    onConnect,
  });

  notificationClient.activate();
};

export const subscribeNotifications = (userId, callback) => {
  if (!notificationClient?.connected) return null;

  return notificationClient.subscribe(
    `/topic/notifications/${userId}`,
    (msg) => callback(JSON.parse(msg.body))
  );
};

export const disconnectNotificationSocket = () => {
  if (notificationClient) {
    try {
      notificationClient.deactivate();
    } catch {}
    notificationClient = null;
  }
};
