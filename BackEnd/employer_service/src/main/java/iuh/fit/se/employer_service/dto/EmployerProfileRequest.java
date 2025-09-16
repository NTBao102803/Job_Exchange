package iuh.fit.se.employer_service.dto;

import lombok.Data;

@Data
public class EmployerProfileRequest {
    private String fullName;            // người đại diện
    private String email;
    private String phone;
    private String position;

    private String companyName;
    private String companyAddress;
    private String companySize;         // ex: 100-500 nhân viên
    private String companyField;        // lĩnh vực hoạt động
    private String taxCode;
    private String businessLicense;
    private String companyWebsite;
    private String companySocial;
    private String companyDescription;
}
