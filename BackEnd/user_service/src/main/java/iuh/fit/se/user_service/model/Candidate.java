package iuh.fit.se.user_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "candidates")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Candidate {
    @Id
    private Long id;

    private String fullName;
    private LocalDate dob;
    private Gender gender;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String role;
    private String address;
    private String careerGoal;
    private String hobbies;
    private String social;

    // Relationships
    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Education> educations = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Experience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Project> projects = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Skill> skills = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Certificate> certificates = new ArrayList<>();
}
