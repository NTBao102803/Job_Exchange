package iuh.fit.se.job_service.service.impl;

import iuh.fit.se.job_service.dto.JobDto;
import iuh.fit.se.job_service.dto.JobMapper;
import iuh.fit.se.job_service.dto.JobRequest;
import iuh.fit.se.job_service.model.Job;
import iuh.fit.se.job_service.model.JobStatus;
import iuh.fit.se.job_service.repository.JobRepository;
import iuh.fit.se.job_service.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    public JobServiceImpl(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }


    @Override
    public List<JobDto> getAllJobs() {
        return jobRepository.findAll()
                .stream()
                .map(JobMapper::toDto)
                .toList();
    }

    @Override
    public Optional<JobDto> getJobById(Long id) {
        return jobRepository.findById(id).map(JobMapper::toDto);
    }

    @Override
    public JobDto createJob(JobRequest request) {
        Job job = JobMapper.toEntity(request);
        job.setStatus(JobStatus.PENDING);
        return JobMapper.toDto(jobRepository.save(job));
    }

    @Override
    public JobDto updateJob(Long id, JobRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());

        return JobMapper.toDto(jobRepository.save(job));
    }

    @Override
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    // ========================
    // Admin functions
    // ========================
    @Override
    public List<JobDto> getJobsByStatus(JobStatus status) {
        return jobRepository.findByStatus(status).stream().map(JobMapper::toDto).toList();
    }

    public JobDto approveJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(JobStatus.APPROVED);
        return JobMapper.toDto(jobRepository.save(job));
    }

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
