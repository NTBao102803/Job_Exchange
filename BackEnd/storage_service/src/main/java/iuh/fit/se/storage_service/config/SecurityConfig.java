package iuh.fit.se.storage_service.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // cho phép auth-service gọi tạo record rỗng
                        .requestMatchers(HttpMethod.POST, "/api/storage/init").permitAll()

                        // upload file: chỉ user
                        .requestMatchers(HttpMethod.POST, "/api/storage/upload").hasAnyRole("USER", "EMPLOYER")

                        // ✅ Cho phép public xem avatar
                        .requestMatchers(HttpMethod.GET, "/api/storage/avatar-url").permitAll()

                        // lấy file: user/employer/admin đều có thể
                        .requestMatchers(HttpMethod.GET, "/api/storage/user/**").hasAnyRole("USER", "EMPLOYER", "ADMIN")

                        // admin quản lý storage (nếu có sau này)
                        .requestMatchers("/api/storage/admin/**").hasRole("ADMIN")

                        // còn lại thì phải login
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
