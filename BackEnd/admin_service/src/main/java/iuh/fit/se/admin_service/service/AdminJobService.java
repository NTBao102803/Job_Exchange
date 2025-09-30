package iuh.fit.se.admin_service.service;

import iuh.fit.se.admin_service.dto.JobDto;

import java.util.List;

public interface AdminJobService {
    List<JobDto> getPending();
    JobDto approve(Long jobId);
    JobDto reject(Long jobId, String reason);
    void delete(Long jobId);
    JobDto getById(Long jobId);
    List<JobDto> getAll();
}
