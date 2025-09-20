package iuh.fit.se.match_candidate_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchResultDto {
    private CandidateDto candidate;
    private int score; // điểm phù hợp 0–100
}
