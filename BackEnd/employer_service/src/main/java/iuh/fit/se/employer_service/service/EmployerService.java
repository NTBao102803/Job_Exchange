package iuh.fit.se.employer_service.service;


import iuh.fit.se.employer_service.dto.EmployerDto;
import iuh.fit.se.employer_service.dto.EmployerProfileRequest;
import iuh.fit.se.employer_service.dto.EmployerRegisterRequest;
import iuh.fit.se.employer_service.model.Employer;

import java.util.Optional;

public interface EmployerService {
    public void requestOtp(EmployerRegisterRequest request);
    public Employer verifyOtp(String email, String otp);
    public Employer updateEmployer(EmployerProfileRequest profileRequest);
    public Employer getMyEmployer();
    public EmployerDto getEmployerByEmail( String email);
    public Optional<Employer> getEmployerById(Long id);


//    admin duyệt
    public Employer approveEmployer(Long employerId, Long authUserId);
    public Employer rejectEmployer(Long employerId);

}
