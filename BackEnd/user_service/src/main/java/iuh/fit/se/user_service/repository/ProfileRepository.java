package iuh.fit.se.user_service.repository;

import iuh.fit.se.user_service.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
}
