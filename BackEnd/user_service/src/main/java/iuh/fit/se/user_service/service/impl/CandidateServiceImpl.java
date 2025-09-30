package iuh.fit.se.user_service.service.impl;

import iuh.fit.se.user_service.dto.CandidateDto;
import iuh.fit.se.user_service.dto.CandidateRequest;
import iuh.fit.se.user_service.model.Candidate;
import iuh.fit.se.user_service.repository.CandidateRepository;
import iuh.fit.se.user_service.repository.ProfileRepository;
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

        return candidateRepository.save(candidate);
    }

    @Override
    public Candidate createCandidate(CandidateRequest candidateRequest) {
        Candidate candidate = new Candidate();
        candidate.setId(candidateRequest.getUserId());
        candidate.setEmail(candidateRequest.getEmail());
        candidate.setRole(candidateRequest.getRole());
        candidate.setFullName(candidateRequest.getFullName());

        return candidateRepository.save(candidate);
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
