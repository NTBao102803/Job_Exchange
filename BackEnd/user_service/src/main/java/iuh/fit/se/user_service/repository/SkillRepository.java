package iuh.fit.se.user_service.repository;

import iuh.fit.se.user_service.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
}
