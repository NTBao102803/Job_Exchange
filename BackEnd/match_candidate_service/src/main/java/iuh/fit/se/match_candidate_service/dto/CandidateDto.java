package iuh.fit.se.match_candidate_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String address;

    private String skills;       // lưu text (VD: "Java, Spring Boot, MySQL")
    private String experience;   // text mô tả kinh nghiệm (VD: "2 năm Java")
    private String major;
    private String school;
    private String gpa;
    private String graduationYear;

    private String certificates;
    private String projects;
    private String careerGoal;
}
