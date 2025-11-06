package iuh.fit.se.match_candidate_service.controller;

import iuh.fit.se.match_candidate_service.client.JobClient;
import iuh.fit.se.match_candidate_service.dto.CandidateMatchDto;
import iuh.fit.se.match_candidate_service.dto.JobDto;
import iuh.fit.se.match_candidate_service.model.CandidateIndex;
import iuh.fit.se.match_candidate_service.service.CandidateIndexService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
public class MatchingController {

    private final CandidateIndexService candidateIndexService;
    private final JobClient jobClient;

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<CandidateMatchDto>> getCandidatesForJob(@PathVariable Long jobId) {
        // 🔹 Option 1: đảm bảo ES luôn mới nhất
        candidateIndexService.syncCandidates();
        JobDto job = jobClient.getJobById(jobId);
        List<CandidateMatchDto> candidates = candidateIndexService.searchCandidatesForJob(job, 20);
        return ResponseEntity.ok(candidates);
    }
}
