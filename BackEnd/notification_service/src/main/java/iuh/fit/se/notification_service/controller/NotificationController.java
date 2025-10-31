package iuh.fit.se.notification_service.controller;

import iuh.fit.se.notification_service.dto.JobApprovedEvent;
import iuh.fit.se.notification_service.kafka.JobEventConsumer;
import iuh.fit.se.notification_service.model.Notification;
import iuh.fit.se.notification_service.repository.NotificationRepository;
import iuh.fit.se.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JobEventConsumer jobEventConsumer;

    // ✅ Test gửi notification thủ công (Postman)
    @PostMapping("/send")
    public Notification sendNotification(@RequestParam Long receiverId,
                                         @RequestParam String title,
                                         @RequestParam String message) {
        return notificationService.sendNotification(receiverId, title, message);
    }

    // ✅ Lấy danh sách thông báo theo user (employer)
    @GetMapping("/{receiverId}")
    public List<Notification> getNotifications(@PathVariable Long receiverId) {
        return notificationService.getNotificationsByReceiver(receiverId);
    }

    // ✅ Đánh dấu đã đọc
    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    // ✅ Khi admin duyệt job — JobService sẽ gọi API này
    @PostMapping("/job-approved")
    public ResponseEntity<String> handleJobApproved(@RequestBody JobApprovedEvent event) {
        System.out.println("📩 Received job-approved event: " + event);

        // Gửi thông báo cho Employer
        notificationService.sendNotification(
                event.getEmployerId(),
                "Tin tuyển dụng được duyệt ✅",
                "Tin tuyển dụng " + event.getJobTitle() + " của bạn đã được phê duyệt."
        );

        // (Giữ stub Kafka consumer cho tương lai)
        return ResponseEntity.ok("Notification sent to employerId: " + event.getEmployerId());
    }

    // ✅ Test giả lập event từ Kafka (chưa bật Kafka)
    @PostMapping("/simulate-job-event")
    public String simulateJobEvent(@RequestBody JobApprovedEvent event) {
        jobEventConsumer.simulateJobEvent(event);
        return "Simulated JobEvent for employer " + event.getEmployerId();
    }

    @MessageMapping("/send-notification")
    public void sendNotification(Message<String> message, SimpMessageHeaderAccessor headerAccessor) {
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String role = (String) headerAccessor.getSessionAttributes().get("role");

        System.out.println("📩 Message from user: " + username + " (" + role + ")");
    }
}
