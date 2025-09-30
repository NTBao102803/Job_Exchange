package iuh.fit.se.admin_service.controller;

import iuh.fit.se.admin_service.dto.EmployerDto;
import iuh.fit.se.admin_service.service.AdminEmployerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/employers")
public class AdminEmployerController {
    @Autowired
    private AdminEmployerService adminEmployerService;
    @PutMapping("/{id}/approve")
    public ResponseEntity<EmployerDto> approve(@PathVariable Long id,
                                               @RequestParam Long authUserId) {
        return ResponseEntity.ok(adminEmployerService.approveEmployer(id, authUserId));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<EmployerDto> reject(@PathVariable Long id) {
        return ResponseEntity.ok(adminEmployerService.rejectEmployer(id));
    }
    @GetMapping("/all")
    public ResponseEntity<List<EmployerDto>> getAllEmployers() {
        return ResponseEntity.ok(adminEmployerService.getAllEmployers());
    }
}
