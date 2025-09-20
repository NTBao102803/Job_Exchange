package iuh.fit.se.match_candidate_service.client;

import iuh.fit.se.match_candidate_service.dto.CandidateDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
        name = "user-service",
        url = "${services.user-service-url}",
        configuration = iuh.fit.se.match_candidate_service.config.FeignAuthConfig.class
)
public interface UserClient {
    @GetMapping("/all")
    List<CandidateDto> getCandidates();
}
