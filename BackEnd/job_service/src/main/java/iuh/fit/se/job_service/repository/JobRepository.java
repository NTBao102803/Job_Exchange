package iuh.fit.se.job_service.repository;

import iuh.fit.se.job_service.model.Job;
import iuh.fit.se.job_service.model.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {
    Optional<Job> findByIdAndEmployerId(Long id, Long employerId);
    List<Job> findByStatus(JobStatus status);
}
