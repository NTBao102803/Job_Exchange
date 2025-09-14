package iuh.fit.se.employer_service.controller;


import iuh.fit.se.employer_service.model.Employer;
import iuh.fit.se.employer_service.repository.EmployerRepository;
import iuh.fit.se.employer_service.service.EmployerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/employers")
public class AdminEmployerController {
    @Autowired
    private EmployerService employerService;

    // Admin duyệt employer
    @PutMapping("/{id}/approve")
    public ResponseEntity<Employer> approveEmployer(
            @PathVariable Long id,
            @RequestParam Long authUserId) {
        return ResponseEntity.ok(employerService.approveEmployer(id, authUserId));
    }

    // Admin từ chối employer
    @PutMapping("/{id}/reject")
    public ResponseEntity<Employer> rejectEmployer(@PathVariable Long id) {
        return ResponseEntity.ok(employerService.rejectEmployer(id));
    }
}
