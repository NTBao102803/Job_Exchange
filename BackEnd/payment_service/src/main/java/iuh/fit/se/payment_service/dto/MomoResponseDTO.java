package iuh.fit.se.payment_service.dto;

import lombok.Data;

@Data
public class MomoResponseDTO {
    private String partnerCode;
    private String orderId;
    private String requestId;
    private String payUrl;
    private String deeplink;
    private String qrCodeUrl;
    private String message;
    private String resultCode;
}
