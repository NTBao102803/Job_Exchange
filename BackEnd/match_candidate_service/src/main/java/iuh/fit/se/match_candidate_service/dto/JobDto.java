package iuh.fit.se.match_candidate_service.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobDto {
    private Long id;
    private Long employerId;
    private String title;
    private JobType jobType;   // FULL_TIME, PART_TIME, INTERNSHIP
    private String location;
    private String salary;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;

    // CHỈNH: từ String -> JobRequirements
    private JobRequirements requirements;

    private String benefits;
    private String rejectReason;
    private String status;   // PENDING, APPROVED, EXPIRED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
