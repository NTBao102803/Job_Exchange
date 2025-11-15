package iuh.fit.se.message_service.client;

import iuh.fit.se.message_service.dto.JobDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "job-service", path = "/api/jobs")
public interface JobClient {
    @GetMapping("/{id}")
    JobDto getJobById(@PathVariable("id") Long id);
}
