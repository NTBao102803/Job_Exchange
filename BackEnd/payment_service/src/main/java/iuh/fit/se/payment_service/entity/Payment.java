package iuh.fit.se.payment_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orderId;

    private Long recruiterId;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private PaymentPlan plan;

    private Double amount;

    private String method; // MOMO, VNPAY, QR, BANK_TRANSFER

    private String status; // PENDING, SUCCESS, FAILED

    private String payUrl; // link trả về từ provider (nếu có)
    private String qrCodeUrl; // link hình QR nếu provider trả về

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}
