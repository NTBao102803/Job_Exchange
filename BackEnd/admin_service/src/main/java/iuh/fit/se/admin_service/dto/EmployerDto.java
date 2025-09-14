package iuh.fit.se.admin_service.dto;

import lombok.Data;

@Data
public class EmployerDto {
    private Long id;
    private String address;
    private Long authUserId;
    private String companyName;
    private String email;
    private String fullName;
    private String phone;
    private String status;
}
