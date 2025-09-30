package iuh.fit.se.admin_service.dto;

import lombok.Data;

@Data
public class EmployerDto {
    private Long id;
    private Long authUserId;
    private String companyName;
    private String email;
    private String fullName;
    private String phone;
    private String status;
    private String position;
    private String companyAddress;
    private String companySize;         // ex: 100-500 nhân viên
    private String companyField;        // lĩnh vực hoạt động
    private String taxCode;
    private String businessLicense;
    private String companyWebsite;
    private String companySocial;
    private String companyDescription;
}
