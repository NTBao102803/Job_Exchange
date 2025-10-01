package iuh.fit.se.match_candidate_service.controller;

import iuh.fit.se.match_candidate_service.dto.CandidateDto;
import iuh.fit.se.match_candidate_service.service.CandidateIndexService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/match/sync")
@RequiredArgsConstructor
public class SyncController {
    private final CandidateIndexService candidateIndexService;

    @PostMapping("/all")
    public String syncCandidates() {
        candidateIndexService.syncCandidates();
        return "Synced candidates into Elasticsearch!";
    }

    @PostMapping("/candidate")
    public ResponseEntity<String> syncCandidate(@RequestBody CandidateDto dto) {
        candidateIndexService.upsertCandidate(dto);
        return ResponseEntity.ok("Candidate synced to Elasticsearch");
    }

    @DeleteMapping("/candidate/{id}")
    public ResponseEntity<String> deleteCandidate(@PathVariable Long id) {
        candidateIndexService.deleteById(id);
        return ResponseEntity.ok("Candidate deleted from Elasticsearch");
    }
}
