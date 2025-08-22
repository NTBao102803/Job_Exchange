package iuh.fit.se.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UserResponse {
    private Long id;
    private String username;
    private String password;
    private String role;
}
