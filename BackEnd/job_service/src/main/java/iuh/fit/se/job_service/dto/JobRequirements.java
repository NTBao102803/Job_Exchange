package iuh.fit.se.job_service.dto;

import lombok.Data;

import java.util.List;

@Data
public class JobRequirements {
    private List<String> skills;
    private int experience; // số năm kinh nghiệm
    private String education; // ví dụ "Bachelor", "Master"
    private String career;    // ví dụ "Backend Developer"
}
