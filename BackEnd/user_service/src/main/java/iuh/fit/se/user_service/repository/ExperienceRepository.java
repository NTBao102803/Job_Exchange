package iuh.fit.se.user_service.repository;

import iuh.fit.se.user_service.model.Experience;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ExperienceRepository extends CrudRepository<Experience, Long> {
    List<Experience> findByProfileId(Long profileId);
    void deleteByProfileId(Long profileId);
}
