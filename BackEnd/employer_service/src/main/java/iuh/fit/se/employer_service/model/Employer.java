package iuh.fit.se.employer_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    @Column(nullable = false, unique = true)
    private String email;
    private String phone;
    private String companyName;
    private String companyAddress;


    private Long authUserId; // mapping sang User.id trong Auth Service

    private String position;
    private String companySize;
    private String companyField;
    private String taxCode;
    private String businessLicense;
    private String companyWebsite;
    private String companySocial;

    @Column(length = 2000)
    private String companyDescription;

    @Enumerated(EnumType.STRING)
    private EmployerStatus status;
}
