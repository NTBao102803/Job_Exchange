package iuh.fit.se.message_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployerDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String companyName;
    private String companyAddress;
    private Long authUserId;
    private String position;
    private String companySize;
    private String companyField;
    private String taxCode;
    private String businessLicense;
    private String companyWebsite;
    private String companySocial;
    private String companyDescription;
    private String status;
}
