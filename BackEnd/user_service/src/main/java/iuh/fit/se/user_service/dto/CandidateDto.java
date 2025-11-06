package iuh.fit.se.user_service.dto;

import iuh.fit.se.user_service.model.Gender;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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

    private Gender gender;

    @Email
    @NotBlank
    private String email;

    private String phone;

    @NotBlank
    private String role;

    private String address;

    private String school;

    private String major;

    private String gpa;

    private String graduationYear;

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String projects;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String certificates;

    @Column(columnDefinition = "TEXT")
    private String careerGoal;

    private String hobbies;

    private String social;
}
