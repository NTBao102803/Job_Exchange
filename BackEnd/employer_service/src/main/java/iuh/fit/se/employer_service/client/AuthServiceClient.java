package iuh.fit.se.employer_service.client;

import iuh.fit.se.employer_service.dto.AuthUserRequest;
import iuh.fit.se.employer_service.dto.AuthUserResponse;
import iuh.fit.se.employer_service.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@FeignClient(name = "auth-service", url = "http://localhost:8081/api/auth")
public interface AuthServiceClient {
    @PostMapping("/request-otp")
    void requestOtp(@RequestBody AuthUserRequest request);

    @PostMapping("/verify-otp")
    AuthUserResponse verifyOtp(@RequestParam("email") String email,
                               @RequestParam("otp") String otp);
    @GetMapping("/by-email")
    ResponseEntity<UserResponse> getUserByEmail(@RequestParam("email") String email);
}
