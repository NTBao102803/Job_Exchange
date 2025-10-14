package iuh.fit.se.payment_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_plan")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;            // "Gói Cơ Bản", ...

    @Column(nullable = false)
    private Double price;           // đơn vị VND

    @Column(nullable = false)
    private Integer durationDays;   // thời hạn active tính theo ngày

    @Column(length = 1000)
    private String description;

    private LocalDateTime createdAt = LocalDateTime.now();
}
