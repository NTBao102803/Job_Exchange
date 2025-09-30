package iuh.fit.se.application_service.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationRequest {
    private Long jobId;            // job muốn apply
    private Long candidateId;      // có thể set từ token
    private MultipartFile file;    // CV nộp
}
