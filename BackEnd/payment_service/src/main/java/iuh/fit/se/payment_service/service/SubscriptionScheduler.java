package iuh.fit.se.payment_service.service;

import iuh.fit.se.payment_service.entity.Subscription;
import iuh.fit.se.payment_service.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class SubscriptionScheduler {

    private final SubscriptionRepository subscriptionRepository;

    /**
     * Chạy mỗi 6 tiếng kiểm tra gói nào đã hết hạn -> chuyển sang EXPIRED
     */
    @Scheduled(fixedRate = 10000)
    public void autoExpireSubscriptions() {
        log.info("🕒 [Scheduler] Bắt đầu kiểm tra gói đăng ký...");

        LocalDateTime now = LocalDateTime.now();
        List<Subscription> actives = subscriptionRepository.findByStatus("ACTIVE");
        log.info("🔍 Có {} gói ACTIVE trong DB", actives.size());

        actives.forEach(sub -> log.info("→ Gói {} (recruiterId: {}) hết hạn lúc {}",
                sub.getPlan().getName(), sub.getRecruiterId(), sub.getEndAt()));

        actives.stream()
                .filter(sub -> sub.getEndAt().isBefore(now))
                .forEach(sub -> {
                    sub.setStatus("EXPIRED");
                    subscriptionRepository.save(sub);
                    log.info("✅ Gói {} của recruiter {} đã chuyển sang EXPIRED",
                            sub.getPlan().getName(), sub.getRecruiterId());
                });

        log.info("🏁 [Scheduler] Kết thúc kiểm tra.");
    }

}
