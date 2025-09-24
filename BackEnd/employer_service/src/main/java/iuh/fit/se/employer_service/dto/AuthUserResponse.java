package iuh.fit.se.employer_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthUserResponse {
    private Long id;
    private String email;
    private String fullName;
}
