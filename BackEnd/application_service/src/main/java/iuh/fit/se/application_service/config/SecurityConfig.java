package iuh.fit.se.application_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) { this.jwtFilter = jwtFilter; }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // public endpoints
                        .requestMatchers("/actuator/**", "/error").permitAll()

                        // ADMIN quản lý toàn bộ application
                        .requestMatchers("/api/applications/admin/**").hasRole("ADMIN")

                        // USER: apply job, xem application của mình
                        .requestMatchers("/api/applications/user/**").hasRole("USER")

                        // EMPLOYER: xem & cập nhật application cho job mình đăng
                        .requestMatchers("/api/applications/employer/**",
                                "/api/employer/applications/**").hasRole("EMPLOYER")

                        // những request khác => cần login
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}