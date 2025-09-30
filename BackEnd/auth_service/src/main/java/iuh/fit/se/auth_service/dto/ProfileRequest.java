package iuh.fit.se.auth_service.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProfileRequest {
    private Long userId;

    @Email
    private String email;

    @NotBlank
    private String role;

    @NotBlank
    private String fullName;
}
