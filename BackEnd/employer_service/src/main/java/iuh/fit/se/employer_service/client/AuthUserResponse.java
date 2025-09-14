package iuh.fit.se.employer_service.client;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthUserResponse {
    private Long id;
    private String email;
    private String fullName;
}
