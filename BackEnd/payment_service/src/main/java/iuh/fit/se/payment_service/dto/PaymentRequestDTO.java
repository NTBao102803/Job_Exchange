package iuh.fit.se.payment_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    private Long recruiterId;
    private Long planId;
    private String method; // "MOMO" | "VNPAY" | "QR" | "BANK"
}
