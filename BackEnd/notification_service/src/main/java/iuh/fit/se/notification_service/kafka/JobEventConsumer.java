package iuh.fit.se.notification_service.kafka;

import iuh.fit.se.notification_service.dto.JobApprovedEvent;
import iuh.fit.se.notification_service.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class JobEventConsumer {

    @Autowired
    private NotificationService notificationService;

    // Khi có Kafka thật, consumer này sẽ tự lắng nghe topic
    @KafkaListener(topics = "job-events", groupId = "notification-group", autoStartup = "false")
    public void consumeJobEvent(JobApprovedEvent event) {
        System.out.println("📥 Received JobEvent from Kafka: " + event.getJobTitle());
        notificationService.sendNotification(
                event.getEmployerId(),
                event.getJobTitle(),
                event.getMessage()
        );
    }

    // Khi Kafka chưa bật: gọi thủ công hàm này trong Controller để test
    public void simulateJobEvent(JobApprovedEvent event) {
        System.out.println("🧩 Simulating consume JobEvent...");
        notificationService.sendNotification(
                event.getEmployerId(),
                event.getJobTitle(),
                event.getMessage()
        );
    }
}
