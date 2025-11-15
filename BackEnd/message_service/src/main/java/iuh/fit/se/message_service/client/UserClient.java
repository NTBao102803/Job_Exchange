package iuh.fit.se.message_service.client;

import iuh.fit.se.message_service.dto.CandidateDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", path = "/api/candidate")
public interface UserClient {
    @GetMapping("/by-id/{id}")
    CandidateDto getCandidateById(@PathVariable("id") Long id);

    @GetMapping("/email")
    CandidateDto getCandidateByEmail();
}
