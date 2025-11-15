package iuh.fit.se.message_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Message {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long conversationId;
    private Long senderId;
    private String senderType;
    private String content;
    private boolean isRead = false;
    private LocalDateTime readAt;
    private LocalDateTime createdAt = LocalDateTime.now();
}
