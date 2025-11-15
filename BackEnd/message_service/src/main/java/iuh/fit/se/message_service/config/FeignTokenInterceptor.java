package iuh.fit.se.message_service.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class FeignTokenInterceptor implements RequestInterceptor {

    private static final ThreadLocal<String> TOKEN_HOLDER = new ThreadLocal<>();

    public static void setToken(String token) {
        TOKEN_HOLDER.set(token);
        log.debug("Token set: {}", token.substring(0, 20) + "...");
    }

    public static void clear() {
        TOKEN_HOLDER.remove();
        log.debug("Token cleared");
    }

    @Override
    public void apply(RequestTemplate template) {
        String token = TOKEN_HOLDER.get();
        if (token != null) {
            template.header("Authorization", "Bearer " + token);
            log.debug("FeignTokenInterceptor: Added Authorization header");
        } else {
            log.warn("FeignTokenInterceptor: No token in ThreadLocal");
        }
    }
}
