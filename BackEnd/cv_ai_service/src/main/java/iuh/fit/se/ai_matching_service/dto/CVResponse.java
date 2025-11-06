package iuh.fit.se.ai_matching_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor   // cần để Jackson deserialize
@AllArgsConstructor
public class CVResponse {
    private String cvHtml;
}
