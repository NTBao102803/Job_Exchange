package iuh.fit.se.user_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "educations")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Education {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    @JsonIgnore
    private Candidate candidate;

    private String school;
    private String major;
    private String gpa;
    private String graduationYear;
}
