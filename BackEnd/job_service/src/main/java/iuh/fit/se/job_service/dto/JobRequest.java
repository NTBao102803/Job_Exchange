package iuh.fit.se.job_service.dto;


import iuh.fit.se.job_service.model.JobRequirements;
import iuh.fit.se.job_service.model.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobRequest {
    private String title;
    private String description;
    private String location;
    private String salary;
    private JobType jobType;
    private LocalDate startDate;
    private LocalDate endDate;
    private JobRequirements requirements;
    private String benefits;
    private LocalDateTime updatedAt;
}
