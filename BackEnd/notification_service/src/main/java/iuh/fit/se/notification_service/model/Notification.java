package iuh.fit.se.notification_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long receiverId; // ID của employer hoặc user
    private String title;
    private String message;
    private boolean readFlag = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public Notification(Long receiverId, String title, String message) {
        this.receiverId = receiverId;
        this.title = title;
        this.message = message;
    }
}
