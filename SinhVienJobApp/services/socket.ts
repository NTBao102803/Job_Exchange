import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: any = null;

// ⚡ Kết nối WebSocket
export const connectWebSocket = (
  token: string,
  onConnected?: () => void,
  onError?: (err: any) => void
) => {
  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS(`http://192.168.1.200:8080/ws-messages`), // ❗ đổi URL của bạn

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    debug: (str: any) => console.log("WS DEBUG:", str),

    onConnect: () => {
      console.log("✅ WebSocket connected!");
      if (onConnected) onConnected();
    },

    onStompError: (frame: any) => {
      console.log("❌ STOMP Error:", frame);
      if (onError) onError(frame);
    },
  });

  stompClient.activate();
};

// ⚡ Subscribe theo conversation
export const subscribeConversation = (
  conversationId: number,
  callback: (msg: any) => void
) => {
  if (!stompClient) {
    console.log("❌ stompClient chưa kết nối!");
    return;
  }

  return stompClient.subscribe(
    `/topic/conversation.${conversationId}`,
    (message: any) => {
      try {
        const body = JSON.parse(message.body);
        callback(body);
      } catch (err) {
        console.log("❌ Lỗi parse message:", err);
      }
    }
  );
};

// ⚡ Gửi tin nhắn
export const sendMessageWS = (conversationId: number, content: string) => {
  if (!stompClient) {
    console.log("❌ stompClient chưa sẵn sàng!");
    return;
  }

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({
      conversationId,
      content,
    }),
  });

  console.log("📤 Sent message:", { conversationId, content });
};
