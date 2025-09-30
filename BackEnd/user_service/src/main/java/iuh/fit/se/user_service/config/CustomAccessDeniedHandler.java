package iuh.fit.se.user_service.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private static final Logger logger = LoggerFactory.getLogger(CustomAccessDeniedHandler.class);

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null) {
            logger.error("🚫 Access denied! User: {}, Authorities: {}, Path: {}",
                    auth.getName(),
                    auth.getAuthorities(),
                    request.getRequestURI());
        } else {
            logger.error("🚫 Access denied! No authentication found. Path: {}", request.getRequestURI());
        }

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Forbidden: You don’t have permission to access this resource.\"}");
    }
}

