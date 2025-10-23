package iuh.fit.se.payment_service.controller;

import iuh.fit.se.payment_service.dto.PaymentRequestDTO;
import iuh.fit.se.payment_service.dto.PaymentResponseDTO;
import iuh.fit.se.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    /**
     * B1. Tạo payment mới cho gói dịch vụ
     */
    @PostMapping("/create")
    public PaymentResponseDTO createPayment(@RequestBody PaymentRequestDTO req) throws Exception {
        return paymentService.createPayment(req);
    }

    /**
     * B2. Giả lập quét QR:
     * frontend gọi endpoint này khi user nhấn "Thanh toán ngay" hoặc quét mã giả.
     * Hệ thống sẽ tự động đổi trạng thái payment -> SUCCESS và kích hoạt subscription.
     */
    @PostMapping("/scan")
    public String simulateScan(@RequestParam String orderId) {
        // gọi xử lý như callback MOMO thật
        paymentService.handleProviderCallback(orderId, "0");
        return "✅ Payment simulated successfully for orderId=" + orderId;
    }

    /**
     * Callback thật (nếu sau này tích hợp Momo/VNPay)
     */
    @PostMapping("/momo-callback")
    public String momoCallback(@RequestBody java.util.Map<String, Object> payload) {
        String orderId = String.valueOf(payload.get("orderId"));
        String resultCode = String.valueOf(payload.get("resultCode"));
        paymentService.handleProviderCallback(orderId, resultCode);
        return "OK";
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<?> getPaymentsByRecruiter(@PathVariable Long recruiterId) {
        return ResponseEntity.ok(paymentService.getPaymentsByRecruiter(recruiterId));
    }
    /**
     * ✅ API cho admin: Lấy toàn bộ payment trong hệ thống
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}
