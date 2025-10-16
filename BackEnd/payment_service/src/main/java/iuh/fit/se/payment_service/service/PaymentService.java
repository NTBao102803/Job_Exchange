package iuh.fit.se.payment_service.service;

import iuh.fit.se.payment_service.dto.PaymentRequestDTO;
import iuh.fit.se.payment_service.dto.PaymentResponseDTO;
import iuh.fit.se.payment_service.entity.Payment;
import iuh.fit.se.payment_service.entity.PaymentPlan;
import iuh.fit.se.payment_service.entity.Subscription;
import iuh.fit.se.payment_service.repository.PaymentPlanRepository;
import iuh.fit.se.payment_service.repository.PaymentRepository;
import iuh.fit.se.payment_service.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentPlanRepository planRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final MomoPaymentClient momoClient;

    public List<PaymentResponseDTO> getPaymentsByRecruiter(Long recruiterId) {
        return paymentRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiterId)
                .stream()
                .map(p -> PaymentResponseDTO.builder()
                        .id(p.getId())
                        .orderId(p.getOrderId())
                        .planName(p.getPlan().getName())
                        .amount(p.getAmount())
                        .status(p.getStatus())
                        .method(p.getMethod())
                        .createdAt(p.getCreatedAt())
                        .build())
                .toList();
    }

    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(p -> PaymentResponseDTO.builder()
                        .id(p.getId())
                        .orderId(p.getOrderId())
                        .planName(p.getPlan() != null ? p.getPlan().getName() : null)
                        .planId(p.getPlan() != null ? p.getPlan().getId() : null) // ✅ thêm
                        .recruiterId(p.getRecruiterId()) // ✅ thêm
                        .amount(p.getAmount())
                        .status(p.getStatus())
                        .method(p.getMethod())
                        .createdAt(p.getCreatedAt())
                        .payUrl(p.getPayUrl()) // ✅ thêm
                        .qrCodeUrl(p.getQrCodeUrl()) // ✅ thêm
                        .build())
                .toList();
    }



    /**
     * Tạo payment và request tới provider (MOMO) -> trả về payUrl/qrCodeUrl cho frontend.
     */
    @Transactional
    public PaymentResponseDTO createPayment(PaymentRequestDTO req) throws Exception {
        PaymentPlan plan = planRepository.findById(req.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        String orderId = "ORD-" + System.currentTimeMillis();

        Payment payment = Payment.builder()
                .orderId(orderId)
                .recruiterId(req.getRecruiterId())
                .plan(plan)
                .amount(plan.getPrice())
                .method(req.getMethod() != null ? req.getMethod() : "MOMO")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);

        // gọi provider (Momo) - nhận DTO
        var momoResp = momoClient.createPayment(orderId, plan.getPrice(), "Thanh toán gói: " + plan.getName());

        // cập nhật payment với payUrl/qrCode
        payment.setPayUrl(momoResp.getPayUrl());
        payment.setQrCodeUrl(momoResp.getQrCodeUrl());
        paymentRepository.save(payment);

        return PaymentResponseDTO.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .planName(plan.getName())
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .payUrl(payment.getPayUrl())
                .qrCodeUrl(payment.getQrCodeUrl())
                .build();
    }

    /**
     * Xử lý callback (IPN) từ provider.
     * Nếu thành công -> set payment.status=SUCCESS -> active subscription
     */
    @Transactional
    public void handleProviderCallback(String orderId, String resultCode) {
        Optional<Payment> op = paymentRepository.findByOrderId(orderId);
        if (op.isEmpty()) return;
        Payment payment = op.get();
        payment.setUpdatedAt(LocalDateTime.now());

        if ("0".equals(resultCode) || "SUCCESS".equalsIgnoreCase(resultCode)) {
            payment.setStatus("SUCCESS");
            paymentRepository.save(payment);
            activateSubscription(payment);
        } else {
            payment.setStatus("FAILED");
            paymentRepository.save(payment);
        }
    }

    /**
     * Kích hoạt subscription cho recruiter:
     * - Kiểm tra subscription hiện hành ACTIVE -> nếu có, set CANCELLED hoặc set endAt = now
     * - Tạo subscription mới dựa trên plan.durationDays
     */
    private void activateSubscription(Payment payment) {
        Long recruiterId = payment.getRecruiterId();

        // đóng gói cũ (nếu có)
        subscriptionRepository.findTopByRecruiterIdAndStatusOrderByEndAtDesc(recruiterId, "ACTIVE")
                .ifPresent(old -> {
                    old.setStatus("CANCELLED");
                    old.setEndAt(LocalDateTime.now());
                    subscriptionRepository.save(old);
                });

        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusDays(payment.getPlan().getDurationDays());

        Subscription sub = Subscription.builder()
                .recruiterId(recruiterId)
                .plan(payment.getPlan())
                .startAt(start)
                .endAt(end)
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build();

        subscriptionRepository.save(sub);
    }


}
