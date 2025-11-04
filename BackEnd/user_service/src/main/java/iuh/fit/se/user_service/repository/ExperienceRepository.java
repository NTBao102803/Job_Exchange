package iuh.fit.se.user_service.repository;

import iuh.fit.se.user_service.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
}
