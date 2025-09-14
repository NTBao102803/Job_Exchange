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
    private String email;
    private String phone;
    private String companyName;
    private String address;

    private Long authUserId; // mapping sang User.id trong Auth Service

    @Enumerated(EnumType.STRING)
    private EmployerStatus status;
}
