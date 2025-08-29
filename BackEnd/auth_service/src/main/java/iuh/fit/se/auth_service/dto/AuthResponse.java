package iuh.fit.se.auth_service.dto;

import iuh.fit.se.auth_service.model.User;
import lombok.*;


@Getter @Setter
@NoArgsConstructor
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private User user;

    public AuthResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
    public AuthResponse(String accessToken, String refreshToken,User user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }
}