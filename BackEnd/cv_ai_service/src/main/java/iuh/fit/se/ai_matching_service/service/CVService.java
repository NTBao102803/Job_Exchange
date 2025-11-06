package iuh.fit.se.ai_matching_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.ai_matching_service.dto.CVRequest;
import iuh.fit.se.ai_matching_service.dto.CVResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class CVService {
    private static final Logger logger = LoggerFactory.getLogger(CVService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public CVService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public CVResponse generateCV(CVRequest request) {
        try {
            // 🔹 Gộp tất cả: HTML + CSS + bố cục + nội dung phong phú
            String candidateJson = objectMapper.writeValueAsString(request.getCandidate());

            String prompt = "Hãy tạo một CV hoàn chỉnh bằng HTML + CSS inline/embedded. "
                    + "Yêu cầu:\n"
                    + "1. Bố cục đẹp, chia cột, avatar góc trên bên trái, các section box, border, background màu sắc nhạt.\n"
                    + "2. Typography: chữ lớn, chữ nhỏ, in đậm, highlight các tiêu đề.\n"
                    + "3. Section: Thông tin ứng viên, Học vấn, Kinh nghiệm, Dự án, Kỹ năng, Chứng chỉ, Mục tiêu nghề nghiệp, Sở thích, Mạng xã hội.\n"
                    + "4. Sử dụng tất cả dữ liệu JSON dưới đây, điền vào CV đầy đủ, nội dung phong phú, từ ngữ tự nhiên, chi tiết.\n"
                    + "5. Thứ tự section sắp xếp theo phong cách '" + request.getTemplate() + "'. "
                    + "Mỗi template có thứ tự và layout khác nhau.\n"
                    + "6. HTML và CSS đầy đủ, render trực tiếp trên web là đẹp, có màu sắc, bố cục chia cột, các đường kẻ phân chia section.\n"
                    + "7. Chiều ngang vừa đủ 1 tờ A4.\n"
                    + "8. Tất cả css tạo chỉ dùng riêng cho 1 trang html thôi để khong bị ảnh hưởng tới các css của các trang html khác.\n"
                    + "Dữ liệu ứng viên JSON:\n"
                    + candidateJson + "\n"
                    + "Trả về một chuỗi HTML hoàn chỉnh.";

            String htmlCV = callGemini(prompt);

            return new CVResponse(htmlCV);

        } catch (Exception e) {
            logger.error("❌ Lỗi khi generate CV:", e);
            return new CVResponse("<p>❌ Lỗi khi sinh CV: " + e.getMessage() + "</p>");
        }
    }

    private String callGemini(String prompt) {
        try {
            // instruction + user message
            Map<String, Object> instructionPart = new HashMap<>();
            instructionPart.put("text", "Bạn là trợ lý AI tạo CV đẹp, chuyên nghiệp, đầy đủ HTML + CSS, bố cục rõ ràng.");

            Map<String, Object> instructionMessage = new HashMap<>();
            instructionMessage.put("role", "user");
            instructionMessage.put("parts", Collections.singletonList(instructionPart));

            Map<String, Object> userPart = new HashMap<>();
            userPart.put("text", prompt);

            Map<String, Object> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("parts", Collections.singletonList(userPart));

            Map<String, Object> payload = new HashMap<>();
            payload.put("contents", Arrays.asList(instructionMessage, userMessage));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            String url = GEMINI_URL + "?key=" + geminiApiKey;
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            Map body = response.getBody();
            if (body == null) return "❌ Không có phản hồi từ Gemini.";

            List candidates = (List) body.get("candidates");
            if (candidates == null || candidates.isEmpty()) return "❌ Gemini không trả kết quả.";

            Map candidate = (Map) candidates.get(0);
            Map contentResp = (Map) candidate.get("content");
            List parts = (List) contentResp.get("parts");
            if (parts == null || parts.isEmpty()) return "❌ Gemini không trả text.";

            Map firstPart = (Map) parts.get(0);
            Object textObj = firstPart.get("text");
            return textObj != null ? textObj.toString() : "❌ Không tìm thấy text trong phản hồi Gemini.";

        } catch (Exception e) {
            logger.error("❌ Lỗi khi gọi Gemini API:", e);
            return "❌ Lỗi khi gọi Gemini API: " + e.getMessage();
        }
    }
}
