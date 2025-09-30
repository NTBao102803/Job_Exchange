package iuh.fit.se.job_service.client;

import iuh.fit.se.job_service.dto.EmployerDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "employer-service", path = "/api/employers")
public interface EmployerClient {
    @GetMapping("/by-email/{email}")
    public EmployerDto getEmployerByEmail(@PathVariable("email") String email);
}
