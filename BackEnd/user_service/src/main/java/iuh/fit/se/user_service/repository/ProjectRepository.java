package iuh.fit.se.user_service.repository;

import iuh.fit.se.user_service.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
