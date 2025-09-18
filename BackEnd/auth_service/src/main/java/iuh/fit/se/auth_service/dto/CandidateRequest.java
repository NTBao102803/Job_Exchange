package iuh.fit.se.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CandidateRequest {
    private Long userId;

    @Email
    private String email;

    @NotBlank
    private String role;

    @NotBlank
    private String fullName;
}
