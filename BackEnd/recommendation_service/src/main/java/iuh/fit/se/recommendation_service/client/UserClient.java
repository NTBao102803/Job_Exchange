package iuh.fit.se.recommendation_service.client;

import iuh.fit.se.recommendation_service.dto.CandidateProfile;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", path = "/api/candidate")
public interface UserClient {

    @GetMapping("/by-id/{id}")
    CandidateProfile getCandidateById(@PathVariable("id") Long id);
}
