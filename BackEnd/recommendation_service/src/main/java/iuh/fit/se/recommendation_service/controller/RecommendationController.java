package iuh.fit.se.recommendation_service.controller;

import iuh.fit.se.recommendation_service.dto.*;
import iuh.fit.se.recommendation_service.service.JobIndexService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommend/")
@RequiredArgsConstructor
public class RecommendationController {

    private final JobIndexService jobIndexService;

    @GetMapping("/jobs/{userId}")
    public ResponseEntity<List<JobMatchDto>> recommendJobsForUser(@PathVariable Long userId,
                                                                  @RequestParam(defaultValue = "10") int topK) {
        try {
            List<JobMatchDto> results = jobIndexService.recommendJobsForUser(userId, topK);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(List.of());
        }
    }

    // Gợi ý việc làm từ dữ liệu profile gửi trực tiếp (giống cũ)
    @PostMapping("/jobs")
    public ResponseEntity<List<JobMatchDto>> recommendJobs(@RequestBody iuh.fit.se.recommendation_service.dto.CandidateProfile candidate,
                                                           @RequestParam(defaultValue = "10") int topK) {
        try {
            List<JobMatchDto> results = jobIndexService.recommendJobsForCandidate(candidate, topK);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(List.of());
        }
    }

    @PostMapping("/sync/jobs")
    public ResponseEntity<String> syncAllJobs() {
        try {
            jobIndexService.syncAllJobs();
            return ResponseEntity.ok("Jobs synced to Elasticsearch");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Sync failed: " + e.getMessage());
        }
    }

    @PostMapping("/sync/job/{id}")
    public ResponseEntity<String> syncJob(@PathVariable Long id) {
        try {
            jobIndexService.syncJob(id);
            return ResponseEntity.ok("Job " + id + " synced");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Sync failed: " + e.getMessage());
        }
    }
}
