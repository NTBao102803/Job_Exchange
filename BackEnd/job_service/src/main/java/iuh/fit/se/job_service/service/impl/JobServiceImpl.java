package iuh.fit.se.job_service.service.impl;

import iuh.fit.se.job_service.client.EmployerClient;
import iuh.fit.se.job_service.config.JwtUtil;
import iuh.fit.se.job_service.dto.*;
import iuh.fit.se.job_service.model.Job;
import iuh.fit.se.job_service.model.JobStatus;
import iuh.fit.se.job_service.repository.JobRepository;
import iuh.fit.se.job_service.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.support.LoggingProducerListener;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class JobServiceImpl implements JobService {

    private static final Logger logger = LoggerFactory.getLogger(JobServiceImpl.class);

    private final JobRepository jobRepository;
    private final EmployerClient employerClient;
//    private final LoggingProducerListener loggingProducerListener;

    @Autowired
    public JobServiceImpl(JobRepository jobRepository, JwtUtil jwtUtil, EmployerClient employerClient) {
        this.jobRepository = jobRepository;
        this.employerClient = employerClient;
    }

    @Override
    public List<JobDto> getAllJobs() {
        logger.info("Fetching all jobs.");
        List<Job> jobs = jobRepository.findAll();
        logger.info("Found {} jobs in total.", jobs.size());
        return jobs.stream().map(JobMapper::toDto).toList();
    }

    @Override
    public Optional<JobDto> getJobById(Long id) {
        logger.info("Fetching job with ID: {}", id);
        return jobRepository.findById(id).map(job -> {
            logger.info("Found job with ID: {}", id);
            return JobMapper.toDto(job);
        });
    }

    @Override
    public JobDto createJob(JobRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Attempting to create a new job for employer with email: {}", email);

        EmployerDto employer = employerClient.getEmployerByEmail(email);
        logger.info("Fetched employer status: {}", employer.getStatus());

        if (employer == null) {
            logger.warn("Employer with email {} not found.", email);
            throw new RuntimeException("Không tìm thấy thông tin Employer.");
        }

        if (employer.getStatus() == EmployerStatus.PENDING) {
            logger.warn("Employer with email {} is in PENDING status. Cannot create job.", email);
            throw new RuntimeException("Employer chưa được admin duyệt, không thể tạo tin tuyển dụng.");
        }
        else if (employer.getStatus() == EmployerStatus.WAITING_APPROVAL) {
            logger.warn("Employer with email {} is in WAITING_APPROVAL status. Cannot create job.", email);
            throw new RuntimeException("Employer chưa cập nhật đầy đủ hồ sơ.");
        }
        else {
            logger.info("Employer {} is in APPROVED status. Proceeding with job creation.", email);
            Job job = JobMapper.toEntity(request, employer.getId());
            Job savedJob = jobRepository.save(job);
            logger.info("Successfully created and saved job with ID: {}", savedJob.getId());
            return JobMapper.toDto(savedJob);
        }
    }

    @Override
    public JobDto updateJob(Long id, JobRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Attempting to update job with ID: {} for employer with email: {}", id, email);

        EmployerDto employer = employerClient.getEmployerByEmail(email);
        logger.info("Fetched employer ID: {}", employer.getId());

        Job job = jobRepository.findByIdAndEmployerId(id, employer.getId())
                .orElseThrow(() -> {
                    logger.error("Job with ID {} not found or does not belong to employer with email {}", id, email);
                    return new RuntimeException("Job not found or not owned by employer");
                });

        logger.info("Found job with ID {} to update. Updating entity.", id);
        JobMapper.updateEntity(job, request);
        Job updatedJob = jobRepository.save(job);
        logger.info("Successfully updated job with ID: {}", updatedJob.getId());
        return JobMapper.toDto(updatedJob);
    }

    @Override
    public void deleteJob(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Attempting to delete job with ID: {} for employer with email: {}", id, email);

        EmployerDto employer = employerClient.getEmployerByEmail(email);

        Job job = jobRepository.findByIdAndEmployerId(id, employer.getId())
                .orElseThrow(() -> {
                    logger.error("Job with ID {} not found or does not belong to employer with email {}. Cannot delete.", id, email);
                    return new RuntimeException("Job not found or not owned by employer");
                });

        logger.info("Found job with ID {} to delete. Deleting...", job.getId());
        jobRepository.delete(job);
        logger.info("Successfully deleted job with ID: {}", job.getId());
    }

    @Override
    public List<JobDto> getJobsByStatus(JobStatus status) {
        logger.info("Fetching jobs with status: {}", status);
        List<Job> jobs = jobRepository.findByStatus(status);
        logger.info("Found {} jobs with status {}.", jobs.size(), status);
        return jobs.stream().map(JobMapper::toDto).toList();
    }

    @Override
    public JobDto approveJob(Long id) {
        logger.info("Attempting to approve job with ID: {}", id);
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Job with ID {} not found. Cannot approve.", id);
                    return new RuntimeException("Job not found");
                });

        job.setStatus(JobStatus.APPROVED);
        Job approvedJob = jobRepository.save(job);
        logger.info("Job with ID {} has been approved.", approvedJob.getId());
        return JobMapper.toDto(approvedJob);
    }

    @Override
    public JobDto rejectJob(Long id, String reason) {
        logger.info("Attempting to reject job with ID: {}", id);
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Job with ID {} not found. Cannot reject.", id);
                    return new RuntimeException("Job not found");
                });

        job.setStatus(JobStatus.REJECTED);
        job.setRejectReason(reason);
        Job rejectedJob = jobRepository.save(job);
        logger.info("Job with ID {} has been rejected with reason: {}", rejectedJob.getId(), reason);
        return JobMapper.toDto(rejectedJob);
    }

    @Override
    public JobDto removeJob(Long id) {
        logger.info("Attempting to remove job with ID: {}", id);
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Job with ID {} not found. Cannot remove.", id);
                    return new RuntimeException("Job not found");
                });

        job.setStatus(JobStatus.REMOVED);
        Job removedJob = jobRepository.save(job);
        logger.info("Job with ID {} has been removed.", removedJob.getId());
        return JobMapper.toDto(removedJob);
    }
}
