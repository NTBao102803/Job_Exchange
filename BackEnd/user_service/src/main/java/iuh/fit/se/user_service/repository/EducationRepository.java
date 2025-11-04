package iuh.fit.se.user_service.repository;

import iuh.fit.se.user_service.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationRepository extends JpaRepository<Education, Long> {
}
