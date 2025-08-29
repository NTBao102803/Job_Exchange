package iuh.fit.se.auth_service.service;

import iuh.fit.se.auth_service.dto.AuthRequest;
import iuh.fit.se.auth_service.dto.AuthResponse;
import iuh.fit.se.auth_service.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    public void requestOtp(RegisterRequest request);

    AuthResponse verifyOtp(String email, String otp);
}
