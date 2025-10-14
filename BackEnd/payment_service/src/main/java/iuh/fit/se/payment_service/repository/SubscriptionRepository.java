package iuh.fit.se.payment_service.repository;

import iuh.fit.se.payment_service.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findTopByRecruiterIdAndStatusOrderByEndAtDesc(Long recruiterId, String status);
    List<Subscription> findByStatus(String status);
}

