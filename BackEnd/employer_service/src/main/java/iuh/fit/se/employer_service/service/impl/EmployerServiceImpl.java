package iuh.fit.se.employer_service.service.impl;

import iuh.fit.se.employer_service.client.AuthServiceClient;
import iuh.fit.se.employer_service.dto.*;
import iuh.fit.se.employer_service.mapper.EmployerMapper;
import iuh.fit.se.employer_service.model.Company;
import iuh.fit.se.employer_service.model.Employer;
import iuh.fit.se.employer_service.model.EmployerStatus;
import iuh.fit.se.employer_service.repository.EmployerRepository;
import iuh.fit.se.employer_service.service.EmployerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class EmployerServiceImpl implements EmployerService {

    private final EmployerRepository employerRepository;
    private final AuthServiceClient authServiceClient;
    private final EmployerMapper employerMapper;

    private static final Logger log = LoggerFactory.getLogger(EmployerServiceImpl.class);

    @Override
    public void requestOtp(EmployerRegisterRequest request) {
        authServiceClient.requestOtp(new AuthUserRequest(
                request.getFullName(), request.getEmail(), request.getPassWord(), "EMPLOYER"
        ));

        Employer employer = Employer.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .status(EmployerStatus.WAITING_OTP)
                .build();

        // Tạo Company tạm
        Company company = Company.builder()
                .companyName(request.getCompanyName())
                .companyAddress(request.getCompanyAddress())
                .build();
        employer.setCompany(company);

        employerRepository.save(employer);
    }

    @Override
    public Employer verifyOtp(String email, String otp) {
        AuthUserResponse res = authServiceClient.verifyOtp(email, otp);
        Employer employer = employerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employer not found"));
        employer.setAuthUserId(res.getId());
        employer.setStatus(EmployerStatus.WAITING_APPROVAL);
        return employerRepository.save(employer);
    }

    @Override
    public Employer updateEmployer(EmployerProfileRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Employer employer = employerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employer không tồn tại"));

        // Cập nhật Employer
        employer.setFullName(req.getFullName());
        employer.setPhone(req.getPhone());
        employer.setPosition(req.getPosition());

        // Cập nhật hoặc tạo Company
        Company company = employer.getCompany();
        if (company == null) {
            company = new Company();
            employer.setCompany(company);
        }
        company.setCompanyName(req.getCompanyName());
        company.setCompanyAddress(req.getCompanyAddress());
        company.setCompanySize(req.getCompanySize());
        company.setCompanyField(req.getCompanyField());
        company.setTaxCode(req.getTaxCode());
        company.setBusinessLicense(req.getBusinessLicense());
        company.setCompanyDescription(req.getCompanyDescription());
        company.setCompanyWebsite(req.getCompanyWebsite());
        company.setCompanySocial(req.getCompanySocial());

        // Kiểm tra hoàn tất
        boolean complete = Stream.of(
                req.getFullName(), req.getPhone(), req.getCompanyName(), req.getCompanyAddress(),
                req.getPosition(), req.getCompanyField(), req.getTaxCode(),
                req.getBusinessLicense(), req.getCompanyDescription(), req.getCompanyWebsite()
        ).allMatch(s -> s != null && !s.trim().isEmpty()) && req.getCompanySize() != null;

        employer.setStatus(complete ? EmployerStatus.PENDING : EmployerStatus.WAITING_APPROVAL);
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
        Employer e = employerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employer not found"));
        return employerMapper.toDto(e);
    }

    @Override
    public Optional<Employer> getEmployerById(Long id) {
        return employerRepository.findById(id);
    }

    @Override
    public List<EmployerDto> getAllEmployers() {
        return employerRepository.findAll().stream()
                .map(employerMapper::toDto)
                .toList();
    }

    @Override
    public Employer approveEmployer(Long employerId, Long authUserId) {
        Employer e = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer không tồn tại"));
        if (e.getStatus() != EmployerStatus.PENDING) {
            throw new RuntimeException("Chưa hoàn tất hồ sơ");
        }
        e.setStatus(EmployerStatus.APPROVED);
        e.setAuthUserId(authUserId);
        return employerRepository.save(e);
    }

    @Override
    public Employer rejectEmployer(Long employerId) {
        Employer e = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer không tồn tại"));
        e.setStatus(EmployerStatus.REJECTED);
        return employerRepository.save(e);
    }
}
