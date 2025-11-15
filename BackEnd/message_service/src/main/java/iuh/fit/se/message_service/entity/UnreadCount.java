package iuh.fit.se.message_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "unread_counts", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"conversation_id", "user_id", "user_type"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnreadCount {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long conversationId;
    private Long userId;
    private String userType;
    private int count = 0;
}
