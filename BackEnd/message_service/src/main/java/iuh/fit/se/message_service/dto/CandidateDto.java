package iuh.fit.se.message_service.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CandidateDto {
    private Long id;
    private String fullName;

    private LocalDate dob;
    private String gender;
    private String email;
    private String phone;
    private String role;
    private String address;
    private String school;
    private String major;
    private String gpa;
    private String graduationYear;
    private String experience;
    private String projects;
    private String skills;
    private String certificates;
    private String careerGoal;
    private String hobbies;
    private String social;
}
