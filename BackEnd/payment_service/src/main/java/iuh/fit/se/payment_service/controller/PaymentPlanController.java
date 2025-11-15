package iuh.fit.se.payment_service.controller;

import iuh.fit.se.payment_service.dto.CurrentSubscriptionDTO;
import iuh.fit.se.payment_service.dto.SubscriptionDTO;
import iuh.fit.se.payment_service.entity.PaymentPlan;
import iuh.fit.se.payment_service.entity.Subscription;
import iuh.fit.se.payment_service.repository.PaymentPlanRepository;
import iuh.fit.se.payment_service.repository.SubscriptionRepository;
import iuh.fit.se.payment_service.service.SubscriptionService;
import iuh.fit.se.payment_service.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment-plans")
@RequiredArgsConstructor
public class PaymentPlanController {

    private final PaymentPlanRepository planRepo;
    private final SubscriptionService subscriptionService;
    private final JwtUtil jwtUtil;
    private final SubscriptionRepository subRepo;

    @GetMapping
    public List<PaymentPlan> all() {
        return planRepo.findAll();
    }


    @GetMapping("/current/{recruiterId}")
    public ResponseEntity<?> getCurrentPlanByRecruiterId(@PathVariable Long recruiterId) {
        try {
            Optional<CurrentSubscriptionDTO> current = subscriptionService.getCurrentPlan(recruiterId);
            return current.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.ok().body(null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Lỗi khi lấy gói hiện tại: " + e.getMessage());
        }
    }
    @GetMapping("/subscriptions")
    public ResponseEntity<List<SubscriptionDTO>> getAllSubscriptionsDTO() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptionDTOs());
    }


}
