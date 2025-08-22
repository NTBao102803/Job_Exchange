package iuh.fit.se.user_service.service;

import iuh.fit.se.user_service.dto.LoginRequest;
import iuh.fit.se.user_service.dto.LoginResponse;
import iuh.fit.se.user_service.dto.RegisterRequest;
import iuh.fit.se.user_service.dto.UserResponse;

public interface UserService {
    void register(RegisterRequest registerRequest);
    LoginResponse login(LoginRequest loginRequest);
    UserResponse getUserInfo(String username);
}
