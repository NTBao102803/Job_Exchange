package iuh.fit.se.ai_matching_service.dto;


import lombok.Data;
import java.util.Map;

@Data
public class CVRequest {
    private Map<String, Object> candidate;  // dữ liệu ứng viên
    private String template;
}
