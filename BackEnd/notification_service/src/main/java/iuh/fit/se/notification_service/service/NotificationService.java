package iuh.fit.se.notification_service.service;

import iuh.fit.se.notification_service.dto.*;
import iuh.fit.se.notification_service.model.Notification;

import java.util.List;

public interface NotificationService {
    Notification sendNotification(Long receiverId, String title, String message);
    List<Notification> getNotificationsByReceiver(Long receiverId);
    Notification markAsRead(Long id);
    public List<Notification> markAllAsRead(Long receiverId);
    public Long getUnreadCount(Long receiverId);
    public void deleteNotification(Long id);

    // EVENT HANDLERS
    void handleApplicationSubmitted(ApplicationSubmittedEvent event);
    void handleJobApproved(JobApprovedEvent event);
    void handleJobRejected(JobRejectedEvent event);
    void handleApplicationStatusChanged(ApplicationStatusChangedEvent event);
}
