package iuh.fit.se.notification_service.service.impl;


import iuh.fit.se.notification_service.dto.ApplicationStatusChangedEvent;
import iuh.fit.se.notification_service.dto.ApplicationSubmittedEvent;
import iuh.fit.se.notification_service.dto.JobApprovedEvent;
import iuh.fit.se.notification_service.dto.JobRejectedEvent;
import iuh.fit.se.notification_service.event.NotificationCreatedEvent;
import iuh.fit.se.notification_service.model.Notification;
import iuh.fit.se.notification_service.repository.NotificationRepository;
import iuh.fit.se.notification_service.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;


@Service
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // WebSocket push

    // === GỬI + LƯU + WEBSOCKET ===
    private Notification saveAndSend(Long receiverId, String title, String message) {
        if (receiverId == null) {
            log.warn("receiverId is null, skip notification: {}", message);
            return null;
        }

        Notification notification = new Notification(receiverId, title, message);
        Notification saved = notificationRepository.save(notification);

        log.info("Lưu thông báo ID={} cho receiverId={}", saved.getId(), receiverId);
        messagingTemplate.convertAndSend("/topic/notifications/" + receiverId, saved);

        return saved;
    }

    @Override
    public Notification sendNotification(Long receiverId, String title, String message) {
        return saveAndSend(receiverId, title, message);
    }

    @Override
    public List<Notification> getNotificationsByReceiver(Long receiverId) {
        return notificationRepository.findByReceiverId(receiverId);
    }

    @Override
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow();
        notification.setReadFlag(true);
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> markAllAsRead(Long receiverId) {
        List<Notification> notifications = notificationRepository.findByReceiverIdAndReadFlagFalse(receiverId);
        notifications.forEach(n -> n.setReadFlag(true));
        return notificationRepository.saveAll(notifications);
    }

    @Override
    public Long getUnreadCount(Long receiverId) {
        return notificationRepository.countByReceiverIdAndReadFlagFalse(receiverId);
    }

    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
    // === EVENT HANDLERS ===
    @Override
    public void handleApplicationSubmitted(ApplicationSubmittedEvent event) {
        String title = "Ứng viên mới ứng tuyển";
        String message = String.format("%s đã ứng tuyển vào tin \"%s\"",
                event.getCandidateName(), event.getJobTitle());

        saveAndSend(event.getEmployerId(), title, message);
    }

    @Override
    public void handleJobApproved(JobApprovedEvent event) {
        String title = "Tin tuyển dụng được duyệt";
        String message = "Tin tuyển dụng \"" + event.getJobTitle() + "\" của bạn đã được phê duyệt.";

        saveAndSend(event.getEmployerId(), title, message);
    }

    @Override
    public void handleJobRejected(JobRejectedEvent event) {
        String title = "Tin tuyển dụng bị từ chối";
        String reason = event.getRejectReason() != null ? event.getRejectReason() : "Không phù hợp";
        String message = String.format("Tin \"%s\" của bạn đã bị từ chối. Lý do: %s", event.getJobTitle(), reason);

        saveAndSend(event.getEmployerId(), title, message);
    }

    @Override
    public void handleApplicationStatusChanged(ApplicationStatusChangedEvent event) {
        String title;
        String message;

        if ("APPROVED".equals(event.getStatus())) {
            title = "Hồ sơ ứng tuyển được duyệt";
            message = String.format("Chúc mừng! Hồ sơ ứng tuyển của bạn vào tin \"%s\" đã được duyệt.", event.getJobTitle());
        } else {
            title = "Hồ sơ ứng tuyển bị từ chối";
            String reason = event.getRejectReason() != null ? event.getRejectReason() : "Không phù hợp";
            message = String.format("Hồ sơ ứng tuyển vào tin \"%s\" bị từ chối. Lý do: %s", event.getJobTitle(), reason);
        }

        saveAndSend(event.getCandidateId(), title, message);
    }
}
