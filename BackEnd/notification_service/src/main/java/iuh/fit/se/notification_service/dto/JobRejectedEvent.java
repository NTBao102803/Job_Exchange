package iuh.fit.se.notification_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobRejectedEvent {
    private Long jobId;
    private Long employerId;
    private String jobTitle;
    private String rejectReason;
}
