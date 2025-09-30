package iuh.fit.se.match_candidate_service.controller;

import iuh.fit.se.match_candidate_service.service.CandidateIndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/match/sync")
public class SyncController {
    @Autowired
    private CandidateIndexService candidateIndexService;

    @PostMapping
    public String syncCandidates() {
        candidateIndexService.syncCandidates();
        return "Synced candidates into Elasticsearch!";
    }

}
