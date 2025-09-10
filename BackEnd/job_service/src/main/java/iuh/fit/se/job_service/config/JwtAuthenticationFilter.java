package iuh.fit.se.job_service.config;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header == null || !header.startsWith("Bearer ")) {
            logger.warn("❌ No Authorization header found for URI: {}", request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            if (jwtUtil.validateToken(token)) {
                Claims claims = jwtUtil.extractAllClaims(token);
                String username = claims.getSubject();

                // lấy roles từ token
                List<String> roles = claims.get("roles", List.class);

                if (roles == null || roles.isEmpty()) {
                    logger.warn("⚠️ No roles found in token for user: {}", username);
                } else {
                    logger.info("✅ User [{}] authenticated with roles: {}", username, roles);
                }

                List<SimpleGrantedAuthority> authorities = roles != null
                        ? roles.stream()
                        .map(r -> r.startsWith("ROLE_") ? r : "ROLE_" + r)
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList())
                        : List.of();

                logger.info("🔑 Authorities set for user [{}]: {}", username, authorities);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);

                SecurityContextHolder.getContext().setAuthentication(auth);

            } else {
                logger.error("❌ Invalid JWT token for URI: {}", request.getRequestURI());
            }
        } catch (Exception e) {
            logger.error("🔥 JWT processing error at {}: {}", request.getRequestURI(), e.getMessage(), e);
        }


        filterChain.doFilter(request, response);
    }
}
