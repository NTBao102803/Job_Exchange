package iuh.fit.se.user_service.repository;

import iuh.fit.se.user_service.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
}
