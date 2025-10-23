package iuh.fit.se.notification_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Builder
@NoArgsConstructor @AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long recipientId; // ID employer
    private String title;
    private String message;
    private boolean readFlag = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
