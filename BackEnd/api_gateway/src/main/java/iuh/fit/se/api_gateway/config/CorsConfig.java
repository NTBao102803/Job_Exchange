package iuh.fit.se.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ Cho phép frontend ở cả local và production
        config.setAllowedOriginPatterns(List.of(
                "https://www.jobsv.online", // domain production
                "https://jobsv.online",
                "http://localhost:5173"     // domain local (Vite)
        ));

        // ✅ Các method HTTP được phép
        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        // ✅ Các header được phép client gửi lên
        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin"
        ));

        // ✅ Cho phép client đọc các header này từ response
        config.setExposedHeaders(List.of(
                "Authorization",
                "Content-Disposition"
        ));

        // ✅ Cho phép gửi cookie/token (vì có JWT hoặc session)
        config.setAllowCredentials(true);

        // ✅ Đăng ký cấu hình cho toàn bộ endpoint của Gateway
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
