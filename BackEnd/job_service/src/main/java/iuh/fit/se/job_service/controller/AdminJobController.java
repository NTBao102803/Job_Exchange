package iuh.fit.se.job_service.controller;

import iuh.fit.se.job_service.dto.JobDto;
import iuh.fit.se.job_service.dto.RejectRequest;
import iuh.fit.se.job_service.model.JobStatus;
import iuh.fit.se.job_service.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/jobs")
public class AdminJobController {
    @Autowired
    private JobService jobService;
    // Admin APIs
    @GetMapping("/status/{status}")
    public List<JobDto> getJobsByStatus(@PathVariable JobStatus status) {
        return jobService.getJobsByStatus(status);
    }
    @GetMapping("/pending")
    public List<JobDto> getPendingJobs() {
        return jobService.getJobsByStatus(JobStatus.PENDING);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<JobDto> approveJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.approveJob(id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<JobDto> rejectJob(@PathVariable Long id, @RequestBody(required = false) RejectRequest body) {
        return ResponseEntity.ok(jobService.rejectJob(id, body != null ? body.getReason() : null));
    }
    @GetMapping
    public List<JobDto> getAllJobs() {
        return jobService.getAllJobs();
    }
}
