package iuh.fit.se.payment_service.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDTO {
    private Long id;
    private String orderId;
    private String planName;
    private Double amount;
    private String method;
    private String status;
    private LocalDateTime createdAt;
    private String payUrl;
    private String qrCodeUrl;
    private Long planId;
    private Long recruiterId;
}
