package iuh.fit.se.recommendation_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {
    private Long id;
    private String fullName;
    private String email;
    private String major;
    private String skills;
    private String experience;
    private String projects;
    private String certificates;
    private String careerGoal;
}
