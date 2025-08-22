package iuh.fit.se.user_service.service.impl;

import iuh.fit.se.user_service.config.JwtService;
import iuh.fit.se.user_service.dto.LoginRequest;
import iuh.fit.se.user_service.dto.LoginResponse;
import iuh.fit.se.user_service.dto.RegisterRequest;
import iuh.fit.se.user_service.dto.UserResponse;
import iuh.fit.se.user_service.exception.CustomException;
import iuh.fit.se.user_service.model.User;
import iuh.fit.se.user_service.repository.UserRepository;
import iuh.fit.se.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public void register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new CustomException("Username already exists!");
        }
        User user = User.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .email(registerRequest.getEmail())
                .role("USER")
                .active(true)
                .build();
        userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new CustomException("User not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new CustomException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getUsername());
        return new LoginResponse(token);
    }

    @Override
    public UserResponse getUserInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException("User not found"));
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }
}
