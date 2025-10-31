package iuh.fit.se.notification_service.config;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class AuthHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    public AuthHandshakeInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {

        if (attributes == null) {
            attributes = new HashMap<>(); // ✅ tránh null
        }

        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getServletRequest();

            String token = null;

            try {
                // 1️⃣ Ưu tiên lấy từ header
                String headerAuth = httpRequest.getHeader("Authorization");
                if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
                    token = headerAuth.substring(7);
                    System.out.println("🔹 Token từ Header: " + token.substring(0, Math.min(token.length(), 20)) + "...");
                }

                // 2️⃣ Nếu không có, lấy từ query param
                if (token == null) {
                    String queryToken = httpRequest.getParameter("token");
                    if (queryToken != null) {
                        token = URLDecoder.decode(queryToken, StandardCharsets.UTF_8);
                        System.out.println("🔹 Token từ query param: " + token.substring(0, Math.min(token.length(), 20)) + "...");
                    } else {
                        System.out.println("⚠️ Không tìm thấy token trong Header hoặc query param");
                    }
                }

                // 3️⃣ Kiểm tra token
                if (token == null || !jwtUtil.validateToken(token)) {
                    System.out.println("❌ Invalid or missing JWT token for WS handshake");
                    response.setStatusCode(HttpStatus.FORBIDDEN);
                    return false;
                }

                // 4️⃣ Token hợp lệ → lưu user info
                String username = jwtUtil.extractUsername(token);
//                String role = jwtUtil.extractRole(token);
                Claims claims = jwtUtil.extractAllClaims(token);
                List<String> roles = claims.get("roles", List.class);
                attributes.put("username", username);
                attributes.put("roles", roles);

                System.out.println("✅ WebSocket connected by user: " + username + " (" + roles + ")");
                return true;

            } catch (Exception e) {
                System.out.println("🔥 Lỗi trong beforeHandshake: " + e.getMessage());
                response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
                return false;
            }
        }

        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {
    }
}
