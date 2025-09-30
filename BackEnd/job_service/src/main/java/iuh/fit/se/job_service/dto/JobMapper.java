package iuh.fit.se.job_service.dto;

import iuh.fit.se.job_service.model.Job;
import iuh.fit.se.job_service.model.JobStatus;

import java.time.LocalDateTime;

public class JobMapper {
    public static JobDto toDto(Job job) {
        if (job == null) return null;
        return JobDto.builder()
                .id(job.getId())
                .employerId(job.getEmployerId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .salary(job.getSalary())
                .jobType(job.getJobType())
                .startDate(job.getStartDate())
                .endDate(job.getEndDate())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .status(job.getStatus())
                .rejectReason(job.getRejectReason())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }

    public static Job toEntity(JobRequest request, Long employerId) {
        if (request == null) return null;
        return Job.builder()
                .employerId(employerId)
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .salary(request.getSalary())
                .jobType(request.getJobType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .requirements(request.getRequirements())
                .benefits(request.getBenefits())
                .status(JobStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static void updateEntity(Job job, JobRequest request) {
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setJobType(request.getJobType());
        job.setStartDate(request.getStartDate());
        job.setEndDate(request.getEndDate());
        job.setRequirements(request.getRequirements());
        job.setBenefits(request.getBenefits());
        job.setUpdatedAt(LocalDateTime.now());
    }
}

