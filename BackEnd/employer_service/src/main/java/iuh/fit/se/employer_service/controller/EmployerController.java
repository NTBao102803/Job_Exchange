package iuh.fit.se.employer_service.controller;

import iuh.fit.se.employer_service.dto.EmployerProfileRequest;
import iuh.fit.se.employer_service.dto.EmployerRegisterRequest;
import iuh.fit.se.employer_service.model.Employer;
import iuh.fit.se.employer_service.service.EmployerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employers")
public class EmployerController {
    @Autowired
    private EmployerService employerService;
    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOtp(@RequestBody EmployerRegisterRequest request) {
        employerService.requestOtp(request);
        return ResponseEntity.ok("OTP đã được gửi tới email của bạn");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Employer> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        Employer employer = employerService.verifyOtp(email, otp);
        return ResponseEntity.ok(employer);
    }
    @PutMapping("/profile")
    public ResponseEntity<Employer> updateProfile(@RequestBody EmployerProfileRequest profileRequest) {
        Employer employer = employerService.updateEmployer(profileRequest);
        return ResponseEntity.ok(employer);
    }

    @GetMapping("/profile")
    public ResponseEntity<Employer> getMyEmployer() {
        return ResponseEntity.ok(employerService.getMyEmployer());
    }
}
