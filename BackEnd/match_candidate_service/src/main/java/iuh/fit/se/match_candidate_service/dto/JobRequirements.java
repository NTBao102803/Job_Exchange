package iuh.fit.se.match_candidate_service.dto;

import lombok.*;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequirements {
    private List<String> skills;
    private Integer experience; // số năm yêu cầu
    private String education;
    private String career;
}
