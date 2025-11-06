package iuh.fit.se.recommendation_service.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDto {
    private Long id;
    private Long employerId;
    private String title;
    private String location;
    private String salary;
    private LocalDate startDate;
    private String jobType;
    private LocalDate endDate;
    private String description;
    private JobRequirements requirements;
    private String benefits;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
