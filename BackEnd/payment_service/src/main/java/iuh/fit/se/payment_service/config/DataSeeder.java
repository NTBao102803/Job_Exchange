package iuh.fit.se.payment_service.config;

import iuh.fit.se.payment_service.entity.PaymentPlan;
import iuh.fit.se.payment_service.repository.PaymentPlanRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder {
    private final PaymentPlanRepository planRepo;

    @PostConstruct
    public void seed() {
        if (planRepo.count() == 0) {
            planRepo.save(PaymentPlan.builder()
                    .name("Gói Cơ Bản")
                    .price(499000.0)
                    .durationDays(30)
                    .description("Đăng tối đa 3 tin / tháng. Hiển thị 7 ngày. Hỗ trợ email.")
                    .build());

            planRepo.save(PaymentPlan.builder()
                    .name("Gói Nâng Cao")
                    .price(1499000.0)
                    .durationDays(30)
                    .description("Đăng 10 tin / tháng. Hiển thị 30 ngày. Hỗ trợ 24/7.")
                    .build());

            planRepo.save(PaymentPlan.builder()
                    .name("Gói Chuyên Nghiệp")
                    .price(2499000.0)
                    .durationDays(60)
                    .description("Không giới hạn tin. Hiển thị 60 ngày. Chăm sóc riêng.")
                    .build());
        }
    }
}
