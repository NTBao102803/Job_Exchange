package iuh.fit.se.message_service.service;

import io.jsonwebtoken.Claims;
import iuh.fit.se.message_service.client.EmployerClient;
import iuh.fit.se.message_service.client.UserClient;
import iuh.fit.se.message_service.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TokenParser {
    private final JwtUtil jwtUtil;
    private final UserClient userClient;
    private final EmployerClient employerClient;

    public Long extractEntityId(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Token is null or empty");
        }
        if (token.startsWith("Bearer ")) token = token.substring(7);

        var claims = jwtUtil.extractAllClaims(token);
        String role = claims.get("roles", List.class).get(0).toString();


        if ("USER".equalsIgnoreCase(role)) {
            var candidate = userClient.getCandidateByEmail(); // Feign sẽ có token
            return candidate.getId();
        }

        if ("EMPLOYER".equalsIgnoreCase(role)) {
            var employer = employerClient.getMyEmployer(); // Feign có token
            return employer.getId();
        }

        throw new IllegalArgumentException("Unknown role: " + role);
    }

    public String extractSenderType(String token) {
        if (token.startsWith("Bearer ")) token = token.substring(7);
        var claims = jwtUtil.extractAllClaims(token);
        String role = claims.get("roles", List.class).get(0).toString();
        return "USER".equalsIgnoreCase(role) ? "USER" : "EMPLOYER";
    }
}
