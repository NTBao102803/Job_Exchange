package iuh.fit.se.job_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApprovedEvent {
    private Long jobId;
    private Long employerId;
    private String jobTitle;
}