package iuh.fit.se.job_service.dto;

import iuh.fit.se.job_service.model.JobRequirements;
import iuh.fit.se.job_service.model.JobStatus;
import iuh.fit.se.job_service.model.JobType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDto {
    private Long id;
    private Long employerId;
    private String title;
    private String description;
    private String location;
    private String salary;
    private JobType jobType;
    private LocalDate startDate;
    private LocalDate endDate;
    private JobRequirements requirements;
    private String benefits;
    private JobStatus status;
    private String rejectReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
