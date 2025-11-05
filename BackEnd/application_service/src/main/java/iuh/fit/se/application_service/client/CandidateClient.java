package iuh.fit.se.application_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", path = "/api/candidate")
public interface CandidateClient {
    @GetMapping("/email")
    CandidateDto getCandidateByEmail();

    @GetMapping("/by-id/{id}")
    CandidateDto getCandidateById(@PathVariable("id") Long id);

    record CandidateDto(Long id, String fullName, String email) {}
}
