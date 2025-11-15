package iuh.fit.se.employer_service.controller;

import iuh.fit.se.employer_service.dto.EmployerDto;
import iuh.fit.se.employer_service.dto.EmployerProfileRequest;
import iuh.fit.se.employer_service.dto.EmployerRegisterRequest;
import iuh.fit.se.employer_service.mapper.EmployerMapper;
import iuh.fit.se.employer_service.model.Employer;
import iuh.fit.se.employer_service.service.EmployerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerService employerService;
    private final EmployerMapper employerMapper;

    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOtp(@RequestBody EmployerRegisterRequest req) {
        employerService.requestOtp(req);
        return ResponseEntity.ok("OTP sent");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<EmployerDto> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        Employer e = employerService.verifyOtp(email, otp);
        return ResponseEntity.ok(employerMapper.toDto(e));
    }

    @PutMapping("/profile")
    public ResponseEntity<EmployerDto> updateProfile(@RequestBody EmployerProfileRequest req) {
        Employer e = employerService.updateEmployer(req);
        return ResponseEntity.ok(employerMapper.toDto(e));
    }

    @GetMapping("/profile")
    public ResponseEntity<EmployerDto> getMyEmployer() {
        Employer e = employerService.getMyEmployer();
        return ResponseEntity.ok(employerMapper.toDto(e));
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<EmployerDto> getEmployerByEmail(@PathVariable String email) {
        return ResponseEntity.ok(employerService.getEmployerByEmail(email));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<EmployerDto> getEmployerById(@PathVariable Long id) {
        return employerService.getEmployerById(id)
                .map(employerMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
