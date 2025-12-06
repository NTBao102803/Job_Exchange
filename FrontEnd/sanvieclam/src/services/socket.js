// src/services/socket.js
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (token, onConnected, onError) => {
  if (stompClient && stompClient.connected) {
    // already connected
    onConnected?.();
    return;
  }

  // Create new client only if not exists
  stompClient = new Client({
    // reconnectDelay in ms -> automatic reconnect
    reconnectDelay: 5000,
    // heartbeats
    heartbeatIncoming: 20000,
    heartbeatOutgoing: 20000,
    // create SockJS instance lazily
    webSocketFactory: () =>
      new SockJS(`${import.meta.env.VITE_API_URL}/ws-messages`),

    connectHeaders: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },

    // disable noisy debug in production
    debug: () => {},

    onConnect: (frame) => {
      onConnected?.(frame);
    },

    onStompError: (frame) => {
      onError?.(frame);
    },

    onWebSocketClose: () => {
    },
  });

  stompClient.activate();
};

/** Safe getter to access current client */
export const getStompClient = () => stompClient;


export const subscribeConversation = (conversationId, callback) => {
  if (!stompClient || !stompClient.connected) return null;

  try {
    const sub = stompClient.subscribe(
      `/topic/conversation.${conversationId}`,
      (msg) => {
        try {
          const payload = JSON.parse(msg.body);
          callback?.(payload);
        } catch (e) {
          console.error("Invalid WS message body", e);
        }
      }
    );
    return sub;
  } catch (err) {
    console.error("subscribeConversation error:", err);
    return null;
  }
};

/** Publish message to server */
export const sendMessageWS = (conversationId, content) => {
  if (!stompClient || !stompClient.connected) return false;

  try {
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        conversationId,
        content,
      }),
    });
    return true;
  } catch (err) {
    console.error("sendMessageWS error:", err);
    return false;
  }
};

/** Disconnect and cleanup */
export const disconnectWebSocket = () => {
  if (stompClient) {
    try {
      stompClient.deactivate();
    } catch (e) {
      // ignore
    }
    stompClient = null;
  }
};
