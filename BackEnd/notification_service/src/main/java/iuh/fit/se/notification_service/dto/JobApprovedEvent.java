package iuh.fit.se.notification_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApprovedEvent {
    private Long jobId;
    private Long employerId;
    private String jobTitle;
    private String message;
//    private String status; // e.g., "APPROVED", "REJECTED"
}
