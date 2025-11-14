package iuh.fit.se.recommendation_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateMatchDto {
    private CandidateDto candidate;
    private double score;
}
