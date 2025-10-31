package iuh.fit.se.notification_service.event;

import iuh.fit.se.notification_service.model.Notification;
import lombok.*;

@Getter
@AllArgsConstructor
public class NotificationCreatedEvent {
    private final Notification notification;
}
