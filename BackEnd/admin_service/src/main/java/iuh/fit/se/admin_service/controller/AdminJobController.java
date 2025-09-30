package iuh.fit.se.admin_service.controller;

import iuh.fit.se.admin_service.client.JobClient;
import iuh.fit.se.admin_service.dto.JobDto;
import iuh.fit.se.admin_service.dto.RejectRequest;
import iuh.fit.se.admin_service.service.AdminJobService;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/jobs")
public class AdminJobController {

    @Autowired
    private AdminJobService service;
    @Autowired
    private JobClient jobClient;

    private static final Logger logger = LoggerFactory.getLogger(AdminJobController.class);

    public AdminJobController(AdminJobService service) { this.service = service; }

    @GetMapping("/pending")
    public ResponseEntity<List<JobDto>> pending() {
        logger.info("🎯 Admin accessed pending jobs");
        return ResponseEntity.ok(jobClient.getPending());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<JobDto> approve(@PathVariable Long id) {
        return ResponseEntity.ok(jobClient.approve(id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<JobDto> reject(@PathVariable Long id,
                                         @RequestBody(required = false) RejectRequest reason) {
        return ResponseEntity.ok(jobClient.reject(id, reason));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        jobClient.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> byId(@PathVariable Long id) {
        return ResponseEntity.ok(jobClient.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<JobDto>> all() {
        return ResponseEntity.ok(jobClient.getAll());
    }

}
