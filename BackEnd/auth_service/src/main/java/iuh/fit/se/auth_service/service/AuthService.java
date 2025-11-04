package iuh.fit.se.auth_service.service;

import iuh.fit.se.auth_service.dto.*;
import iuh.fit.se.auth_service.model.User;

import java.util.List;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    public void requestOtp(RegisterRequest request);
    AuthResponse verifyOtp(String email, String otp);
    UserResponse getUserByEmail(String email);
    public void forgotPassword(String email);
    public void resetPassword(ResetPasswordRequest request);
    public void changePassword(String usernameOrEmail, ChangePasswordRequest request);
    UserResponse lockUser(Long userId);
    UserResponse unlockUser(Long userId);
    public List<UserResponse> getAllUsers();
}
