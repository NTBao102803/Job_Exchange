package iuh.fit.se.application_service.controller;

import iuh.fit.se.application_service.dto.ApplicationDto;
import iuh.fit.se.application_service.dto.ApplicationRequest;
import iuh.fit.se.application_service.model.ApplicationStatus;
import iuh.fit.se.application_service.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {
    private final ApplicationService applicationService;

    // Ứng viên nộp hồ sơ kèm CV
    @PostMapping(value = "/user", consumes = {"multipart/form-data"})
    public ResponseEntity<ApplicationDto> apply(
            @RequestParam Long jobId,
            @RequestPart("file") MultipartFile file
    ) {
        ApplicationRequest request = ApplicationRequest.builder()
                .jobId(jobId)
                .file(file)
                .build();
        return ResponseEntity.ok(applicationService.apply(request));
    }

    // Lấy tất cả đơn ứng tuyển của 1 ứng viên
    @GetMapping("/user/{candidateId}")
    public ResponseEntity<List<ApplicationDto>> getByCandidate(@PathVariable Long candidateId) {
        return ResponseEntity.ok(applicationService.getByCandidate(candidateId));
    }

    // Nhà tuyển dụng lấy tất cả đơn ứng tuyển theo job
    @GetMapping("/employer/job/{jobId}")
    public ResponseEntity<List<ApplicationDto>> getByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getByJob(jobId));
    }

    // Nhà tuyển dụng cập nhật trạng thái đơn ứng tuyển
    @PutMapping("/employer/{id}/status")
    public ResponseEntity<ApplicationDto> updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            @RequestParam(required = false) String rejectReason
    ) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status, rejectReason));
    }
}
