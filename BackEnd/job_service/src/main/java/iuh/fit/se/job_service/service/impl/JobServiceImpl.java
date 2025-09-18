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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final EmployerClient employerClient;
    private final LoggingProducerListener loggingProducerListener;

    @Autowired
    public JobServiceImpl(JobRepository jobRepository, JwtUtil jwtUtil, EmployerClient employerClient, LoggingProducerListener loggingProducerListener) {
        this.jobRepository = jobRepository;
        this.employerClient = employerClient;
        this.loggingProducerListener = loggingProducerListener;
    }

    @Override
    public List<JobDto> getAllJobs() {
        return jobRepository.findAll().stream().map(JobMapper::toDto).toList();
    }

    @Override
    public Optional<JobDto> getJobById(Long id) {
        return jobRepository.findById(id).map(JobMapper::toDto);
    }

    @Override
    public JobDto createJob(JobRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        EmployerDto employer = employerClient.getEmployerByEmail(email);
//        log.info("Employer status from employer-service = {}", employer.getStatus());
        if (employer == null || employer.getStatus() == EmployerStatus.PENDING) {
            throw new RuntimeException("Employer chưa được admin duyệt, không thể tạo tin tuyển dụng");
        }
        else if (employer.getStatus() == EmployerStatus.WAITING_APPROVAL) {
            throw new RuntimeException("Employer chưa cập nhật đầy đủ hồ sơ");
        }
        else {
            Job job = JobMapper.toEntity(request, employer.getId());
            return JobMapper.toDto(jobRepository.save(job));
        }
    }

    @Override
    public JobDto updateJob(Long id, JobRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        EmployerDto employer = employerClient.getEmployerByEmail(email);
        Job job = jobRepository.findByIdAndEmployerId(id, employer.getId())
                .orElseThrow(() -> new RuntimeException("Job not found or not owned by employer"));

        JobMapper.updateEntity(job, request);
        return JobMapper.toDto(jobRepository.save(job));
    }

    @Override
    public void deleteJob(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        EmployerDto employer = employerClient.getEmployerByEmail(email);
        Job job = jobRepository.findByIdAndEmployerId(id, employer.getId())
                .orElseThrow(() -> new RuntimeException("Job not found or not owned by employer"));
        jobRepository.delete(job);
    }

    @Override
    public List<JobDto> getJobsByStatus(JobStatus status) {
        return jobRepository.findByStatus(status).stream().map(JobMapper::toDto).toList();
    }

    @Override
    public JobDto approveJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(JobStatus.APPROVED);
        return JobMapper.toDto(jobRepository.save(job));
    }

    @Override
    public JobDto rejectJob(Long id, String reason) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(JobStatus.REJECTED);
        job.setRejectReason(reason);
        return JobMapper.toDto(jobRepository.save(job));
    }

    @Override
    public JobDto removeJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(JobStatus.REMOVED);
        return JobMapper.toDto(jobRepository.save(job));
    }
}
