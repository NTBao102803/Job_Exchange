package iuh.fit.se.message_service.service;

import iuh.fit.se.message_service.client.EmployerClient;
import iuh.fit.se.message_service.client.UserClient;
import iuh.fit.se.message_service.config.JwtUtil;
import iuh.fit.se.message_service.dto.CandidateDto;
import iuh.fit.se.message_service.dto.EmployerDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CurrentUserService {

    private final JwtUtil jwtUtil;
    private final UserClient userClient;
    private final EmployerClient employerClient;

    private String getCurrentToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) {
            throw new IllegalStateException("No authentication in context");
        }

        if (auth.getCredentials() instanceof String token) {
            return token;
        }

        throw new IllegalStateException("No JWT token found");
    }
    public Long getCurrentUserId() {
        try {
            CandidateDto candidate = userClient.getCandidateByEmail();
            log.info("User is CANDIDATE | id: {}", candidate.getId());
            return candidate.getId();
        } catch (Exception e) {
            log.debug("Not candidate, trying employer...");
        }

        try {
            EmployerDto employer = employerClient.getMyEmployer();
            log.info("User is EMPLOYER | id: {}", employer.getId());
            return employer.getId();
        } catch (Exception e) {
            log.error("Failed to get current user", e);
            throw new RuntimeException("Cannot get current user", e);
        }
    }

    public String getCurrentSenderType() {
        String token = getCurrentToken();
        String role = jwtUtil.extractRole(token);
        log.debug("SENDER TYPE: {}", role);
        return role;
    }
}
