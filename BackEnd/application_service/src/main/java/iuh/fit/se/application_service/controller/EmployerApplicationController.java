package iuh.fit.se.application_service.controller;

import iuh.fit.se.application_service.model.Application;
import iuh.fit.se.application_service.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employer/applications")
public class EmployerApplicationController {
    @Autowired
    private ApplicationService applicationService;

    // emloyer duyệt đơn ứng tuyển
    @PutMapping("/{id}/approve")
    public ResponseEntity<Application> approve(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.approvedApplication(id));
    }
    @PutMapping("/{id}/reject")
    public ResponseEntity<Application> reject(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.rejectedApplication(id));
    }
}
