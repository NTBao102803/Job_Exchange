package iuh.fit.se.application_service.dto;

import iuh.fit.se.application_service.model.ApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDto {
    private Long id;
    private Long candidateId;
    private Long jobId;
    private ApplicationStatus status;
    private String coverLetter;
    private String rejectReason;
    private LocalDateTime appliedAt;
}
