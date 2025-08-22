package iuh.fit.se.user_service.controller;

import iuh.fit.se.user_service.dto.LoginRequest;
import iuh.fit.se.user_service.dto.LoginResponse;
import iuh.fit.se.user_service.dto.RegisterRequest;
import iuh.fit.se.user_service.dto.UserResponse;
import iuh.fit.se.user_service.model.User;
import iuh.fit.se.user_service.repository.UserRepository;
import iuh.fit.se.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        userService.register(request);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @GetMapping("/{username}")
    public UserResponse getUser(@PathVariable String username) {
        return userService.getUserInfo(username);
    }
}
