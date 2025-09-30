package iuh.fit.se.job_service.controller;

import iuh.fit.se.job_service.dto.JobDto;
import iuh.fit.se.job_service.dto.JobRequest;
import iuh.fit.se.job_service.dto.RejectRequest;
import iuh.fit.se.job_service.model.JobStatus;
import iuh.fit.se.job_service.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    @Autowired
    private JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // CRUD
    @GetMapping
    public List<JobDto> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/jobByEmployer")
    public List<JobDto> getAllJobsByEmail() {
        return jobService.getAllJobsByEmail();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public JobDto createJob(@RequestBody JobRequest jobRequest) {
        return jobService.createJob(jobRequest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobDto> updateJob(@PathVariable Long id, @RequestBody JobRequest jobRequest) {
        return ResponseEntity.ok(jobService.updateJob(id, jobRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public List<JobDto> getJobsByStatus(@PathVariable JobStatus status) {
        return jobService.getJobsByStatus(status);
    }

    @GetMapping("/statusByEmployer/{status}")
    public List<JobDto> getJobsByStatusByEmployer(@PathVariable JobStatus status) {
        return jobService.getJobsByStatusByEmployer(status);
    }

    @GetMapping("/public")
    public List<JobDto> getAllPublicJobs() {
        return jobService.getJobsByStatus(JobStatus.APPROVED);
    }
    // Admin APIs
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
}
