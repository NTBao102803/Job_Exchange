package iuh.fit.se.employer_service.dto;


import iuh.fit.se.employer_service.model.EmployerStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployerDto {
    private Long id;
    private String email;
    private String companyName;
    private String companyAddress;
    private EmployerStatus status;
}
