package iuh.fit.se.admin_service.client;

import iuh.fit.se.admin_service.dto.EmployerDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "employer-service", path = "/api/admin/employers")
public interface EmployerClient {
    @PutMapping("/{id}/approve")
    EmployerDto approveEmployer(@PathVariable("id") Long id,
                                @RequestParam("authUserId") Long authUserId);

    @PutMapping("/{id}/reject")
    EmployerDto rejectEmployer(@PathVariable("id") Long id);
    @GetMapping("/all")
    public ResponseEntity<List<EmployerDto>> getAllEmployers();
}
