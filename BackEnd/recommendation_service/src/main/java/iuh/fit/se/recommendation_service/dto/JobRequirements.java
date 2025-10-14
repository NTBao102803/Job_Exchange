package iuh.fit.se.recommendation_service.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequirements {
    private List<String> skills;
    private String experience;
    private String certificates;
    private String career;
    private String descriptionRequirements;
}

