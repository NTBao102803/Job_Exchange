package iuh.fit.se.notification_service.kafka;

import iuh.fit.se.notification_service.dto.ApplicationStatusChangedEvent;
import iuh.fit.se.notification_service.dto.ApplicationSubmittedEvent;
import iuh.fit.se.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "kafka.enabled", havingValue = "true")
@Slf4j
public class ApplicationEventConsumer {

    private final NotificationService notificationService;

    // === 1. ỨNG VIÊN APPLY ===
    @KafkaListener(
            topics = "application-events",
            groupId = "notification-group",
            containerFactory = "kafkaListenerContainerFactory",
            autoStartup = "true"
    )
    public void handleApplicationSubmitted(ApplicationSubmittedEvent event) {
        log.info("Kafka: Ứng viên apply → employerId={}", event.getEmployerId());

        notificationService.handleApplicationSubmitted(event);
    }

    // === 2. DUYỆT / TỪ CHỐI HỒ SƠ ỨNG VIÊN ===
    @KafkaListener(
            topics = "application-events",
            groupId = "notification-group",
            containerFactory = "kafkaListenerContainerFactory",
            autoStartup = "true"
    )
    public void handleApplicationStatusChanged(ApplicationStatusChangedEvent event) {
        log.info("Kafka: Hồ sơ {} → candidateId={}", event.getStatus(), event.getCandidateId());

        notificationService.handleApplicationStatusChanged(event);
    }
}