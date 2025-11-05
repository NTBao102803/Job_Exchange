package iuh.fit.se.application_service.service;

import iuh.fit.se.application_service.dto.ApplicationDto;
import iuh.fit.se.application_service.dto.ApplicationRequest;
import iuh.fit.se.application_service.model.Application;
import iuh.fit.se.application_service.model.ApplicationStatus;

import java.util.List;

public interface ApplicationService {
    ApplicationDto apply(ApplicationRequest request);
    List<ApplicationDto> getByCandidate(Long candidateId);
    List<ApplicationDto> getByJob(Long jobId);
    ApplicationDto updateStatus(Long applicationId, ApplicationStatus status, String rejectReason);
    Application approvedApplication(Long applicationId);
    Application rejectedApplication(Long applicationId);
}
