package iuh.fit.se.message_service.client;

import iuh.fit.se.message_service.dto.EmployerDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "employer-service", path = "/api/employers")
public interface EmployerClient {
    @GetMapping("/id/{id}")
    EmployerDto getEmployerById(@PathVariable("id") Long id);

    @GetMapping("/profile")
    EmployerDto getMyEmployer();
}
