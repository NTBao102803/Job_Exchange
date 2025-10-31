package iuh.fit.se.notification_service.repository;


import iuh.fit.se.notification_service.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiverId(Long receiverId);
    List<Notification> findByReceiverIdAndReadFlagFalse(Long receiverId);
    Long countByReceiverIdAndReadFlagFalse(Long receiverId);
}
