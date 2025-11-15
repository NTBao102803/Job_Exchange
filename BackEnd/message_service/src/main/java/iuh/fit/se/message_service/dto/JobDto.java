package iuh.fit.se.message_service.dto;

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
    private String jobType;
    private LocalDate startDate;
    private LocalDate endDate;
    private JobRequirements requirements;
    private String benefits;
    private String status;
    private String rejectReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
