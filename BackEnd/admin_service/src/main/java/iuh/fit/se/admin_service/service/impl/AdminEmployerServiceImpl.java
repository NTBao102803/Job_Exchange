package iuh.fit.se.admin_service.service.impl;

import iuh.fit.se.admin_service.client.EmployerClient;
import iuh.fit.se.admin_service.dto.EmployerDto;
import iuh.fit.se.admin_service.service.AdminEmployerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminEmployerServiceImpl implements AdminEmployerService {
    @Autowired
    private EmployerClient employerClient;

    @Override
    public EmployerDto rejectEmployer(Long employerId) {
        return employerClient.rejectEmployer(employerId);
    }

    @Override
    public EmployerDto approveEmployer(Long employerId, Long authUserId) {
        return employerClient.approveEmployer(employerId, authUserId);
    }
}
