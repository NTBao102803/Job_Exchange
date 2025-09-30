package iuh.fit.se.user_service.controller;

import iuh.fit.se.user_service.dto.CandidateDto;
import iuh.fit.se.user_service.dto.CandidateRequest;
import iuh.fit.se.user_service.dto.ProfileDto;
import iuh.fit.se.user_service.dto.ProfileRequest;
import iuh.fit.se.user_service.model.Candidate;
import iuh.fit.se.user_service.model.Profile;
import iuh.fit.se.user_service.service.CandidateService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {
    @Autowired
    private CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }


    @PostMapping
    public ResponseEntity<Candidate> createCandidate(@Valid @RequestBody CandidateRequest request) {
        return ResponseEntity.ok(candidateService.createCandidate(request));
    }

    @PostMapping("/internal")
    public ResponseEntity<Candidate> createCandidateInternal(@Valid @RequestBody CandidateRequest request) {
        return ResponseEntity.ok(candidateService.createCandidate(request));
    }
    @GetMapping("/all")
    public ResponseEntity<List<Candidate>> getCandidates() {
        return ResponseEntity.ok(candidateService.getCandidates());
    }

    // 🔹 Lấy profile theo token
    @GetMapping
    public ResponseEntity<Candidate> getCandidate() {
        return ResponseEntity.ok(candidateService.getCandidate());
    }

    @PutMapping
    public ResponseEntity<Candidate> updateCandidate(@RequestBody CandidateDto candidateDto) {
        Candidate updateCandidate = candidateService.updateCandidate(candidateDto);
        return ResponseEntity.ok(updateCandidate);
    }
}
