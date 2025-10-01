package iuh.fit.se.user_service.client;

import iuh.fit.se.user_service.dto.CandidateDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "match-candidate-service", path = "/api/match/sync")
public interface MatchClient {

    @PostMapping("/candidate")
    void syncCandidate(@RequestBody CandidateDto candidate);

    @DeleteMapping("/candidate/{id}")
    void deleteCandidate(@PathVariable("id") Long id);
}
