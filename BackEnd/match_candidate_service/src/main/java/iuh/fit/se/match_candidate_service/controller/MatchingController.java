package iuh.fit.se.match_candidate_service.controller;

import iuh.fit.se.match_candidate_service.dto.CandidateDto;
import iuh.fit.se.match_candidate_service.dto.MatchResultDto;
import iuh.fit.se.match_candidate_service.service.MatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/match")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<MatchResultDto>> getCandidatesForJob(@PathVariable Long jobId) {
        List<MatchResultDto> candidates = matchingService.findCandidatesForJob(jobId);
        return ResponseEntity.ok(candidates);
    }
}
