package iuh.fit.se.user_service.controller;

import iuh.fit.se.user_service.dto.CandidateDto;
import iuh.fit.se.user_service.dto.CandidateRequest;
import iuh.fit.se.user_service.mapper.CandidateMapper;
import iuh.fit.se.user_service.model.Candidate;
import iuh.fit.se.user_service.service.CandidateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;
    private final CandidateMapper candidateMapper;

    // TẠO MỚI (internal)
    @PostMapping
    public ResponseEntity<CandidateDto> createCandidate(@Valid @RequestBody CandidateRequest request) {
        Candidate saved = candidateService.createCandidate(request);
        return ResponseEntity.ok(candidateMapper.toDto(saved));
    }

    // TẠO MỚI (nội bộ)
    @PostMapping("/internal")
    public ResponseEntity<CandidateDto> createCandidateInternal(@Valid @RequestBody CandidateRequest request) {
        Candidate saved = candidateService.createCandidate(request);
        return ResponseEntity.ok(candidateMapper.toDto(saved));
    }

    // LẤY TẤT CẢ (CHO MATCH-SERVICE)
    @GetMapping("/all")
    public ResponseEntity<List<CandidateDto>> getAllCandidates() {
        List<Candidate> candidates = candidateService.getCandidates();
        List<CandidateDto> dtos = candidates.stream()
                .map(candidateMapper::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    // LẤY HỒ SƠ THEO TOKEN (người dùng hiện tại)
    @GetMapping
    public ResponseEntity<CandidateDto> getCurrentCandidate() {
        Candidate candidate = candidateService.getCandidate();
        return ResponseEntity.ok(candidateMapper.toDto(candidate));
    }

    // LẤY THEO ID (admin hoặc hệ thống)
    @GetMapping("/by-id/{id}")
    public ResponseEntity<CandidateDto> getCandidateById(@PathVariable Long id) {
        Candidate candidate = candidateService.getCandidateById(id);
        return candidate != null
                ? ResponseEntity.ok(candidateMapper.toDto(candidate))
                : ResponseEntity.notFound().build();
    }

    // LẤY THEO EMAIL (người dùng hiện tại)
    @GetMapping("/email")
    public ResponseEntity<CandidateDto> getCandidateByEmail() {
        return ResponseEntity.ok(candidateService.getCandidateByEmail());
    }

    // CẬP NHẬT HỒ SƠ
    @PutMapping
    public ResponseEntity<CandidateDto> updateCandidate(@RequestBody CandidateDto dto) {
        Candidate updated = candidateService.updateCandidate(dto);
        return ResponseEntity.ok(candidateMapper.toDto(updated));
    }
}