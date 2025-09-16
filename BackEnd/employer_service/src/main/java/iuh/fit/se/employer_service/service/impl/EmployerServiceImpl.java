package iuh.fit.se.employer_service.service.impl;

import iuh.fit.se.employer_service.client.AuthServiceClient;
import iuh.fit.se.employer_service.client.AuthUserRequest;
import iuh.fit.se.employer_service.client.AuthUserResponse;
import iuh.fit.se.employer_service.dto.EmployerProfileRequest;
import iuh.fit.se.employer_service.dto.EmployerRegisterRequest;
import iuh.fit.se.employer_service.model.Employer;
import iuh.fit.se.employer_service.model.EmployerStatus;
import iuh.fit.se.employer_service.repository.EmployerRepository;
import iuh.fit.se.employer_service.service.EmployerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployerServiceImpl implements EmployerService {
    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private AuthServiceClient authServiceClient;



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
        Employer employer = employerRepository.findByEmail((email)
                .describeConstable().orElseThrow(() -> new RuntimeException("Employer not found")));
        employer.setAuthUserId(authResponse.getId());
        employer.setStatus(EmployerStatus.PENDING);
        return employerRepository.save(employer);
    }

    @Override
    public Employer approveEmployer(Long employerId, Long authUserId) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer không tồn tại"));

        if(employer.getStatus() != EmployerStatus.WAITING_APPROVAL) {
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
    public Employer updateEmployer(Long employerId, EmployerProfileRequest profileRequest) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer không tồn tại"));

        employer.setFullName(profileRequest.getFullName());
        employer.setPhone(profileRequest.getPhone());
        employer.setCompanyName(profileRequest.getCompanyName());
        employer.setCompanyAddress(profileRequest.getCompanyAddress());
        employer.setStatus(EmployerStatus.WAITING_APPROVAL);
        employer.setPosition(profileRequest.getPosition());
        employer.setCompanySize(profileRequest.getCompanySize());
        employer.setCompanyField(profileRequest.getCompanyField());
        employer.setTaxCode(profileRequest.getTaxCode());
        employer.setBusinessLicense(profileRequest.getBusinessLicense());
        employer.setCompanyDescription(profileRequest.getCompanyDescription());
        employer.setCompanyWebsite(profileRequest.getCompanyWebsite());
        employer.setCompanySocial(profileRequest.getCompanySocial());

        return employerRepository.save(employer);
    }
}
