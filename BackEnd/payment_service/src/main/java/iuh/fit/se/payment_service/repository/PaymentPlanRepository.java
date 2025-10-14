package iuh.fit.se.payment_service.repository;

import iuh.fit.se.payment_service.entity.PaymentPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentPlanRepository extends JpaRepository<PaymentPlan, Long> {
    Optional<PaymentPlan> findByName(String name);
}
