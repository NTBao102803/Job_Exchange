package iuh.fit.se.match_candidate_service.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.*;

@Configuration
public class FeignAuthConfig {
    @Bean
    public RequestInterceptor requestInterceptor() {
        return new FeignClientInterceptor();
    }
}
