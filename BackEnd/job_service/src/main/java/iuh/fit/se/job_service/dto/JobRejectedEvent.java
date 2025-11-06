package iuh.fit.se.job_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobRejectedEvent {
    private Long jobId;
    private Long employerId;
    private String jobTitle;
    private String rejectReason;
}
