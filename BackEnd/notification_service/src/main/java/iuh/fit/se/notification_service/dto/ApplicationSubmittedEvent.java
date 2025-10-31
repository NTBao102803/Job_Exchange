package iuh.fit.se.notification_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationSubmittedEvent {
    private Long applicationId;
    private Long candidateId;
    private String candidateName;
    private Long jobId;
    private String jobTitle;
    private Long employerId;
}
