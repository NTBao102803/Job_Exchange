import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let messageClient = null;

export const connectWebSocket = (token, onConnect, onError) => {
  if (messageClient?.connected) return;

  messageClient = new Client({
    webSocketFactory: () =>
      new SockJS(`${import.meta.env.VITE_API_URL}/ws-messages`),

    connectHeaders: {
      Authorization: token ? `Bearer ${token}` : "",
    },

    reconnectDelay: 5000,
    heartbeatIncoming: 20000,
    heartbeatOutgoing: 20000,
    debug: () => {},

    onConnect,
    onStompError: onError,
  });

  messageClient.activate();
};

export const getStompClient = () => messageClient;

export const disconnectWebSocket = () => {
  if (messageClient) {
    try {
      messageClient.deactivate();
    } catch {}
    messageClient = null;
  }
};

export const subscribeConversation = (conversationId, callback) => {
  if (!messageClient?.connected) return null;

  return messageClient.subscribe(
    `/topic/conversation.${conversationId}`,
    (msg) => {
      try {
        callback(JSON.parse(msg.body));
      } catch {}
    }
  );
};

export const sendMessageWS = (conversationId, content) => {
  if (!messageClient?.connected) return;

  messageClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({ conversationId, content }),
  });
};
