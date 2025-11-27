package iuh.fit.se.auth_service.dto;

import lombok.*;

@Getter
@Setter
public class VerifyOtpRequest {
    private String email;
    private String otp;
}
