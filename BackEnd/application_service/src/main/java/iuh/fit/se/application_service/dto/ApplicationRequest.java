package iuh.fit.se.application_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationRequest {
    private Long candidateId;
    private Long jobId;
    private String coverLetter;
}
