package iuh.fit.se.job_service.dto;

import iuh.fit.se.job_service.model.Job;

public class JobMapper {
    // =====================
    // Entity -> DTO
    // =====================
    public static JobDto toDto(Job job) {
        if (job == null) {
            return null;
        }
        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .company(job.getCompany())
                .location(job.getLocation())
                .salary(job.getSalary())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }

    // =====================
    // Request -> Entity
    // =====================
    public static Job toEntity(JobRequest request) {
        if (request == null) {
            return null;
        }
        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        return job;
    }

    // =====================
    // DTO -> Entity (nếu cần update)
    // =====================
    public static void updateEntity(Job job, JobRequest request) {
        if (request == null || job == null) {
            return;
        }
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
    }

}
