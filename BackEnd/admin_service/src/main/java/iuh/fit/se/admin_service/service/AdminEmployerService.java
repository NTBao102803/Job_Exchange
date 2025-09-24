package iuh.fit.se.admin_service.service;

import iuh.fit.se.admin_service.dto.EmployerDto;

import java.util.List;

public interface AdminEmployerService {
    public EmployerDto approveEmployer(Long employerId, Long authUserId);
    public EmployerDto rejectEmployer(Long employerId);
    List<EmployerDto> getAllEmployers();
}
