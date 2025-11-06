package iuh.fit.se.application_service.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class FeignClientInterceptor implements RequestInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(FeignClientInterceptor.class);

    @Override
    public void apply(RequestTemplate template) {
        // 1) try get Authorization header from current HttpServletRequest
        String authHeader = null;
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attrs != null) {
            HttpServletRequest request = attrs.getRequest();
            authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            logger.debug("FeignInterceptor - header from HttpServletRequest: {}", authHeader);
        }

        // 2) fallback: get token from SecurityContext.credentials
        if (!StringUtils.hasText(authHeader)) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getCredentials() instanceof String token) {
                // token is raw (no "Bearer "), so make header with Bearer prefix
                authHeader = token.startsWith("Bearer ") ? token : "Bearer " + token;
                logger.debug("FeignInterceptor - header from SecurityContext credentials: {}", authHeader);
            }
        }

        if (StringUtils.hasText(authHeader)) {
            template.header(HttpHeaders.AUTHORIZATION, authHeader);
        } else {
            logger.debug("FeignInterceptor - no Authorization header found to forward");
        }
    }
}
