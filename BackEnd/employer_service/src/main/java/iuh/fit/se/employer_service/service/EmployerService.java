package iuh.fit.se.employer_service.service;


import iuh.fit.se.employer_service.dto.EmployerRegisterRequest;
import iuh.fit.se.employer_service.model.Employer;

public interface EmployerService {
    public void requestOtp(EmployerRegisterRequest request);
    public Employer verifyOtp(String email, String otp);

//    admin duyệt
    public Employer approveEmployer(Long employerId, Long authUserId);
    public Employer rejectEmployer(Long employerId);
}
