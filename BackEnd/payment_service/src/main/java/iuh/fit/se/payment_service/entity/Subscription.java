package iuh.fit.se.payment_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscription")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Subscription {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long recruiterId;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private PaymentPlan plan;

    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String status; // ACTIVE, EXPIRED, CANCELLED

    private LocalDateTime createdAt = LocalDateTime.now();
}
