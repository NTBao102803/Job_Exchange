package iuh.fit.se.auth_service.service;

import iuh.fit.se.auth_service.dto.AuthRequest;
import iuh.fit.se.auth_service.dto.AuthResponse;
import iuh.fit.se.auth_service.dto.RegisterRequest;
import iuh.fit.se.auth_service.dto.UserResponse;
import iuh.fit.se.auth_service.model.User;

import java.util.Optional;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    public void requestOtp(RegisterRequest request);
    AuthResponse verifyOtp(String email, String otp);
    UserResponse getUserByEmail(String email);
}
