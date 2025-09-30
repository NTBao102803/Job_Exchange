package iuh.fit.se.admin_service.client;

import iuh.fit.se.admin_service.config.FeignAuthConfig;
import iuh.fit.se.admin_service.dto.JobDto;
import iuh.fit.se.admin_service.dto.RejectRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "job-service", path = "/api/admin/jobs")
public interface JobClient {
    @GetMapping("/pending")
    List<JobDto> getPending();

    @PostMapping("/{id}/approve")
    JobDto approve(@PathVariable("id") Long id);

    @PostMapping("/{id}/reject")
    JobDto reject(@PathVariable("id") Long id, @RequestBody(required = false) RejectRequest body);

    @DeleteMapping("/{id}")
    void delete(@PathVariable("id") Long id);

    @GetMapping("/{id}")
    JobDto getById(@PathVariable("id") Long id);

    @GetMapping
    List<JobDto> getAll();
}
