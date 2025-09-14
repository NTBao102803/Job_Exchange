package iuh.fit.se.employer_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "auth-service", url = "http://localhost:8081/api/auth")
public interface AuthServiceClient {
    @PostMapping("/request-otp")
    void requestOtp(@RequestBody AuthUserRequest request);

    @PostMapping("/verify-otp")
    AuthUserResponse verifyOtp(@RequestParam("email") String email,
                           @RequestParam("otp") String otp);
}
