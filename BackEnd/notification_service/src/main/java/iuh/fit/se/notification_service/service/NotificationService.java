package iuh.fit.se.notification_service.service;

import iuh.fit.se.notification_service.dto.JobApprovedEvent;
import iuh.fit.se.notification_service.dto.NotificationEvent;
import iuh.fit.se.notification_service.model.Notification;

import java.util.List;

public interface NotificationService {
    Notification sendNotification(Long receiverId, String title, String message);
    List<Notification> getNotificationsByReceiver(Long receiverId);
    Notification markAsRead(Long id);
}
