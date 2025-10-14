package iuh.fit.se.recommendation_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobMatchDto {
    private JobDto job;
    private double score;
}
