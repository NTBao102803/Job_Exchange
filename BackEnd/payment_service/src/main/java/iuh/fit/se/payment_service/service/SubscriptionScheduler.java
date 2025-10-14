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
    @Scheduled(fixedRate = 21600000) // 6 tiếng (6 * 60 * 60 * 1000 ms)
    public void autoExpireSubscriptions() {
        LocalDateTime now = LocalDateTime.now();
        List<Subscription> actives = subscriptionRepository.findByStatus("ACTIVE");

        actives.stream()
                .filter(sub -> sub.getEndAt().isBefore(now))
                .forEach(sub -> {
                    sub.setStatus("EXPIRED");
                    subscriptionRepository.save(sub);
                    log.info("Gói {} của recruiter {} đã hết hạn", sub.getPlan().getName(), sub.getRecruiterId());
                });
    }
}
