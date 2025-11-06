package iuh.fit.se.user_service.service.impl;

import iuh.fit.se.user_service.client.MatchClient;
import iuh.fit.se.user_service.dto.CandidateDto;
import iuh.fit.se.user_service.dto.CandidateRequest;
import iuh.fit.se.user_service.mapper.CandidateMapper;
import iuh.fit.se.user_service.model.*;
import iuh.fit.se.user_service.repository.*;
import iuh.fit.se.user_service.service.CandidateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CandidateServiceImpl implements CandidateService {
    private final CandidateRepository candidateRepository;
    private final MatchClient matchClient;

    private final EducationRepository educationRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final CertificateRepository certificateRepository;
    private final CandidateMapper candidateMapper;


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
    public Candidate updateCandidate(CandidateDto dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Candidate candidate = candidateRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile không tồn tại"));

        // Cập nhật thông tin chính
        candidate.setFullName(dto.getFullName());
        candidate.setDob(dto.getDob());
        candidate.setGender(dto.getGender());
        candidate.setPhone(dto.getPhone());
        candidate.setAddress(dto.getAddress());
        candidate.setCareerGoal(dto.getCareerGoal());
        candidate.setHobbies(dto.getHobbies());
        candidate.setSocial(dto.getSocial());

        // === Xử lý Education ===
        candidate.getEducations().clear();
        if (dto.getSchool() != null || dto.getMajor() != null) {
            Education edu = Education.builder()
                    .candidate(candidate)
                    .school(dto.getSchool())
                    .major(dto.getMajor())
                    .gpa(dto.getGpa())
                    .graduationYear(dto.getGraduationYear())
                    .build();
            candidate.getEducations().add(edu);
        }

        // === Xử lý Experience ===
        candidate.getExperiences().clear();
        if (dto.getExperience() != null) {
            Arrays.stream(dto.getExperience().split("\n"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(desc -> Experience.builder().candidate(candidate).description(desc).build())
                    .forEach(candidate.getExperiences()::add);
        }

        // === Xử lý Projects ===
        candidate.getProjects().clear();
        if (dto.getProjects() != null) {
            Arrays.stream(dto.getProjects().split("\n"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(desc -> Project.builder().candidate(candidate).description(desc).build())
                    .forEach(candidate.getProjects()::add);
        }

        // === Xử lý Skills ===
        candidate.getSkills().clear();
        if (dto.getSkills() != null) {
            Arrays.stream(dto.getSkills().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(name -> Skill.builder().candidate(candidate).name(name).build())
                    .forEach(candidate.getSkills()::add);
        }

        // === Xử lý Certificates ===
        candidate.getCertificates().clear();
        if (dto.getCertificates() != null) {
            Arrays.stream(dto.getCertificates().split("\n"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(this::parseCertificate)
                    .filter(Objects::nonNull)
                    .map(cert -> Certificate.builder()
                            .candidate(candidate)
                            .name(cert[0])
                            .issuer(cert[1])
                            .issueDate(LocalDate.parse(cert[2]))
                            .build())
                    .forEach(candidate.getCertificates()::add);
        }

        Candidate saved = candidateRepository.save(candidate);
        CandidateDto syncDto = candidateMapper.toDto(saved);

        try {
            matchClient.syncCandidate(syncDto);
        } catch (Exception ex) {
            System.err.println("Sync failed: " + ex.getMessage());
        }

        return saved;
    }

    @Override
    public Candidate createCandidate(CandidateRequest candidateRequest) {
        Candidate candidate = Candidate.builder()
                .id(candidateRequest.getUserId())
                .email(candidateRequest.getEmail())
                .role(candidateRequest.getRole())
                .fullName(candidateRequest.getFullName())
                .build();

        Candidate saved = candidateRepository.save(candidate);

        // Tạo DTO để sync
        CandidateDto dto = CandidateDto.builder()
                .id(saved.getId())
                .fullName(saved.getFullName())
                .email(saved.getEmail())
                .build();

        try {
            matchClient.syncCandidate(dto);
        } catch (Exception ex) {
            System.err.println("Sync failed: " + ex.getMessage());
        }

        return saved;
    }

    @Override
    public CandidateDto getCandidateByEmail() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Candidate candidate = candidateRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        return candidateMapper.toDto(candidate);
    }

    private String[] parseCertificate(String line) {
        // "Java Certification - Oracle (2023-01-01)"
        Pattern p = Pattern.compile("(.*) - (.*) \\((.*)\\)");
        Matcher m = p.matcher(line);
        return m.matches() ? new String[]{m.group(1), m.group(2), m.group(3)} : null;
    }
}
