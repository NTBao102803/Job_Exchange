package iuh.fit.se.user_service.service.impl;

import iuh.fit.se.user_service.client.MatchClient;
import iuh.fit.se.user_service.dto.CandidateDto;
import iuh.fit.se.user_service.dto.CandidateRequest;
import iuh.fit.se.user_service.model.Candidate;
import iuh.fit.se.user_service.repository.CandidateRepository;
import iuh.fit.se.user_service.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CandidateServiceImpl implements CandidateService {
    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private MatchClient matchClient;

    public CandidateServiceImpl(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    @Override
    public List<Candidate> getCandidates() {
        return candidateRepository.findAll();
    }

    @Override
    public Candidate getCandidateById(Long id) {
        return candidateRepository.findById(id).orElse(null);
    }

    @Override
    public Candidate getCandidate() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return candidateRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile không tồn tại"));
    }

    @Override
    public Candidate updateCandidate(CandidateDto candidateDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Candidate candidate = candidateRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile không tồn tại"));
        // thông tin cá nhân
        candidate.setId(candidate.getId());
        candidate.setEmail(candidateDto.getEmail());
        candidate.setRole("USER");
        candidate.setAddress(candidateDto.getAddress());
        candidate.setPhone(candidateDto.getPhone());
        candidate.setGender(candidateDto.getGender());
        candidate.setDob(candidateDto.getDob());
        candidate.setFullName(candidateDto.getFullName());
        // thông tin học vấn
        candidate.setSchool(candidateDto.getSchool());
        candidate.setMajor(candidateDto.getMajor());
        candidate.setGpa(candidateDto.getGpa());
        candidate.setGraduationYear(candidateDto.getGraduationYear());

        // kinh nghiệm & dự án
        candidate.setExperience(candidateDto.getExperience());
        candidate.setProjects(candidateDto.getProjects());
        //kĩ năng & chứng chỉ
        candidate.setSkills(candidateDto.getSkills());
        candidate.setCertificates(candidateDto.getCertificates());

        // Thông tin bổ sung
        candidate.setCareerGoal(candidateDto.getCareerGoal());
        candidate.setHobbies(candidateDto.getHobbies());
        candidate.setSocial(candidateDto.getSocial());

        Candidate saved = candidateRepository.save(candidate);

        CandidateDto dto = CandidateDto.builder()
                .id(saved.getId())
                .fullName(saved.getFullName())
                .email(saved.getEmail())
                .skills(saved.getSkills())
                .experience(saved.getExperience())
                .major(saved.getMajor())
                .school(saved.getSchool())
                .address(saved.getAddress())
                .careerGoal(saved.getCareerGoal())
                .build();

        try {
            matchClient.syncCandidate(dto);
        } catch (Exception ex) {
            System.err.println("Failed to sync candidate update to match-service: " + ex.getMessage());
        }

        return saved;
    }

    @Override
    public Candidate createCandidate(CandidateRequest candidateRequest) {
        Candidate candidate = new Candidate();
        candidate.setId(candidateRequest.getUserId());
        candidate.setEmail(candidateRequest.getEmail());
        candidate.setRole(candidateRequest.getRole());
        candidate.setFullName(candidateRequest.getFullName());

        Candidate saved = candidateRepository.save(candidate);

        // Build CandidateDto để gửi sang match-service
        CandidateDto dto = CandidateDto.builder()
                .id(saved.getId())
                .fullName(saved.getFullName())
                .email(saved.getEmail())
                .skills(saved.getSkills())
                .experience(saved.getExperience())
                .major(saved.getMajor())
                .school(saved.getSchool())
                .address(saved.getAddress())
                .careerGoal(saved.getCareerGoal())
                .build();

        // Gọi REST callback (bọc try/catch)
        try {
            matchClient.syncCandidate(dto);
        } catch (Exception ex) {
            // log & không throw để không làm hỏng dòng chính
            // bạn có thể queue để retry later nếu muốn
            System.err.println("Failed to sync candidate to match-service: " + ex.getMessage());
        }

        return saved;
    }

    @Override
    public CandidateDto getCandidateByEmail() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Candidate candidate = candidateRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Candidate not found with email: " + email));
        return CandidateDto.builder()
                .id(candidate.getId())
                .fullName(candidate.getFullName())
                .dob(candidate.getDob())
                .gender(candidate.getGender())
                .email(candidate.getEmail())
                .phone(candidate.getPhone())
                .role(candidate.getRole())
                .address(candidate.getAddress())
                .school(candidate.getSchool())
                .major(candidate.getMajor())
                .gpa(candidate.getGpa())
                .graduationYear(candidate.getGraduationYear())
                .experience(candidate.getExperience())
                .projects(candidate.getProjects())
                .skills(candidate.getSkills())
                .certificates(candidate.getCertificates())
                .careerGoal(candidate.getCareerGoal())
                .hobbies(candidate.getHobbies())
                .social(candidate.getSocial())
                .build();
    }
}
