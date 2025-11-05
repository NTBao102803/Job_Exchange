package iuh.fit.se.notification_service.controller;

import iuh.fit.se.notification_service.dto.ApplicationStatusChangedEvent;
import iuh.fit.se.notification_service.dto.ApplicationSubmittedEvent;
import iuh.fit.se.notification_service.dto.JobApprovedEvent;
import iuh.fit.se.notification_service.dto.JobRejectedEvent;
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

    @MessageMapping("/send-notification")
    public void sendNotification(Message<String> message, SimpMessageHeaderAccessor headerAccessor) {
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String role = (String) headerAccessor.getSessionAttributes().get("role");

        System.out.println("📩 Message from user: " + username + " (" + role + ")");
    }

    // 🔹 Đánh dấu tất cả đã đọc
    @PutMapping("/read-all")
    public ResponseEntity<List<Notification>> markAllAsRead(@RequestParam Long receiverId) {
        List<Notification> updated = notificationService.markAllAsRead(receiverId);
        return ResponseEntity.ok(updated);
    }

    // 🔹 Lấy số thông báo chưa đọc
    @GetMapping("/unread-count/{receiverId}")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long receiverId) {
        Long count = notificationService.getUnreadCount(receiverId);
        return ResponseEntity.ok(count);
    }

    // 🔹 Xóa thông báo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/application-submitted")
    public ResponseEntity<String> handleApplicationSubmitted(@RequestBody ApplicationSubmittedEvent event) {
        notificationService.handleApplicationSubmitted(event);
        return ResponseEntity.ok("Sent to employer: " + event.getEmployerId());
    }

    @PostMapping("/job-approved")
    public ResponseEntity<String> handleJobApproved(@RequestBody JobApprovedEvent event) {
        notificationService.handleJobApproved(event);
        return ResponseEntity.ok("Sent to employer: " + event.getEmployerId());
    }

    @PostMapping("/job-rejected")
    public ResponseEntity<String> handleJobRejected(@RequestBody JobRejectedEvent event) {
        notificationService.handleJobRejected(event);
        return ResponseEntity.ok("Sent to employer: " + event.getEmployerId());
    }

    @PostMapping("/application-status-changed")
    public ResponseEntity<String> handleApplicationStatusChanged(@RequestBody ApplicationStatusChangedEvent event) {
        notificationService.handleApplicationStatusChanged(event);
        return ResponseEntity.ok("Sent to candidate: " + event.getCandidateId());
    }

}
