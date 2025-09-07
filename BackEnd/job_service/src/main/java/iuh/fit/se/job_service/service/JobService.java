package iuh.fit.se.job_service.service;

import iuh.fit.se.job_service.dto.JobDto;
import iuh.fit.se.job_service.dto.JobRequest;
import iuh.fit.se.job_service.model.JobStatus;

import java.util.List;
import java.util.Optional;

public interface JobService {
    // CRUD
    List<JobDto> getAllJobs();
    Optional<JobDto> getJobById(Long id);
    JobDto createJob(JobRequest request);
    JobDto updateJob(Long id, JobRequest request);
    void deleteJob(Long id);

    // Admin functions
    JobDto approveJob(Long id);
    JobDto rejectJob(Long id);
    JobDto removeJob(Long id);
    List<JobDto> getJobsByStatus(JobStatus status);
}
