package iuh.fit.se.recommendation_service.controller;

import iuh.fit.se.recommendation_service.client.JobClient;
import iuh.fit.se.recommendation_service.dto.*;
import iuh.fit.se.recommendation_service.service.CandidateIndexService;
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
    private final CandidateIndexService candidateIndexService;
    private final JobClient jobClient;

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

    @PostMapping("/sync/jobs")
    public ResponseEntity<String> syncAllJobs() {
        try {
            jobIndexService.syncAllJobs();
            return ResponseEntity.ok("Jobs synced to Elasticsearch");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Sync failed: " + e.getMessage());
        }
    }

    @PostMapping("/sync/candidates")
    public ResponseEntity<String> syncAllCandidates() {
        try {
            candidateIndexService.syncAllCandidates();
            return ResponseEntity.ok("Candidates synced to Elasticsearch");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Sync failed: " + e.getMessage());
        }
    }

    @GetMapping("/candidates/{jobId}")
    public ResponseEntity<List<CandidateMatchDto>> recommendCandidates(@PathVariable Long jobId, @RequestParam(defaultValue = "20") int topK) {
        try {
            JobDto job = jobClient.getJobById(jobId);
            return ResponseEntity.ok(candidateIndexService.recommendCandidatesForJob(job, topK));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(List.of());
        }
    }

}
