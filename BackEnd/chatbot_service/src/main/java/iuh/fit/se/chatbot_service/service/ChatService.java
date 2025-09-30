package iuh.fit.se.chatbot_service.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import iuh.fit.se.chatbot_service.dto.ChatResponse;
import iuh.fit.se.chatbot_service.dto.ChatRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

@Service
public class ChatService {
    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    private final RestTemplate restTemplate;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public ChatService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ChatResponse chat(ChatRequest chatRequest) {
        logger.info("🔹 Bắt đầu xử lý yêu cầu chat: {}", chatRequest.getPrompt());

        // Hướng dẫn AI ở đầu message (role: user)
        Map<String, Object> instructionPart = new HashMap<>();
        instructionPart.put("text",
                "Bạn là trợ lý phỏng vấn. " +
                        "Trả lời ngắn gọn, rõ ràng, tập trung vào phỏng vấn & ứng tuyển. " +
                        "Dùng gạch đầu dòng, xuống hàng đẹp. Không lan man, không ký tự thừa."
        );

        Map<String, Object> instructionMessage = new HashMap<>();
        instructionMessage.put("role", "user"); // chỉ dùng user
        instructionMessage.put("parts", Collections.singletonList(instructionPart));

        // User message thực tế
        Map<String, Object> userPart = new HashMap<>();
        userPart.put("text", chatRequest.getPrompt());

        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("parts", Collections.singletonList(userPart));

        // Payload gửi lên API
        Map<String, Object> payload = new HashMap<>();
        payload.put("contents", Arrays.asList(instructionMessage, userMessage));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        try {
            String url = GEMINI_URL + "?key=" + geminiApiKey;
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            Map body = response.getBody();
            String reply = "Xin lỗi, không có phản hồi.";

            if (body != null) {
                List candidates = (List) body.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map contentResp = (Map) candidate.get("content");
                    List parts = (List) contentResp.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        Map firstPart = (Map) parts.get(0);
                        reply = (String) firstPart.get("text");
                    }
                }
            }

            return new ChatResponse(reply.trim());

        } catch (Exception e) {
            logger.error("❌ Lỗi khi gọi Gemini API:", e);
            return new ChatResponse("❌ Lỗi khi gọi Gemini API: " + e.getMessage());
        }
    }
}
