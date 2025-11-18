import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (token, onConnected, onError) => {
  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS(`${import.meta.env.VITE_API_URL}/ws-messages`),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    debug: (str) => console.log("WS DEBUG:", str),

    onConnect: () => onConnected && onConnected(),
    onStompError: (frame) => onError && onError(frame),
  });

  stompClient.activate();
};

export const subscribeConversation = (conversationId, callback) => {
  if (!stompClient) return;

  return stompClient.subscribe(
    `/topic/conversation.${conversationId}`,
    (msg) => callback(JSON.parse(msg.body))
  );
};

export const sendMessageWS = (conversationId, content) => {
  if (!stompClient) return;

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({
      conversationId,
      content, // ❗ gửi đúng backend
    }),
  });
};