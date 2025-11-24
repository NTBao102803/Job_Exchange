package iuh.fit.se.payment_service.controller;

import iuh.fit.se.payment_service.dto.PaymentRequestDTO;
import iuh.fit.se.payment_service.dto.PaymentResponseDTO;
import iuh.fit.se.payment_service.dto.SepayTransactionDTO;
import iuh.fit.se.payment_service.service.PaymentService;
import iuh.fit.se.payment_service.service.SepayTransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    private final SepayTransactionService sepayTransactionService;

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
        paymentService.handleProviderCallback(orderId, "0");
        return "✅ Payment simulated successfully for orderId=" + orderId;
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

    @GetMapping("/transactions")
    public ResponseEntity<List<SepayTransactionDTO>> getTransactions() {
        log.info("Frontend gọi /transactions");
        try {
            List<SepayTransactionDTO> transactions = sepayTransactionService.getTransactions();
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}