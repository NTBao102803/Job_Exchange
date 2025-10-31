package iuh.fit.se.notification_service.service.impl;


import iuh.fit.se.notification_service.event.NotificationCreatedEvent;
import iuh.fit.se.notification_service.model.Notification;
import iuh.fit.se.notification_service.repository.NotificationRepository;
import iuh.fit.se.notification_service.service.NotificationService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;


@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // WebSocket push

    @Override
    public Notification sendNotification(Long receiverId, String title, String message) {
        Notification notification = new Notification(receiverId, title, message);
        Notification saved = notificationRepository.save(notification);

//        // Gửi qua WebSocket tới client
        messagingTemplate.convertAndSend("/topic/notifications/" + receiverId, saved);
        // ✅ Chỉ phát event, không gửi WebSocket trực tiếp ở đây
//        eventPublisher.publishEvent(new NotificationCreatedEvent(saved));
        return saved;
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
}
