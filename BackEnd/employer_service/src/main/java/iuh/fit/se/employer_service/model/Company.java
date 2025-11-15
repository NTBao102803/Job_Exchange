package iuh.fit.se.employer_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companies")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String companyAddress;
    private String companySize;
    private String companyField;
    private String taxCode;
    private String businessLicense;
    private String companyWebsite;
    private String companySocial;

    @Column(length = 2000)
    private String companyDescription;

    // 1-1 với Employer
    @OneToOne(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Employer employer;
}
