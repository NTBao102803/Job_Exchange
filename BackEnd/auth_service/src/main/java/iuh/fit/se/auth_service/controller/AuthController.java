package iuh.fit.se.auth_service.controller;

import iuh.fit.se.auth_service.config.JwtService;
import iuh.fit.se.auth_service.dto.AuthRequest;
import iuh.fit.se.auth_service.dto.AuthResponse;
import iuh.fit.se.auth_service.dto.RegisterRequest;
import iuh.fit.se.auth_service.repository.RoleRepository;
import iuh.fit.se.auth_service.repository.UserRepository;
import iuh.fit.se.auth_service.repository.VerificationTokenRepository;
import iuh.fit.se.auth_service.service.AuthService;
import iuh.fit.se.auth_service.service.EmailService;
import iuh.fit.se.auth_service.service.impl.CustomUserDetailsService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthService authService;


    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VerificationTokenRepository verificationTokenRepository;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOtp(@Valid @RequestBody RegisterRequest request) {
        authService.requestOtp(request);
        return ResponseEntity.ok("OTP đã được gửi đến email của bạn");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        AuthResponse response = authService.verifyOtp(email, otp);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest loginRequest, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(loginRequest);
        addJwtCookie(response, authResponse.getAccessToken(), "jwtToken");
        addJwtCookie(response, authResponse.getRefreshToken(), "refreshToken");
        return ResponseEntity.ok(authResponse);
    }


    private void addJwtCookie(HttpServletResponse response, String token, String cookieName) {
        Cookie jwtCookie = new Cookie(cookieName, token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(24 * 60 * 60);
        jwtCookie.setAttribute("SameSite", "Strict");
        response.addCookie(jwtCookie);
    }
}
