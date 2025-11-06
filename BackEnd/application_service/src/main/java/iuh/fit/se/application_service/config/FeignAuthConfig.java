package iuh.fit.se.application_service.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignAuthConfig {

    private static final Logger logger = LoggerFactory.getLogger(FeignAuthConfig.class);

    @Bean
    public RequestInterceptor requestInterceptor() {
        return (RequestTemplate template) -> {
            RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();

            if (requestAttributes instanceof ServletRequestAttributes attrs) {
                HttpServletRequest request = attrs.getRequest();
                String authHeader = request.getHeader("Authorization");

                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String shortToken = authHeader.length() > 20
                            ? authHeader.substring(0, 20) + "..."
                            : authHeader;

                    logger.info("✅ Forwarding Authorization header to {} with token: {}",
                            template.url(), shortToken);

                    template.header("Authorization", authHeader);
                } else {
                    logger.warn("⚠️ No Authorization header found in request for {}", template.url());
                }
            } else {
                logger.error("❌ No ServletRequestAttributes available, cannot forward Authorization header!");
            }
        };
    }
}
