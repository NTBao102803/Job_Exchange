package iuh.fit.se.employer_service.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Vô hiệu hóa CSRF cho API
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/employers/request-otp",
                                "/api/employers/verify-otp"
                        ).permitAll()

                        // Endpoint lấy thông tin employer cho USER/EMPLOYER/ADMIN
                        .requestMatchers("/api/employers/id/**").hasAnyRole("USER", "EMPLOYER", "ADMIN")

                        // Yêu cầu vai trò ADMIN cho các endpoint admin
                        .requestMatchers("/api/admin/employers/**").hasRole("ADMIN")

                        // Yêu cầu vai trò EMPLOYER hoặc ADMIN cho các endpoint employer khác
                        .requestMatchers("/api/employers/**").hasAnyRole("EMPLOYER", "ADMIN")

                        // Tất cả các request khác yêu cầu xác thực
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
