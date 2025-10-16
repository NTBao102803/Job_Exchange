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
                    .description("Đăng tối đa 3 tin tuyển / tháng. Gợi ý ứng viên thông minh - xem thông tin cơ bản. Hỗ trợ qua email. Hiển thị tin trong 30 ngày")
                    .build());

            planRepo.save(PaymentPlan.builder()
                    .name("Gói Nâng Cao")
                    .price(1499000.0)
                    .durationDays(30)
                    .description("Đăng 10 tin tuyển dụng / tháng. Gợi ý ứng viên thông minh - xem thông tin đầy đủ. Hỗ trợ 24/7. Thời gian hiển thị tin: 30 ngày")
                    .build());

            planRepo.save(PaymentPlan.builder()
                    .name("Gói Chuyên Nghiệp")
                    .price(2499000.0)
                    .durationDays(60)
                    .description("Không giới hạn số tin tuyển dụng. Gợi ý ứng viên thông minh - xem thông tin đầy đủ. Chăm sóc khách hàng riêng. Thời gian hiển thị tin: 60 ngày")
                    .build());
        }
    }
}
