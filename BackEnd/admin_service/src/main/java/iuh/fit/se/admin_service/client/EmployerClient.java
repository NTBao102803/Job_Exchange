package iuh.fit.se.admin_service.client;

import iuh.fit.se.admin_service.dto.EmployerDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "api-gateway", path = "/api/admin/employers")
public interface EmployerClient {
    @PutMapping("/{id}/approve")
    EmployerDto approveEmployer(@PathVariable("id") Long id,
                                @RequestParam("authUserId") Long authUserId);

    @PutMapping("/{id}/reject")
    EmployerDto rejectEmployer(@PathVariable("id") Long id);
}
