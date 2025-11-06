package iuh.fit.se.recommendation_service.client;

import iuh.fit.se.recommendation_service.dto.JobDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "job-service", path = "/api/jobs")
public interface JobClient {
    @GetMapping("/public")
    List<JobDto> getAllJobs(); // adjust path to your job-service API

    @GetMapping("/{id}")
    JobDto getJobById(@PathVariable("id") Long id);
}
