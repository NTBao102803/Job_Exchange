package iuh.fit.se.application_service.controller;

import iuh.fit.se.application_service.dto.ApplicationDto;
import iuh.fit.se.application_service.dto.ApplicationRequest;
import iuh.fit.se.application_service.model.Application;
import iuh.fit.se.application_service.model.ApplicationStatus;
import iuh.fit.se.application_service.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {
    private final ApplicationService applicationService;

    @PostMapping("/user")
    public ResponseEntity<ApplicationDto> apply(@RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.apply(request));
    }

    @GetMapping(("/user/{candidateId}"))
    public ResponseEntity<List<ApplicationDto>> getByCandidate(@PathVariable Long candidateId) {
        return ResponseEntity.ok(applicationService.getByCandidate(candidateId));
    }

    @GetMapping("/employer/job/{jobId}")
    public ResponseEntity<List<ApplicationDto>> getByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getByJob(jobId));
    }

    @PutMapping("/employer/{id}/status")
    public ResponseEntity<ApplicationDto> updateStatus(@PathVariable Long id, @RequestParam ApplicationStatus status, @RequestBody String rejectReason) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status, rejectReason));
    }
}
