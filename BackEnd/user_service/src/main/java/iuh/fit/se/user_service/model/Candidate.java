package iuh.fit.se.user_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "candidates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate {
    @Id
    private Long id; //map với userId từ auth-service

    private String fullName;

    private LocalDate dob;

    private Gender gender;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

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
