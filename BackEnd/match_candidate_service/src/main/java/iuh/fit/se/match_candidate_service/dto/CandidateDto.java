package iuh.fit.se.match_candidate_service.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

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
    private LocalDate dob;
    private String gender;
    private String hobbies;
    private String social;
}
