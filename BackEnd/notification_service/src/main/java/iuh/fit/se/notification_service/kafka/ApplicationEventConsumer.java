package iuh.fit.se.notification_service.kafka;

import iuh.fit.se.notification_service.dto.ApplicationSubmittedEvent;
import iuh.fit.se.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "application-events", groupId = "notification-group", autoStartup = "false")
    public void consume(ApplicationSubmittedEvent event) {
        notificationService.sendNotification(
                event.getEmployerId(),
                "Ứng viên mới ứng tuyển",
                event.getCandidateName() + " đã ứng tuyển vào tin \"" + event.getJobTitle() + "\""
        );
    }
}