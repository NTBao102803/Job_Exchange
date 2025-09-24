package iuh.fit.se.employer_service.service.impl;

import iuh.fit.se.employer_service.client.AuthServiceClient;
import iuh.fit.se.employer_service.dto.*;
import iuh.fit.se.employer_service.model.Employer;
import iuh.fit.se.employer_service.model.EmployerStatus;
import iuh.fit.se.employer_service.repository.EmployerRepository;
import iuh.fit.se.employer_service.service.EmployerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployerServiceImpl implements EmployerService {
    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private AuthServiceClient authServiceClient;

    private static final Logger logger = LoggerFactory.getLogger(EmployerServiceImpl.class);

    @Override
    public void requestOtp(EmployerRegisterRequest request) {
        // 1. Gửi OTP qua Auth Service
        AuthUserRequest registerRequest = new AuthUserRequest(
                request.getFullName(),
                request.getEmail(),
                request.getPassWord(),
                "EMPLOYER"
        );
        authServiceClient.requestOtp(registerRequest);

        // 2. Lưu employer tạm (chưa có authUserId)
        Employer employer = new Employer();
        employer.setEmail(request.getEmail());
        employer.setFullName(request.getFullName());
        employer.setPhone(request.getPhone());
        employer.setCompanyName(request.getCompanyName());
        employer.setCompanyAddress(request.getCompanyAddress());
        employer.setStatus(EmployerStatus.WAITING_OTP);
        employerRepository.save(employer);
    }

    @Override
    public Employer verifyOtp(String email, String otp) {
        // 1. Gọi Auth Service verify OTP
        AuthUserResponse authResponse = authServiceClient.verifyOtp(email, otp);

        // 2. Update employer
        Employer employer = employerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employer not found"));
        employer.setAuthUserId(authResponse.getId());
        employer.setStatus(EmployerStatus.WAITING_APPROVAL);
        return employerRepository.save(employer);
    }

    @Override
    public Employer approveEmployer(Long employerId, Long authUserId) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer không tồn tại"));


        if(employer.getStatus() != EmployerStatus.PENDING) {
            throw new RuntimeException("Employer chưa hoàn tất hồ sơ");
        }
        employer.setStatus(EmployerStatus.APPROVED);
        employer.setAuthUserId(authUserId);

        return employerRepository.save(employer);
    }

    @Override
    public Employer rejectEmployer(Long employerId) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer không tồn tại"));

        employer.setStatus(EmployerStatus.REJECTED);

        return employerRepository.save(employer);
    }

    @Override
    public Employer updateEmployer(EmployerProfileRequest profileRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Employer employer = employerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employer không tồn tại"));

        // Call sang authServiceClient và log kết quả
        UserResponse userResponse = authServiceClient.getUserByEmail(email).getBody();
        if (userResponse != null) {
            logger.info("Successfully fetched user details from auth service. User ID: {}", userResponse.getId());
            employer.setAuthUserId(userResponse.getId());
        } else {
            logger.warn("Could not fetch user details from auth service for email: {}", email);
        }

        employer.setAuthUserId(userResponse.getId());
        employer.setFullName(profileRequest.getFullName());
        employer.setPhone(profileRequest.getPhone());
        employer.setCompanyName(profileRequest.getCompanyName());
        employer.setCompanyAddress(profileRequest.getCompanyAddress());
        employer.setPosition(profileRequest.getPosition());
        employer.setCompanySize(profileRequest.getCompanySize());
        employer.setCompanyField(profileRequest.getCompanyField());
        employer.setTaxCode(profileRequest.getTaxCode());
        employer.setBusinessLicense(profileRequest.getBusinessLicense());
        employer.setCompanyDescription(profileRequest.getCompanyDescription());
        employer.setCompanyWebsite(profileRequest.getCompanyWebsite());
        employer.setCompanySocial(profileRequest.getCompanySocial());

        // ✅ Kiểm tra thông tin đã đủ chưa
        boolean isComplete =
                isNotBlank(profileRequest.getFullName()) &&
                        isNotBlank(profileRequest.getPhone()) &&
                        isNotBlank(profileRequest.getCompanyName()) &&
                        isNotBlank(profileRequest.getCompanyAddress()) &&
                        isNotBlank(profileRequest.getPosition()) &&
                        profileRequest.getCompanySize() != null &&
                        isNotBlank(profileRequest.getCompanyField()) &&
                        isNotBlank(profileRequest.getTaxCode()) &&
                        isNotBlank(profileRequest.getBusinessLicense()) &&
                        isNotBlank(profileRequest.getCompanyDescription()) &&
                        isNotBlank(profileRequest.getCompanyWebsite());

        if (isComplete) {
            employer.setStatus(EmployerStatus.PENDING); // Pending
        } else {
            employer.setStatus(EmployerStatus.WAITING_APPROVAL); // hoặc giữ nguyên employer.getStatus()
        }

        return employerRepository.save(employer);
    }

    @Override
    public Employer getMyEmployer() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return employerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employer not found"));
    }

    @Override
    public EmployerDto getEmployerByEmail(String email) {
        Employer employer = employerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employer not found"));
        return EmployerMapper.toDto(employer);
    }

    @Override
    public Optional<Employer> getEmployerById(Long id) {
        return employerRepository.findById(id);
    }

    @Override
    public List<EmployerDto> getAllEmployers() {
        logger.info("Attempting to fetch all employers from the database.");
        List<Employer> employers = employerRepository.findAll();
        logger.info("Found {} employers in the database.", employers.size());
        List<EmployerDto> employerDtos = employers.stream()
                .map(employer -> {
                    // Log the ID of each employer being converted
                    logger.debug("Converting employer with ID: {}", employer.getId());
                    return EmployerMapper.toDto(employer);
                })
                .collect(Collectors.toList());
        logger.info("Successfully converted {} employers to DTOs.", employerDtos.size());
        return employerDtos;
    }

    private boolean isNotBlank(String str) {
        return str != null && !str.trim().isEmpty();
    }
}
