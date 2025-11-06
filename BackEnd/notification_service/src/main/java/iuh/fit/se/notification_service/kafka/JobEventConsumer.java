package iuh.fit.se.notification_service.kafka;

import iuh.fit.se.notification_service.dto.JobApprovedEvent;
import iuh.fit.se.notification_service.dto.JobRejectedEvent;
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
    public void consume(Object event) {
        if (event instanceof JobApprovedEvent e) {
            notificationService.sendNotification(e.getEmployerId(), "Tin được duyệt", "Tin \"" + e.getJobTitle() + "\" đã được duyệt.");
        } else if (event instanceof JobRejectedEvent e) {
            String reason = e.getRejectReason() != null ? e.getRejectReason() : "Không phù hợp";
            notificationService.sendNotification(e.getEmployerId(), "Tin bị từ chối", "Tin \"" + e.getJobTitle() + "\" bị từ chối. Lý do: " + reason);
        }
    }

    // Khi Kafka chưa bật: gọi thủ công hàm này trong Controller để test
//    public void simulateJobEvent(JobApprovedEvent event) {
//        System.out.println("🧩 Simulating consume JobEvent...");
//        notificationService.sendNotification(
//                event.getEmployerId(),
//                event.getJobTitle(),
//                event.getMessage()
//        );
//    }
}
