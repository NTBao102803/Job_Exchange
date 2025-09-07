package iuh.fit.se.user_service.repository;

import iuh.fit.se.user_service.model.Skill;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByProfileId(Long profileId);
    Optional<Skill> findBySkillName(String skillName);

    @Transactional
    int deleteBySkillNameAndProfileId(String skillName, Long profileId);
}
