package iuh.fit.se.employer_service.dto;

import lombok.Data;

@Data
public class EmployerRegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private String companyName;
    private String address;
}
