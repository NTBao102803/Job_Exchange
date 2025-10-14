package iuh.fit.se.payment_service.controller;

import iuh.fit.se.payment_service.dto.CurrentSubscriptionDTO;
import iuh.fit.se.payment_service.entity.PaymentPlan;
import iuh.fit.se.payment_service.repository.PaymentPlanRepository;
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

    @GetMapping
    public List<PaymentPlan> all() {
        return planRepo.findAll();
    }

    @GetMapping("/{id}")
    public PaymentPlan getOne(@PathVariable Long id) {
        return planRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
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

}
