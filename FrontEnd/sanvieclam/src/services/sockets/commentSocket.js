// services/socket/commentSocket.js
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let commentClient = null;

export const connectCommentSocket = (token, onConnect) => {
  if (commentClient?.connected) return;

  commentClient = new Client({
    webSocketFactory: () =>
      new SockJS(`${import.meta.env.VITE_API_URL}/ws-comments`),

    connectHeaders: {
      Authorization: token ? `Bearer ${token}` : "", // Vẫn giữ header (tốt hơn)
    },

    reconnectDelay: 5000,
    heartbeatIncoming: 20000,
    heartbeatOutgoing: 20000,
    debug: () => {},

    onConnect,
  });

  commentClient.activate();
};

export const subscribeComments = (employerId, callback) => {
  if (!commentClient?.connected) return null;

  return commentClient.subscribe(
    `/topic/comments/${employerId}`,
    (msg) => callback(JSON.parse(msg.body))
  );
};

export const disconnectCommentSocket = () => {
  if (commentClient) {
    try {
      commentClient.deactivate();
    } catch {}
    commentClient = null;
  }
};
