package iuh.fit.se.match_candidate_service.dto;

import iuh.fit.se.match_candidate_service.model.CandidateIndex;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateMatchDto {
    private CandidateDto candidate;
    private float score;
}
