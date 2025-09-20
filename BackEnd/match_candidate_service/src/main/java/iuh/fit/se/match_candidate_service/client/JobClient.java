package iuh.fit.se.match_candidate_service.client;

import iuh.fit.se.match_candidate_service.dto.JobDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "job-service",
        url = "${services.job-service-url}",
        configuration = iuh.fit.se.match_candidate_service.config.FeignAuthConfig.class
)
public interface JobClient {

    @GetMapping("/{id}")
    JobDto getJobById(@PathVariable("id") Long id);
}
