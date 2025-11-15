package iuh.fit.se.employer_service.controller;


import iuh.fit.se.employer_service.dto.EmployerDto;
import iuh.fit.se.employer_service.mapper.EmployerMapper;
import iuh.fit.se.employer_service.model.Employer;
import iuh.fit.se.employer_service.repository.EmployerRepository;
import iuh.fit.se.employer_service.service.EmployerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/employers")
@RequiredArgsConstructor
public class AdminEmployerController {

    private final EmployerService employerService;
    private final EmployerMapper employerMapper;

    @GetMapping("/all")
    public ResponseEntity<List<EmployerDto>> getAll() {
        return ResponseEntity.ok(employerService.getAllEmployers());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<EmployerDto> approve(@PathVariable Long id, @RequestParam Long authUserId) {
        Employer e = employerService.approveEmployer(id, authUserId);
        return ResponseEntity.ok(employerMapper.toDto(e));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<EmployerDto> reject(@PathVariable Long id) {
        Employer e = employerService.rejectEmployer(id);
        return ResponseEntity.ok(employerMapper.toDto(e));
    }
}
