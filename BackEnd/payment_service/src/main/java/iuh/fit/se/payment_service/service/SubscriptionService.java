package iuh.fit.se.payment_service.service;

import iuh.fit.se.payment_service.dto.CurrentSubscriptionDTO;
import iuh.fit.se.payment_service.dto.SubscriptionDTO;
import iuh.fit.se.payment_service.entity.Subscription;
import iuh.fit.se.payment_service.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    public Optional<CurrentSubscriptionDTO> getCurrentPlan(Long recruiterId) {
        return subscriptionRepository
                .findTopByRecruiterIdAndStatusOrderByEndAtDesc(recruiterId, "ACTIVE")
                .map(sub -> CurrentSubscriptionDTO.builder()
                        .planName(sub.getPlan().getName())
                        .price(sub.getPlan().getPrice())
                        .durationDays(sub.getPlan().getDurationDays())
                        .startAt(sub.getStartAt())
                        .endAt(sub.getEndAt())
                        .status(sub.getStatus())
                        .build()
                );
    }
    // Lấy tất cả subscription
    public List<SubscriptionDTO> getAllSubscriptionDTOs() {
        return subscriptionRepository.findAll().stream()
                .map(sub -> SubscriptionDTO.builder()
                        .id(sub.getId())
                        .recruiterId(sub.getRecruiterId())
                        .planName(sub.getPlan() != null ? sub.getPlan().getName() : null)
                        .planPrice(sub.getPlan() != null ? sub.getPlan().getPrice() : null)
                        .planDurationDays(sub.getPlan() != null ? sub.getPlan().getDurationDays() : null)
                        .startAt(sub.getStartAt())
                        .endAt(sub.getEndAt())
                        .status(sub.getStatus())
                        .build()
                )
                .toList();
    }

}
