package iuh.fit.se.message_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.ZoneId;

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
    @Column(name = "read_at")
    private LocalDateTime readAt;
    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
}
