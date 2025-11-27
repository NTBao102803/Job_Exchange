package iuh.fit.se.auth_service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
public class ResetPassOnlyRequest {

    @NotBlank
    @Email
    private String email;

    private String otp;

    @NotBlank
    @Size(min = 8)
    private String newPassword;
}

