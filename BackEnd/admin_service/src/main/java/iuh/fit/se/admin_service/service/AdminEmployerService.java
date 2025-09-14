package iuh.fit.se.admin_service.service;

import iuh.fit.se.admin_service.dto.EmployerDto;

public interface AdminEmployerService {
    public EmployerDto approveEmployer(Long employerId, Long authUserId);
    public EmployerDto rejectEmployer(Long employerId);
}
