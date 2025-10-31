package iuh.fit.se.notification_service.service.listener;

import iuh.fit.se.notification_service.event.NotificationCreatedEvent;
import iuh.fit.se.notification_service.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class NotificationEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onNotificationCreated(NotificationCreatedEvent event) {
        Notification n = event.getNotification();
        String topic = "/topic/notifications/" + n.getReceiverId();

        messagingTemplate.convertAndSend(topic, n);
        System.out.println("📤 Sent WS notification to: " + topic);
    }
}
