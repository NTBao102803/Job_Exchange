package iuh.fit.se.job_service.model;

import lombok.Data;

import java.util.List;

@Data
public class JobRequirements {
    private List<String> skills;
    private String experience; // số năm yêu cầu
    private String certificates;
    private String career;
    private String descriptionRequirements;
}
